<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MaterialController extends Controller
{
    public function __construct()
    {
        // BUG-N01: Added 'stats' to middleware - was missing authentication
        $this->middleware(['auth:sanctum', 'materials.access:view'])->only(['index', 'show', 'stats']);
        $this->middleware(['auth:sanctum', 'materials.access:edit'])->only(['store', 'update', 'adjustStock']);
        $this->middleware(['auth:sanctum', 'materials.access:delete'])->only(['destroy']);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Material::with(['supplier']);

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            switch ($request->get('status')) {
                case 'low_stock':
                    $query->whereRaw('current_stock <= minimum_stock');
                    break;
                case 'out_of_stock':
                    $query->where('current_stock', '<=', 0);
                    break;
                case 'active':
                    $query->where('current_stock', '>', 0)
                          ->whereRaw('current_stock > minimum_stock');
                    break;
            }
        }

        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->get('supplier_id'));
        }

        $perPage = min($request->get('per_page', 15), 100);
        $materials = $query->orderBy('name')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $materials->items(),
            'meta' => [
                'current_page' => $materials->currentPage(),
                'last_page' => $materials->lastPage(),
                'per_page' => $materials->perPage(),
                'total' => $materials->total(),
                'from' => $materials->firstItem(),
                'to' => $materials->lastItem(),
            ],
            'links' => [
                'first' => $materials->url(1),
                'last' => $materials->url($materials->lastPage()),
                'prev' => $materials->previousPageUrl(),
                'next' => $materials->nextPageUrl(),
            ]
        ]);
    }

    public function show(Material $material): JsonResponse
    {
        $material->load(['supplier', 'inventoryTransactions' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return response()->json([
            'success' => true,
            'data' => $material
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'reference' => 'required|string|max:100|unique:materials',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:50',
            'current_stock' => 'required|numeric|min:0',
            'minimum_stock' => 'required|numeric|min:0',
            'purchase_price' => 'required|numeric|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        $material = Material::create($validated);
        $material->load('supplier');

        return response()->json([
            'success' => true,
            'message' => 'Material criado com sucesso.',
            'data' => $material
        ], 201);
    }

    public function update(Request $request, Material $material): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'reference' => ['required', 'string', 'max:100', Rule::unique('materials')->ignore($material->id)],
            'description' => 'nullable|string',
            'unit' => 'required|string|max:50',
            'minimum_stock' => 'required|numeric|min:0',
            'purchase_price' => 'required|numeric|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        $material->update($validated);
        $material->load('supplier');

        return response()->json([
            'success' => true,
            'message' => 'Material atualizado com sucesso.',
            'data' => $material
        ]);
    }

    public function destroy(Material $material): JsonResponse
    {
        try {
            $material->delete();

            return response()->json([
                'success' => true,
                'message' => 'Material excluído com sucesso.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Não é possível excluir material: pode haver transações associadas.'
            ], 422);
        }
    }

    public function adjustStock(Request $request, Material $material): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric',
            'type' => 'required|in:adjustment,purchase,consumption,return',
            'notes' => 'nullable|string|max:255',
            'reference' => 'nullable|string|max:100',
        ]);

        $oldStock = $material->current_stock;
        $newStock = $oldStock + $validated['quantity'];

        if ($newStock < 0) {
            return response()->json([
                'success' => false,
                'message' => 'Estoque insuficiente para esta operação.'
            ], 422);
        }

        // Create inventory transaction
        $material->inventoryTransactions()->create([
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'notes' => $validated['notes'] ?? null,
            'reference' => $validated['reference'] ?? null,
            'user_id' => auth()->id(),
        ]);

        // Update material stock
        $material->update(['current_stock' => $newStock]);

        $material->load('supplier');

        return response()->json([
            'success' => true,
            'message' => 'Estoque ajustado com sucesso.',
            'data' => [
                'material' => $material,
                'old_stock' => $oldStock,
                'new_stock' => $newStock,
                'adjustment' => $validated['quantity']
            ]
        ]);
    }

    /**
     * BUG-N01: Fixed - Added try-catch, null handling, and authentication
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total_materials' => Material::count(),
                'active_materials' => Material::where('current_stock', '>', 0)
                    ->whereColumn('current_stock', '>', 'minimum_stock')
                    ->count(),
                'low_stock_materials' => Material::where('current_stock', '>', 0)
                    ->whereColumn('current_stock', '<=', 'minimum_stock')
                    ->count(),
                'out_of_stock_materials' => Material::where('current_stock', '<=', 0)->count(),
                'total_stock_value' => Material::selectRaw('COALESCE(SUM(COALESCE(current_stock, 0) * COALESCE(purchase_price, 0)), 0) as total')
                    ->value('total') ?? 0,
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            \Log::error('Material stats error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao calcular estatísticas de materiais.'
            ], 500);
        }
    }
}