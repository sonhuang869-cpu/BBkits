<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialCategory;
use App\Models\Supplier;
use App\Services\PurchaseSuggestionService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseSuggestionController extends Controller
{
    protected PurchaseSuggestionService $suggestionService;

    public function __construct(PurchaseSuggestionService $suggestionService)
    {
        $this->middleware(['auth', 'approved']);
        $this->suggestionService = $suggestionService;
    }

    /**
     * Display purchase suggestions page.
     */
    public function index(Request $request)
    {
        $filters = [
            'supplier_id' => $request->get('supplier_id'),
            'category_id' => $request->get('category_id'),
        ];

        $groupBySupplier = $request->boolean('group_by_supplier', true);

        if ($groupBySupplier) {
            $data = $this->suggestionService->getSuggestionsBySupplier($filters);
        } else {
            $data = $this->suggestionService->getSuggestions($filters);
        }

        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);
        $categories = MaterialCategory::active()->ordered()->get(['id', 'name']);

        return Inertia::render('Admin/PurchaseSuggestions/Index', [
            'suggestions' => $data['suggestions'] ?? [],
            'bySupplier' => $data['by_supplier'] ?? [],
            'summary' => $data['summary'],
            'suppliers' => $suppliers,
            'categories' => $categories,
            'filters' => $filters,
            'groupBySupplier' => $groupBySupplier,
        ]);
    }

    /**
     * Get suggestions as JSON (for AJAX).
     */
    public function getSuggestions(Request $request)
    {
        $filters = [
            'supplier_id' => $request->get('supplier_id'),
            'category_id' => $request->get('category_id'),
        ];

        $groupBySupplier = $request->boolean('group_by_supplier', false);

        if ($groupBySupplier) {
            $data = $this->suggestionService->getSuggestionsBySupplier($filters);
        } else {
            $data = $this->suggestionService->getSuggestions($filters);
        }

        return response()->json($data);
    }

    /**
     * Export purchase suggestions to PDF.
     */
    public function exportPdf(Request $request)
    {
        $filters = [
            'supplier_id' => $request->get('supplier_id'),
            'category_id' => $request->get('category_id'),
        ];

        $data = $this->suggestionService->getSuggestionsBySupplier($filters);

        $pdf = Pdf::loadView('pdf.purchase-suggestions', [
            'bySupplier' => $data['by_supplier'],
            'summary' => $data['summary'],
            'generatedAt' => now()->format('d/m/Y H:i:s'),
            'generatedBy' => auth()->user()->name,
        ]);

        $filename = 'sugestoes-compra-' . now()->format('Y-m-d-His') . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Reorder point configuration page.
     */
    public function reorderConfig(Request $request)
    {
        $query = Material::with(['category', 'supplier'])
            ->where('is_active', true);

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('supplier_id') && $request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        $materials = $query->orderBy('name')->paginate(50);

        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);
        $categories = MaterialCategory::active()->ordered()->get(['id', 'name']);

        return Inertia::render('Admin/PurchaseSuggestions/ReorderConfig', [
            'materials' => $materials,
            'suppliers' => $suppliers,
            'categories' => $categories,
            'filters' => [
                'search' => $request->get('search'),
                'category_id' => $request->get('category_id'),
                'supplier_id' => $request->get('supplier_id'),
            ],
        ]);
    }

    /**
     * Bulk update reorder points.
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array|min:1',
            'updates.*.material_id' => 'required|exists:materials,id',
            'updates.*.minimum_stock' => 'nullable|numeric|min:0',
            'updates.*.lead_time_days' => 'nullable|integer|min:0',
            'updates.*.purchase_multiple' => 'nullable|integer|min:1',
        ]);

        $result = $this->suggestionService->bulkUpdateReorderPoints($validated['updates']);

        if ($result['success']) {
            return back()->with('success', "Atualizado {$result['updated']} material(is) com sucesso!");
        }

        return back()->withErrors(['bulk' => implode(', ', $result['errors'])]);
    }

    /**
     * Auto-calculate reorder points based on consumption.
     */
    public function autoCalculate(Request $request)
    {
        $daysHistory = $request->get('days_history', 90);
        $safetyFactor = $request->get('safety_factor', 1.5);

        $suggestions = $this->suggestionService->autoCalculateReorderPoints($daysHistory, $safetyFactor);

        return response()->json([
            'success' => true,
            'suggestions' => $suggestions,
            'parameters' => [
                'days_history' => $daysHistory,
                'safety_factor' => $safetyFactor,
            ],
        ]);
    }

    /**
     * Apply auto-calculated reorder points.
     */
    public function applyAutoCalculated(Request $request)
    {
        $validated = $request->validate([
            'material_ids' => 'required|array|min:1',
            'material_ids.*' => 'exists:materials,id',
            'days_history' => 'nullable|integer|min:7|max:365',
            'safety_factor' => 'nullable|numeric|min:1|max:5',
        ]);

        $daysHistory = $validated['days_history'] ?? 90;
        $safetyFactor = $validated['safety_factor'] ?? 1.5;

        $suggestions = $this->suggestionService->autoCalculateReorderPoints($daysHistory, $safetyFactor);

        // Filter to only selected materials
        $selectedIds = $validated['material_ids'];
        $updates = array_filter($suggestions, fn($s) => in_array($s['material_id'], $selectedIds));

        // Convert to update format
        $updateData = array_map(function ($s) {
            return [
                'material_id' => $s['material_id'],
                'minimum_stock' => $s['suggested_minimum'],
            ];
        }, $updates);

        $result = $this->suggestionService->bulkUpdateReorderPoints($updateData);

        if ($result['success']) {
            return back()->with('success', "Atualizado {$result['updated']} ponto(s) de reposição com sucesso!");
        }

        return back()->withErrors(['auto' => implode(', ', $result['errors'])]);
    }
}
