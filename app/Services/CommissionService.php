<?php

namespace App\Services;

use App\Models\User;
use App\Models\Sale;
use App\Models\Commission;
use App\Models\CommissionRange;
use App\Models\Fine;

class CommissionService
{
    const COMPANY_GOAL = 220000;
    const INDIVIDUAL_MINIMUM = 40000;

    public function calculateCommissionRate(float $monthlyTotal): float
    {
        if ($monthlyTotal < self::INDIVIDUAL_MINIMUM) {
            return 0;
        }

        // Get active commission ranges from database
        $range = CommissionRange::active()
            ->ordered()
            ->where('min_amount', '<=', $monthlyTotal)
            ->where(function ($query) use ($monthlyTotal) {
                $query->where('max_amount', '>=', $monthlyTotal)
                      ->orWhereNull('max_amount');
            })
            ->first();

        return $range ? $range->percentage : 0;
    }

    public function getCommissionRanges()
    {
        return CommissionRange::active()->ordered()->get();
    }

    public function getNextCommissionBracket(float $currentAmount): ?array
    {
        if ($currentAmount < self::INDIVIDUAL_MINIMUM) {
            return [
                'min_amount' => self::INDIVIDUAL_MINIMUM,
                'amount_needed' => self::INDIVIDUAL_MINIMUM - $currentAmount,
                'percentage' => $this->calculateCommissionRate(self::INDIVIDUAL_MINIMUM),
            ];
        }

        $nextRange = CommissionRange::active()
            ->ordered()
            ->where('min_amount', '>', $currentAmount)
            ->first();

        if ($nextRange) {
            return [
                'min_amount' => $nextRange->min_amount,
                'amount_needed' => $nextRange->min_amount - $currentAmount,
                'percentage' => $nextRange->percentage,
            ];
        }

        return null;
    }

    public function calculatePotentialEarnings(float $currentAmount, float $additionalAmount): array
    {
        $newTotal = $currentAmount + $additionalAmount;
        
        $currentRate = $this->calculateCommissionRate($currentAmount);
        $newRate = $this->calculateCommissionRate($newTotal);
        
        $currentCommission = $currentAmount * ($currentRate / 100);
        $newCommission = $newTotal * ($newRate / 100);
        
        return [
            'current_commission' => $currentCommission,
            'new_commission' => $newCommission,
            'additional_commission' => $newCommission - $currentCommission,
            'current_rate' => $currentRate,
            'new_rate' => $newRate,
        ];
    }

    public function createCommissionForSale(Sale $sale): ?Commission
    {
        if (!$sale->isApproved()) {
            return null;
        }

        $month = $sale->payment_date->month;
        $year = $sale->payment_date->year;
        
        $monthlyTotal = $sale->user->getMonthlySalesTotal($month, $year);
        $commissionRate = $this->calculateCommissionRate($monthlyTotal);
        
        if ($commissionRate === 0) {
            return null;
        }

        $baseAmount = $sale->getCommissionBaseAmount();
        $commissionAmount = $baseAmount * ($commissionRate / 100);

        return Commission::create([
            'user_id' => $sale->user_id,
            'sale_id' => $sale->id,
            'commission_rate' => $commissionRate,
            'commission_amount' => $commissionAmount,
            'base_amount' => $baseAmount,
            'month' => $month,
            'year' => $year
        ]);
    }

    public function recalculateMonthlyCommissions(User $user, int $month, int $year): void
    {
        $user->commissions()
            ->where('month', $month)
            ->where('year', $year)
            ->delete();

        $sales = $user->sales()
            ->whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month)
            ->where('status', 'aprovado')
            ->get();

        foreach ($sales as $sale) {
            $this->createCommissionForSale($sale);
        }
    }

    public function getMonthlyProgress(User $user, int $month, int $year): array
    {
        $monthlyTotal = $user->getMonthlySalesTotal($month, $year);
        $commission = $user->getMonthlyCommissionTotal($month, $year);
        
        // Calculate commission base for accurate rate calculation
        // Uses getCommissionBaseAmount() which properly calculates from SalePayment records
        $commissionBase = $user->sales()
            ->where('status', 'aprovado')
            ->whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month)
            ->get()
            ->sum(function ($sale) {
                return $sale->getCommissionBaseAmount();
            });
        
        $progress = ($commissionBase / self::INDIVIDUAL_MINIMUM) * 100;

        // Get next bracket info using commission base
        $nextBracket = $this->getNextCommissionBracket($commissionBase);
        
        // Calculate potential earnings for different scenarios
        $potentialEarnings = null;
        if ($nextBracket) {
            $potentialEarnings = $this->calculatePotentialEarnings(
                $commissionBase, 
                $nextBracket['amount_needed']
            );
        }

        // Get opportunity alert
        $opportunityAlert = null;
        if ($commissionBase < self::INDIVIDUAL_MINIMUM) {
            $amountNeeded = self::INDIVIDUAL_MINIMUM - $commissionBase;
            $minimumRate = $this->calculateCommissionRate(self::INDIVIDUAL_MINIMUM);
            $potentialCommission = self::INDIVIDUAL_MINIMUM * ($minimumRate / 100);
            $opportunityAlert = [
                'message' => "Se você atingir R$ " . number_format(self::INDIVIDUAL_MINIMUM, 2, '.', ',') . 
                           " até o final do mês, você poderá ganhar R$ " . 
                           number_format($potentialCommission, 2, '.', ',') . 
                           " de comissão! Não perca essa chance!",
                'amount_needed' => $amountNeeded,
                'potential_commission' => $potentialCommission,
            ];
        }

        $fineDeductions = $this->calculateFineDeductions($user, $month, $year);

        return [
            'monthly_total' => $monthlyTotal,
            'commission_total' => max($commission - $fineDeductions['total_deductions'], 0),
            'progress_percentage' => min($progress, 100),
            'remaining_to_goal' => max(self::INDIVIDUAL_MINIMUM - $commissionBase, 0),
            'current_rate' => $this->calculateCommissionRate($commissionBase),
            'next_bracket' => $nextBracket,
            'potential_earnings' => $potentialEarnings,
            'opportunity_alert' => $opportunityAlert,
            'commission_ranges' => $this->getCommissionRanges(),
            'fine_deductions' => $fineDeductions,
        ];
    }

    public function calculateFineDeductions(User $user, int $month, int $year): array
    {
        $fines = $user->fines()
            ->where('status', 'active')
            ->whereYear('applied_at', $year)
            ->whereMonth('applied_at', $month)
            ->get();

        $commissionOnlyDeductions = 0;
        $additionalDeductions = 0;
        $outstandingBalance = 0;

        foreach ($fines as $fine) {
            if ($fine->type === 'commission_only') {
                $commissionOnlyDeductions += $fine->amount;
            } else {
                $additionalDeductions += $fine->amount;
                $outstandingBalance += $fine->outstanding_balance;
            }
        }

        return [
            'commission_only' => $commissionOnlyDeductions,
            'additional' => $additionalDeductions,
            'outstanding_balance' => $outstandingBalance,
            'total_deductions' => $commissionOnlyDeductions + $additionalDeductions,
            'fines_count' => $fines->count(),
        ];
    }

    public function applyFineDeductions(User $user, float $commissionAmount, int $month, int $year): float
    {
        $outstandingFines = $user->fines()
            ->where('status', 'active')
            ->where('outstanding_balance', '>', 0)
            ->orderBy('applied_at')
            ->get();

        $remainingCommission = $commissionAmount;

        foreach ($outstandingFines as $fine) {
            if ($remainingCommission <= 0) break;

            $deductionAmount = min($remainingCommission, $fine->outstanding_balance);
            
            $fine->outstanding_balance -= $deductionAmount;
            if ($fine->outstanding_balance <= 0) {
                $fine->status = 'paid';
            }
            $fine->save();

            $remainingCommission -= $deductionAmount;
        }

        return max($remainingCommission, 0);
    }
}
