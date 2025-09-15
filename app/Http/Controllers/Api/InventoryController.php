<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryTransaction;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InventoryController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'inventory.access:view'])->only(['index', 'show', 'stats']);
        $this->middleware(['auth:sanctum', 'inventory.access:create'])->only(['store']);
        $this->middleware(['auth:sanctum', 'inventory.access:bulk'])->only(['bulkAdjustment']);
    }

    public function index(Request $request): JsonResponse
    {
        $query = InventoryTransaction::with(['material', 'user']);

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('notes', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhereHas('material', function ($materialQuery) use ($search) {
                      $materialQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('reference', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }

        if ($request->has('material_id')) {
            $query->where('material_id', $request->get('material_id'));
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->get('date_from'));
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->get('date_to'));
        }

        $perPage = min($request->get('per_page', 15), 100);
        $transactions = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
                'from' => $transactions->firstItem(),
                'to' => $transactions->lastItem(),
            ],
            'links' => [
                'first' => $transactions->url(1),
                'last' => $transactions->url($transactions->lastPage()),
                'prev' => $transactions->previousPageUrl(),
                'next' => $transactions->nextPageUrl(),
            ]
        ]);
    }

    public function show(InventoryTransaction $transaction): JsonResponse
    {
        $transaction->load(['material', 'user']);

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|numeric',
            'type' => 'required|in:purchase,consumption,adjustment,return',
            'notes' => 'nullable|string|max:255',
            'reference' => 'nullable|string|max:100',
        ]);

        $material = Material::findOrFail($validated['material_id']);
        $oldStock = $material->current_stock;
        $newStock = $oldStock + $validated['quantity'];

        if ($newStock < 0) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock for this operation'
            ], 422);
        }

        // Create inventory transaction
        $transaction = InventoryTransaction::create([
            'material_id' => $validated['material_id'],
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'notes' => $validated['notes'] ?? null,
            'reference' => $validated['reference'] ?? null,
            'user_id' => auth()->id(),
        ]);

        // Update material stock
        $material->update(['current_stock' => $newStock]);

        $transaction->load(['material', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Inventory transaction created successfully',
            'data' => [
                'transaction' => $transaction,
                'old_stock' => $oldStock,
                'new_stock' => $newStock
            ]
        ], 201);
    }

    public function bulkAdjustment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'adjustments' => 'required|array|min:1',
            'adjustments.*.material_id' => 'required|exists:materials,id',
            'adjustments.*.quantity' => 'required|numeric',
            'adjustments.*.notes' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'reference' => 'nullable|string|max:100',
        ]);

        $results = [];
        $errors = [];

        \DB::beginTransaction();

        try {
            foreach ($validated['adjustments'] as $index => $adjustment) {
                $material = Material::findOrFail($adjustment['material_id']);
                $oldStock = $material->current_stock;
                $newStock = $oldStock + $adjustment['quantity'];

                if ($newStock < 0) {
                    $errors[] = [
                        'index' => $index,
                        'material_id' => $adjustment['material_id'],
                        'material_name' => $material->name,
                        'error' => 'Insufficient stock for this operation'
                    ];
                    continue;
                }

                // Create inventory transaction
                $transaction = InventoryTransaction::create([
                    'material_id' => $adjustment['material_id'],
                    'type' => 'adjustment',
                    'quantity' => $adjustment['quantity'],
                    'notes' => $adjustment['notes'] ?? $validated['notes'] ?? null,
                    'reference' => $validated['reference'] ?? null,
                    'user_id' => auth()->id(),
                ]);

                // Update material stock
                $material->update(['current_stock' => $newStock]);

                $results[] = [
                    'material_id' => $adjustment['material_id'],
                    'material_name' => $material->name,
                    'old_stock' => $oldStock,
                    'new_stock' => $newStock,
                    'adjustment' => $adjustment['quantity'],
                    'transaction_id' => $transaction->id
                ];
            }

            if (!empty($errors)) {
                \DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Some adjustments failed due to insufficient stock',
                    'errors' => $errors
                ], 422);
            }

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Bulk adjustment completed successfully',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Bulk adjustment failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function stats(): JsonResponse
    {
        $stats = [
            'total_transactions' => InventoryTransaction::count(),
            'purchases' => InventoryTransaction::where('type', 'purchase')->count(),
            'consumption' => InventoryTransaction::where('type', 'consumption')->count(),
            'adjustments' => InventoryTransaction::where('type', 'adjustment')->count(),
            'returns' => InventoryTransaction::where('type', 'return')->count(),
            'recent_transactions' => InventoryTransaction::with(['material', 'user'])
                                                       ->latest()
                                                       ->limit(10)
                                                       ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}