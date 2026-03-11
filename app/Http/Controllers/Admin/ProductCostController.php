<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductCostService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductCostController extends Controller
{
    protected ProductCostService $costService;

    public function __construct(ProductCostService $costService)
    {
        $this->middleware(['auth', 'approved']);
        $this->costService = $costService;
    }

    /**
     * Display cost summary for all products.
     */
    public function index(Request $request)
    {
        $data = $this->costService->getAllProductsCostSummary();

        // Apply filters
        $products = collect($data['products']);

        if ($request->margin_status) {
            $products = $products->filter(fn($p) => $p['margin_status'] === $request->margin_status);
        }

        if ($request->search) {
            $search = strtolower($request->search);
            $products = $products->filter(fn($p) =>
                str_contains(strtolower($p['product_name']), $search) ||
                str_contains(strtolower($p['product_sku']), $search)
            );
        }

        // Sort
        $sortField = $request->sort ?? 'gross_margin_percent';
        $sortDir = $request->direction ?? 'asc';
        $products = $sortDir === 'asc'
            ? $products->sortBy($sortField)
            : $products->sortByDesc($sortField);

        return Inertia::render('Admin/ProductCosts/Index', [
            'products' => $products->values()->all(),
            'totals' => $data['totals'],
            'filters' => $request->only(['search', 'margin_status', 'sort', 'direction']),
        ]);
    }

    /**
     * Show detailed cost breakdown for a product.
     */
    public function show(Product $product, Request $request)
    {
        $size = $request->size;
        $color = $request->color;

        $costData = $this->costService->calculateCostWithMargin($product, $size, $color);
        $categoryBreakdown = $this->costService->getCostBreakdownByCategory($product);

        // Get available sizes and colors from product
        $sizes = $product->sizes ?? [];
        $colors = $product->colors ?? [];

        return Inertia::render('Admin/ProductCosts/Show', [
            'product' => $product,
            'costData' => $costData,
            'categoryBreakdown' => $categoryBreakdown,
            'sizes' => $sizes,
            'colors' => $colors,
            'selectedSize' => $size,
            'selectedColor' => $color,
        ]);
    }

    /**
     * Get cost data as JSON (for AJAX).
     */
    public function getCost(Product $product, Request $request)
    {
        $size = $request->size;
        $color = $request->color;

        $costData = $this->costService->calculateCostWithMargin($product, $size, $color);

        return response()->json($costData);
    }

    /**
     * Compare multiple products.
     */
    public function compare(Request $request)
    {
        $productIds = $request->product_ids ?? [];

        if (empty($productIds)) {
            $products = Product::where('is_active', true)
                ->whereHas('activeBom')
                ->orderBy('name')
                ->get(['id', 'name']);

            return Inertia::render('Admin/ProductCosts/Compare', [
                'availableProducts' => $products,
                'comparison' => null,
            ]);
        }

        $comparison = $this->costService->compareProductCosts($productIds);

        $products = Product::where('is_active', true)
            ->whereHas('activeBom')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/ProductCosts/Compare', [
            'availableProducts' => $products,
            'comparison' => $comparison,
            'selectedIds' => $productIds,
        ]);
    }

    /**
     * Calculate cost for a simulated sale.
     */
    public function simulateSale(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.color' => 'nullable|string',
        ]);

        $result = $this->costService->calculateSaleCost($validated['items']);

        return response()->json($result);
    }

    /**
     * Export cost report to PDF.
     */
    public function exportPdf(Request $request)
    {
        $data = $this->costService->getAllProductsCostSummary();

        // Apply filters if any
        $products = collect($data['products']);

        if ($request->margin_status) {
            $products = $products->filter(fn($p) => $p['margin_status'] === $request->margin_status);
        }

        $pdf = Pdf::loadView('pdf.product-costs', [
            'products' => $products->values()->all(),
            'totals' => $data['totals'],
            'generatedAt' => now()->format('d/m/Y H:i:s'),
            'generatedBy' => auth()->user()->name,
            'filterStatus' => $request->margin_status,
        ]);

        $filename = 'custos-produtos-' . now()->format('Y-m-d-His') . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Export single product cost to PDF.
     */
    public function exportProductPdf(Product $product)
    {
        $costData = $this->costService->calculateCostWithMargin($product);
        $categoryBreakdown = $this->costService->getCostBreakdownByCategory($product);

        $pdf = Pdf::loadView('pdf.product-cost-detail', [
            'product' => $product,
            'costData' => $costData,
            'categoryBreakdown' => $categoryBreakdown,
            'generatedAt' => now()->format('d/m/Y H:i:s'),
        ]);

        $filename = 'custo-' . $product->id . '-' . now()->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
