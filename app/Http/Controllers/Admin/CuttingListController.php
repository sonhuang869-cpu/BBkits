<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CuttingListService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class CuttingListController extends Controller
{
    protected CuttingListService $cuttingListService;

    public function __construct(CuttingListService $cuttingListService)
    {
        $this->cuttingListService = $cuttingListService;
        $this->middleware(['auth', 'approved']);
    }

    /**
     * Display the cutting list generator page.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['date_from', 'date_to', 'status']);

        // Get eligible orders
        $eligibleOrders = $this->cuttingListService->getEligibleOrders($filters);

        return Inertia::render('Admin/CuttingList/Index', [
            'eligibleOrders' => $eligibleOrders->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'client_name' => $sale->client_name,
                    'order_status' => $sale->order_status,
                    'created_at' => $sale->created_at->format('d/m/Y'),
                    'total_amount' => $sale->total_amount,
                    'products_count' => $sale->saleProducts->count(),
                    'products' => $sale->saleProducts->map(function ($sp) {
                        return [
                            'name' => $sp->product->name ?? 'N/A',
                            'quantity' => $sp->quantity,
                            'size' => $sp->size,
                            'color' => $sp->product_color,
                        ];
                    }),
                ];
            }),
            'filters' => $filters,
        ]);
    }

    /**
     * Generate cutting list for selected orders.
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'sale_ids' => 'required|array|min:1',
            'sale_ids.*' => 'exists:sales,id',
        ]);

        $cuttingList = $this->cuttingListService->generateCuttingList($validated['sale_ids']);

        if ($request->wantsJson()) {
            return response()->json($cuttingList);
        }

        return Inertia::render('Admin/CuttingList/View', [
            'cuttingList' => $cuttingList,
            'selectedOrderIds' => $validated['sale_ids'],
        ]);
    }

    /**
     * Export cutting list as PDF.
     */
    public function exportPdf(Request $request)
    {
        $validated = $request->validate([
            'sale_ids' => 'required|array|min:1',
            'sale_ids.*' => 'exists:sales,id',
            'group_by_category' => 'boolean',
        ]);

        $cuttingList = $this->cuttingListService->generateCuttingList($validated['sale_ids']);

        if (!$cuttingList['success']) {
            return back()->withErrors(['error' => 'Erro ao gerar lista de corte.']);
        }

        // Group by category if requested
        $groupedMaterials = null;
        if ($request->boolean('group_by_category', true)) {
            $groupedMaterials = $this->cuttingListService->groupByCategory($cuttingList['materials']);
        }

        $pdf = Pdf::loadView('pdf.cutting-list', [
            'cuttingList' => $cuttingList,
            'groupedMaterials' => $groupedMaterials,
            'generatedAt' => now()->format('d/m/Y H:i:s'),
            'generatedBy' => auth()->user()->name,
        ]);

        $filename = 'lista-corte-' . now()->format('Y-m-d-His') . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Preview cutting list (JSON response for AJAX).
     */
    public function preview(Request $request)
    {
        $validated = $request->validate([
            'sale_ids' => 'required|array|min:1',
            'sale_ids.*' => 'exists:sales,id',
        ]);

        $cuttingList = $this->cuttingListService->generateCuttingList($validated['sale_ids']);

        return response()->json($cuttingList);
    }
}
