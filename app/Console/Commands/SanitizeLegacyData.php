<?php

namespace App\Console\Commands;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SanitizeLegacyData extends Command
{
    protected $signature = 'data:sanitize-legacy {--fix : Actually apply the fixes}';
    protected $description = 'Sanitize legacy data: XSS, invalid CPF, zero totals, etc.';

    public function handle()
    {
        $this->info('=== Legacy Data Sanitization ===');
        $this->newLine();

        $isDryRun = !$this->option('fix');
        if ($isDryRun) {
            $this->warn('DRY RUN MODE - No changes will be made. Use --fix to apply changes.');
            $this->newLine();
        }

        // 1. Sanitize XSS in text fields
        $this->sanitizeXssInSales($isDryRun);

        // 2. Fix zero total amounts
        $this->fixZeroTotals($isDryRun);

        // 3. Clear invalid CPFs
        $this->clearInvalidCpfs($isDryRun);

        // 4. Fix incorrect remaining amounts
        $this->fixIncorrectRemaining($isDryRun);

        $this->newLine();
        $this->info('=== Sanitization Complete ===');

        if ($isDryRun) {
            $this->newLine();
            $this->warn('Run with --fix to apply changes: php artisan data:sanitize-legacy --fix');
        }

        return Command::SUCCESS;
    }

    private function sanitizeXssInSales(bool $isDryRun): void
    {
        $this->info('1. Checking for XSS in text fields...');

        $fieldsToSanitize = [
            'client_name', 'child_name', 'notes', 'admin_notes',
            'delivery_address', 'delivery_complement', 'delivery_neighborhood',
            'delivery_city', 'mesa_livre_details', 'embroidery_text'
        ];

        $xssPatterns = ['<script', '<?php', 'javascript:', 'onerror=', 'onload=', '<iframe'];
        $foundCount = 0;
        $fixedCount = 0;

        Sale::chunk(100, function ($sales) use ($fieldsToSanitize, $xssPatterns, $isDryRun, &$foundCount, &$fixedCount) {
            foreach ($sales as $sale) {
                foreach ($fieldsToSanitize as $field) {
                    $value = $sale->$field;
                    if ($value) {
                        foreach ($xssPatterns as $pattern) {
                            if (stripos($value, $pattern) !== false) {
                                $foundCount++;
                                $this->line("  Found XSS in Sale #{$sale->id}, field: {$field}");

                                if (!$isDryRun) {
                                    $sale->$field = htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
                                    $sale->save();
                                    $fixedCount++;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        });

        $this->info("  Found: {$foundCount} fields with potential XSS");
        if (!$isDryRun) {
            $this->info("  Fixed: {$fixedCount} fields");
        }
    }

    private function fixZeroTotals(bool $isDryRun): void
    {
        $this->info('2. Checking for zero total amounts...');

        $zeroTotals = Sale::where('total_amount', 0)
            ->orWhereNull('total_amount')
            ->count();

        $this->info("  Found: {$zeroTotals} sales with zero/null total");

        if (!$isDryRun && $zeroTotals > 0) {
            // For sales with products, recalculate from products
            $fixed = 0;
            Sale::where('total_amount', 0)
                ->orWhereNull('total_amount')
                ->with('saleProducts')
                ->chunk(50, function ($sales) use (&$fixed) {
                    foreach ($sales as $sale) {
                        $productTotal = $sale->saleProducts->sum(function ($p) {
                            return $p->unit_price * $p->quantity;
                        });

                        if ($productTotal > 0) {
                            $sale->total_amount = $productTotal;
                            $sale->save();
                            $fixed++;
                        }
                    }
                });

            $this->info("  Fixed: {$fixed} sales (recalculated from products)");
        }
    }

    private function clearInvalidCpfs(bool $isDryRun): void
    {
        $this->info('3. Checking for invalid CPFs...');

        $invalidCount = 0;
        $fixedCount = 0;

        Sale::whereNotNull('client_cpf')
            ->where('client_cpf', '!=', '')
            ->chunk(100, function ($sales) use ($isDryRun, &$invalidCount, &$fixedCount) {
                foreach ($sales as $sale) {
                    if (!$this->isValidCPF($sale->client_cpf)) {
                        $invalidCount++;

                        if (!$isDryRun) {
                            // Clear invalid CPF
                            $sale->client_cpf = null;
                            $sale->save();
                            $fixedCount++;
                        }
                    }
                }
            });

        $this->info("  Found: {$invalidCount} invalid CPFs");
        if (!$isDryRun) {
            $this->info("  Cleared: {$fixedCount} invalid CPFs");
        }
    }

    private function fixIncorrectRemaining(bool $isDryRun): void
    {
        $this->info('4. Checking for incorrect remaining amounts...');

        // This is calculated dynamically in the model, so no fix needed
        // Just report any potential issues

        $salesWithPayments = Sale::has('payments')->count();
        $this->info("  Sales with payments: {$salesWithPayments}");
        $this->info("  Remaining amounts are calculated dynamically - no fix needed");
    }

    private function isValidCPF(?string $cpf): bool
    {
        if (empty($cpf)) {
            return false;
        }

        // Remove non-numeric characters
        $cpf = preg_replace('/[^0-9]/', '', $cpf);

        // Must have 11 digits
        if (strlen($cpf) !== 11) {
            return false;
        }

        // Check for known invalid patterns
        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        // Validate check digits
        for ($t = 9; $t < 11; $t++) {
            $sum = 0;
            for ($i = 0; $i < $t; $i++) {
                $sum += $cpf[$i] * (($t + 1) - $i);
            }
            $digit = ((10 * $sum) % 11) % 10;
            if ($cpf[$t] != $digit) {
                return false;
            }
        }

        return true;
    }
}
