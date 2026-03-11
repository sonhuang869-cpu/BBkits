<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Supplier;
use Illuminate\Support\Collection;

class PurchaseSuggestionService
{
    /**
     * Get purchase suggestions for materials below reorder point.
     */
    public function getSuggestions(array $filters = []): array
    {
        $query = Material::with(['supplier', 'category'])
            ->where('is_active', true)
            ->whereNotNull('minimum_stock')
            ->where('minimum_stock', '>', 0);

        // Filter by supplier
        if (!empty($filters['supplier_id'])) {
            $query->where('supplier_id', $filters['supplier_id']);
        }

        // Filter by category
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Get materials below minimum stock
        $materials = $query->get();

        $suggestions = [];
        $totalValue = 0;

        foreach ($materials as $material) {
            $availableStock = $this->getAvailableStock($material);

            // Skip if stock is above minimum
            if ($availableStock >= $material->minimum_stock) {
                continue;
            }

            $suggestion = $this->calculateSuggestion($material, $availableStock);

            if ($suggestion['suggested_quantity'] > 0) {
                $suggestions[] = $suggestion;
                $totalValue += $suggestion['estimated_cost'];
            }
        }

        // Sort by priority (critical first, then by lead time)
        usort($suggestions, function ($a, $b) {
            if ($a['priority'] !== $b['priority']) {
                return $a['priority'] === 'critical' ? -1 : 1;
            }
            return $b['lead_time_days'] <=> $a['lead_time_days'];
        });

        return [
            'suggestions' => $suggestions,
            'summary' => [
                'total_items' => count($suggestions),
                'critical_items' => count(array_filter($suggestions, fn($s) => $s['priority'] === 'critical')),
                'low_items' => count(array_filter($suggestions, fn($s) => $s['priority'] === 'low')),
                'total_estimated_cost' => $totalValue,
                'suppliers_involved' => count(array_unique(array_column($suggestions, 'supplier_id'))),
            ],
        ];
    }

    /**
     * Get suggestions grouped by supplier for easy ordering.
     */
    public function getSuggestionsBySupplier(array $filters = []): array
    {
        $result = $this->getSuggestions($filters);

        $bySupplier = [];
        foreach ($result['suggestions'] as $suggestion) {
            $supplierId = $suggestion['supplier_id'] ?? 0;
            $supplierName = $suggestion['supplier_name'] ?? 'Sem Fornecedor';

            if (!isset($bySupplier[$supplierId])) {
                $bySupplier[$supplierId] = [
                    'supplier_id' => $supplierId,
                    'supplier_name' => $supplierName,
                    'materials' => [],
                    'total_items' => 0,
                    'total_cost' => 0,
                ];
            }

            $bySupplier[$supplierId]['materials'][] = $suggestion;
            $bySupplier[$supplierId]['total_items']++;
            $bySupplier[$supplierId]['total_cost'] += $suggestion['estimated_cost'];
        }

        return [
            'by_supplier' => array_values($bySupplier),
            'summary' => $result['summary'],
        ];
    }

    /**
     * Calculate purchase suggestion for a single material.
     */
    protected function calculateSuggestion(Material $material, float $availableStock): array
    {
        $deficit = $material->minimum_stock - $availableStock;

        // Calculate target stock (minimum + safety buffer based on lead time)
        $safetyBuffer = $this->calculateSafetyBuffer($material);
        $targetStock = $material->minimum_stock + $safetyBuffer;

        // Calculate suggested quantity
        $suggestedQty = $targetStock - $availableStock;

        // Round up to purchase multiple if set
        if ($material->purchase_multiple && $material->purchase_multiple > 1) {
            $suggestedQty = ceil($suggestedQty / $material->purchase_multiple) * $material->purchase_multiple;
        }

        // Determine priority
        $stockPercentage = $availableStock / $material->minimum_stock * 100;
        $priority = $stockPercentage <= 25 ? 'critical' : 'low';

        return [
            'material_id' => $material->id,
            'material_name' => $material->name,
            'material_reference' => $material->reference,
            'category_name' => $material->category?->name ?? 'Sem Categoria',
            'unit' => $material->unit,
            'current_stock' => $material->current_stock,
            'available_stock' => $availableStock,
            'minimum_stock' => $material->minimum_stock,
            'deficit' => max(0, $deficit),
            'suggested_quantity' => max(0, $suggestedQty),
            'purchase_multiple' => $material->purchase_multiple ?? 1,
            'purchase_price' => $material->purchase_price ?? 0,
            'estimated_cost' => ($material->purchase_price ?? 0) * max(0, $suggestedQty),
            'supplier_id' => $material->supplier_id,
            'supplier_name' => $material->supplier?->name ?? 'Sem Fornecedor',
            'lead_time_days' => $material->lead_time_days ?? 0,
            'priority' => $priority,
            'stock_percentage' => round($stockPercentage, 1),
        ];
    }

    /**
     * Calculate safety buffer based on lead time and consumption.
     */
    protected function calculateSafetyBuffer(Material $material): float
    {
        // Get average daily consumption from last 30 days
        $avgDailyConsumption = $material->inventoryTransactions()
            ->where('type', 'consumption')
            ->where('created_at', '>=', now()->subDays(30))
            ->avg(\DB::raw('ABS(quantity)')) ?? 0;

        // Safety buffer = lead time days * average daily consumption
        $leadTimeDays = $material->lead_time_days ?? 7;

        return $avgDailyConsumption * $leadTimeDays;
    }

    /**
     * Get available stock (current stock minus reserved).
     */
    protected function getAvailableStock(Material $material): float
    {
        $reserved = $material->stockReservations()
            ->whereIn('status', ['reserved', 'partially_deducted'])
            ->sum('quantity_reserved');

        return max(0, $material->current_stock - $reserved);
    }

    /**
     * Bulk update reorder points for materials.
     */
    public function bulkUpdateReorderPoints(array $updates): array
    {
        $updated = 0;
        $errors = [];

        foreach ($updates as $update) {
            try {
                $material = Material::find($update['material_id']);
                if (!$material) {
                    $errors[] = "Material ID {$update['material_id']} not found";
                    continue;
                }

                $material->update([
                    'minimum_stock' => $update['minimum_stock'] ?? $material->minimum_stock,
                    'lead_time_days' => $update['lead_time_days'] ?? $material->lead_time_days,
                    'purchase_multiple' => $update['purchase_multiple'] ?? $material->purchase_multiple,
                ]);

                $updated++;
            } catch (\Exception $e) {
                $errors[] = "Error updating material {$update['material_id']}: " . $e->getMessage();
            }
        }

        return [
            'success' => empty($errors),
            'updated' => $updated,
            'errors' => $errors,
        ];
    }

    /**
     * Auto-calculate reorder points based on consumption history.
     */
    public function autoCalculateReorderPoints(int $daysHistory = 90, float $safetyFactor = 1.5): array
    {
        $materials = Material::where('is_active', true)->get();
        $suggestions = [];

        foreach ($materials as $material) {
            // Get average daily consumption
            $avgDailyConsumption = $material->inventoryTransactions()
                ->where('type', 'consumption')
                ->where('created_at', '>=', now()->subDays($daysHistory))
                ->avg(\DB::raw('ABS(quantity)')) ?? 0;

            if ($avgDailyConsumption <= 0) {
                continue;
            }

            $leadTimeDays = $material->lead_time_days ?? 7;

            // Suggested minimum = (lead time + safety) * daily consumption
            $suggestedMinimum = round(($leadTimeDays * $safetyFactor) * $avgDailyConsumption, 2);

            $suggestions[] = [
                'material_id' => $material->id,
                'material_name' => $material->name,
                'current_minimum' => $material->minimum_stock,
                'suggested_minimum' => $suggestedMinimum,
                'avg_daily_consumption' => round($avgDailyConsumption, 2),
                'lead_time_days' => $leadTimeDays,
            ];
        }

        return $suggestions;
    }
}
