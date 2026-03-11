<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductBOM;
use App\Models\Material;
use Illuminate\Support\Collection;

class ProductCostService
{
    /**
     * Calculate the production cost for a product based on its BOM.
     */
    public function calculateProductCost(Product $product, ?string $size = null, ?string $color = null): array
    {
        $bom = $product->activeBom;

        if ($bom->isEmpty()) {
            return [
                'success' => false,
                'error' => 'Produto não possui BOM cadastrado',
                'material_cost' => 0,
                'materials' => [],
            ];
        }

        $materials = [];
        $totalMaterialCost = 0;

        foreach ($bom as $bomItem) {
            $material = $bomItem->material;
            if (!$material) {
                continue;
            }

            // Get quantity (check for size/color variants)
            $quantity = $this->getQuantityForVariant($bomItem, $size, $color);
            $unitCost = $material->purchase_price ?? 0;
            $itemCost = $quantity * $unitCost;

            $materials[] = [
                'material_id' => $material->id,
                'material_name' => $material->name,
                'material_reference' => $material->reference,
                'unit' => $material->unit,
                'quantity' => $quantity,
                'unit_cost' => $unitCost,
                'total_cost' => $itemCost,
                'category' => $material->category?->name ?? 'Sem Categoria',
            ];

            $totalMaterialCost += $itemCost;
        }

        return [
            'success' => true,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'size' => $size,
            'color' => $color,
            'material_cost' => round($totalMaterialCost, 2),
            'materials' => $materials,
            'materials_count' => count($materials),
        ];
    }

    /**
     * Get quantity for a BOM item considering size/color variants.
     */
    protected function getQuantityForVariant(ProductBOM $bomItem, ?string $size, ?string $color): float
    {
        // Check if there's a specific variant
        if ($size || $color) {
            $variant = $bomItem->variants()
                ->where(function ($q) use ($size, $color) {
                    if ($size) {
                        $q->where('size', $size);
                    }
                    if ($color) {
                        $q->where('color', $color);
                    }
                })
                ->first();

            if ($variant) {
                return $variant->quantity;
            }
        }

        return $bomItem->quantity;
    }

    /**
     * Calculate cost with profit margin analysis.
     */
    public function calculateCostWithMargin(Product $product, ?string $size = null, ?string $color = null): array
    {
        $costData = $this->calculateProductCost($product, $size, $color);

        if (!$costData['success']) {
            return $costData;
        }

        $materialCost = $costData['material_cost'];
        $sellingPrice = $product->price ?? 0;

        // Calculate margins
        $grossProfit = $sellingPrice - $materialCost;
        $grossMarginPercent = $sellingPrice > 0 ? ($grossProfit / $sellingPrice) * 100 : 0;
        $markup = $materialCost > 0 ? (($sellingPrice - $materialCost) / $materialCost) * 100 : 0;

        return array_merge($costData, [
            'selling_price' => $sellingPrice,
            'gross_profit' => round($grossProfit, 2),
            'gross_margin_percent' => round($grossMarginPercent, 1),
            'markup_percent' => round($markup, 1),
            'cost_percent_of_price' => $sellingPrice > 0 ? round(($materialCost / $sellingPrice) * 100, 1) : 0,
        ]);
    }

    /**
     * Get cost summary for all products.
     */
    public function getAllProductsCostSummary(): array
    {
        $products = Product::where('is_active', true)
            ->whereHas('activeBom')
            ->with(['activeBom.material'])
            ->get();

        $summary = [];
        $totals = [
            'total_products' => 0,
            'avg_material_cost' => 0,
            'avg_margin' => 0,
            'low_margin_count' => 0,
            'no_bom_count' => 0,
        ];

        $totalCost = 0;
        $totalMargin = 0;

        foreach ($products as $product) {
            $costData = $this->calculateCostWithMargin($product);

            if (!$costData['success']) {
                $totals['no_bom_count']++;
                continue;
            }

            $summary[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku ?? '-',
                'selling_price' => $costData['selling_price'],
                'material_cost' => $costData['material_cost'],
                'gross_profit' => $costData['gross_profit'],
                'gross_margin_percent' => $costData['gross_margin_percent'],
                'markup_percent' => $costData['markup_percent'],
                'materials_count' => $costData['materials_count'],
                'margin_status' => $this->getMarginStatus($costData['gross_margin_percent']),
            ];

            $totalCost += $costData['material_cost'];
            $totalMargin += $costData['gross_margin_percent'];
            $totals['total_products']++;

            if ($costData['gross_margin_percent'] < 30) {
                $totals['low_margin_count']++;
            }
        }

        if ($totals['total_products'] > 0) {
            $totals['avg_material_cost'] = round($totalCost / $totals['total_products'], 2);
            $totals['avg_margin'] = round($totalMargin / $totals['total_products'], 1);
        }

        // Sort by margin (lowest first for attention)
        usort($summary, fn($a, $b) => $a['gross_margin_percent'] <=> $b['gross_margin_percent']);

        return [
            'products' => $summary,
            'totals' => $totals,
        ];
    }

    /**
     * Get margin status label.
     */
    protected function getMarginStatus(float $margin): string
    {
        if ($margin < 20) {
            return 'critical';
        }
        if ($margin < 30) {
            return 'low';
        }
        if ($margin < 50) {
            return 'normal';
        }
        return 'good';
    }

    /**
     * Simulate cost for a sale order.
     */
    public function calculateSaleCost(array $saleProducts): array
    {
        $totalCost = 0;
        $items = [];

        foreach ($saleProducts as $item) {
            $product = Product::find($item['product_id']);
            if (!$product) {
                continue;
            }

            $quantity = $item['quantity'] ?? 1;
            $size = $item['size'] ?? null;
            $color = $item['color'] ?? null;

            $costData = $this->calculateProductCost($product, $size, $color);

            if ($costData['success']) {
                $unitCost = $costData['material_cost'];
                $lineCost = $unitCost * $quantity;

                $items[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $quantity,
                    'size' => $size,
                    'color' => $color,
                    'unit_cost' => $unitCost,
                    'line_cost' => $lineCost,
                    'materials' => $costData['materials'],
                ];

                $totalCost += $lineCost;
            }
        }

        return [
            'success' => true,
            'items' => $items,
            'total_material_cost' => round($totalCost, 2),
            'items_count' => count($items),
        ];
    }

    /**
     * Get cost breakdown by material category.
     */
    public function getCostBreakdownByCategory(Product $product): array
    {
        $costData = $this->calculateProductCost($product);

        if (!$costData['success']) {
            return $costData;
        }

        $byCategory = [];
        foreach ($costData['materials'] as $material) {
            $category = $material['category'];
            if (!isset($byCategory[$category])) {
                $byCategory[$category] = [
                    'category' => $category,
                    'materials' => [],
                    'total_cost' => 0,
                    'percentage' => 0,
                ];
            }
            $byCategory[$category]['materials'][] = $material;
            $byCategory[$category]['total_cost'] += $material['total_cost'];
        }

        // Calculate percentages
        $totalCost = $costData['material_cost'];
        foreach ($byCategory as &$cat) {
            $cat['percentage'] = $totalCost > 0 ? round(($cat['total_cost'] / $totalCost) * 100, 1) : 0;
        }

        // Sort by cost descending
        usort($byCategory, fn($a, $b) => $b['total_cost'] <=> $a['total_cost']);

        return [
            'success' => true,
            'product_name' => $product->name,
            'total_cost' => $totalCost,
            'categories' => array_values($byCategory),
        ];
    }

    /**
     * Compare costs between products.
     */
    public function compareProductCosts(array $productIds): array
    {
        $products = Product::whereIn('id', $productIds)->get();
        $comparison = [];

        foreach ($products as $product) {
            $costData = $this->calculateCostWithMargin($product);
            if ($costData['success']) {
                $comparison[] = $costData;
            }
        }

        return [
            'success' => true,
            'products' => $comparison,
            'count' => count($comparison),
        ];
    }
}
