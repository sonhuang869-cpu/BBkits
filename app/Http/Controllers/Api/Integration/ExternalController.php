<?php

namespace App\Http\Controllers\Api\Integration;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Supplier;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExternalController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'throttle:external']);
    }

    /**
     * Sync materials from external ERP system
     */
    public function syncMaterials(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'materials' => 'required|array',
            'materials.*.external_id' => 'required|string',
            'materials.*.name' => 'required|string|max:255',
            'materials.*.reference' => 'required|string|max:100',
            'materials.*.description' => 'nullable|string',
            'materials.*.unit' => 'required|string|max:50',
            'materials.*.current_stock' => 'required|numeric|min:0',
            'materials.*.minimum_stock' => 'required|numeric|min:0',
            'materials.*.purchase_price' => 'required|numeric|min:0',
            'materials.*.supplier_external_id' => 'nullable|string',
        ]);

        $results = [
            'created' => 0,
            'updated' => 0,
            'errors' => []
        ];

        \DB::beginTransaction();

        try {
            foreach ($validated['materials'] as $index => $materialData) {
                try {
                    // Find supplier by external ID if provided
                    $supplierId = null;
                    if (!empty($materialData['supplier_external_id'])) {
                        $supplier = Supplier::where('external_id', $materialData['supplier_external_id'])->first();
                        $supplierId = $supplier ? $supplier->id : null;
                    }

                    // Check if material exists by external_id or reference
                    $material = Material::where('external_id', $materialData['external_id'])
                                       ->orWhere('reference', $materialData['reference'])
                                       ->first();

                    $dataToSave = [
                        'external_id' => $materialData['external_id'],
                        'name' => $materialData['name'],
                        'reference' => $materialData['reference'],
                        'description' => $materialData['description'] ?? null,
                        'unit' => $materialData['unit'],
                        'current_stock' => $materialData['current_stock'],
                        'minimum_stock' => $materialData['minimum_stock'],
                        'purchase_price' => $materialData['purchase_price'],
                        'supplier_id' => $supplierId,
                    ];

                    if ($material) {
                        // Update existing material
                        $material->update($dataToSave);
                        $results['updated']++;
                    } else {
                        // Create new material
                        Material::create($dataToSave);
                        $results['created']++;
                    }

                } catch (\Exception $e) {
                    $results['errors'][] = [
                        'index' => $index,
                        'external_id' => $materialData['external_id'] ?? null,
                        'error' => $e->getMessage()
                    ];
                }
            }

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Materials sync completed',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Materials sync failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync suppliers from external ERP system
     */
    public function syncSuppliers(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'suppliers' => 'required|array',
            'suppliers.*.external_id' => 'required|string',
            'suppliers.*.name' => 'required|string|max:255',
            'suppliers.*.email' => 'nullable|email|max:255',
            'suppliers.*.phone' => 'nullable|string|max:20',
            'suppliers.*.address' => 'nullable|string',
            'suppliers.*.contact_person' => 'nullable|string|max:255',
        ]);

        $results = [
            'created' => 0,
            'updated' => 0,
            'errors' => []
        ];

        \DB::beginTransaction();

        try {
            foreach ($validated['suppliers'] as $index => $supplierData) {
                try {
                    // Check if supplier exists by external_id
                    $supplier = Supplier::where('external_id', $supplierData['external_id'])->first();

                    $dataToSave = [
                        'external_id' => $supplierData['external_id'],
                        'name' => $supplierData['name'],
                        'email' => $supplierData['email'] ?? null,
                        'phone' => $supplierData['phone'] ?? null,
                        'address' => $supplierData['address'] ?? null,
                        'contact_person' => $supplierData['contact_person'] ?? null,
                    ];

                    if ($supplier) {
                        // Update existing supplier
                        $supplier->update($dataToSave);
                        $results['updated']++;
                    } else {
                        // Create new supplier
                        Supplier::create($dataToSave);
                        $results['created']++;
                    }

                } catch (\Exception $e) {
                    $results['errors'][] = [
                        'index' => $index,
                        'external_id' => $supplierData['external_id'] ?? null,
                        'error' => $e->getMessage()
                    ];
                }
            }

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Suppliers sync completed',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Suppliers sync failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current stock levels for external systems
     */
    public function getStockLevels(Request $request): JsonResponse
    {
        $query = Material::select('id', 'external_id', 'reference', 'name', 'current_stock', 'minimum_stock', 'unit');

        if ($request->has('external_ids')) {
            $externalIds = explode(',', $request->get('external_ids'));
            $query->whereIn('external_id', $externalIds);
        }

        if ($request->has('references')) {
            $references = explode(',', $request->get('references'));
            $query->whereIn('reference', $references);
        }

        if ($request->has('low_stock_only') && $request->boolean('low_stock_only')) {
            $query->whereRaw('current_stock <= minimum_stock');
        }

        $materials = $query->get();

        return response()->json([
            'success' => true,
            'data' => $materials,
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Process stock movements from external systems
     */
    public function processStockMovements(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'movements' => 'required|array',
            'movements.*.material_external_id' => 'required|string',
            'movements.*.quantity' => 'required|numeric',
            'movements.*.type' => 'required|in:purchase,consumption,adjustment,return',
            'movements.*.reference' => 'nullable|string|max:100',
            'movements.*.notes' => 'nullable|string|max:255',
            'movements.*.timestamp' => 'nullable|date',
        ]);

        $results = [
            'processed' => 0,
            'errors' => []
        ];

        \DB::beginTransaction();

        try {
            foreach ($validated['movements'] as $index => $movement) {
                try {
                    $material = Material::where('external_id', $movement['material_external_id'])->first();

                    if (!$material) {
                        $results['errors'][] = [
                            'index' => $index,
                            'external_id' => $movement['material_external_id'],
                            'error' => 'Material not found'
                        ];
                        continue;
                    }

                    $oldStock = $material->current_stock;
                    $newStock = $oldStock + $movement['quantity'];

                    if ($newStock < 0) {
                        $results['errors'][] = [
                            'index' => $index,
                            'external_id' => $movement['material_external_id'],
                            'error' => 'Insufficient stock for this operation'
                        ];
                        continue;
                    }

                    // Create inventory transaction
                    InventoryTransaction::create([
                        'material_id' => $material->id,
                        'type' => $movement['type'],
                        'quantity' => $movement['quantity'],
                        'reference' => $movement['reference'] ?? null,
                        'notes' => $movement['notes'] ?? 'External system sync',
                        'user_id' => auth()->id(),
                        'created_at' => $movement['timestamp'] ?? now(),
                    ]);

                    // Update material stock
                    $material->update(['current_stock' => $newStock]);

                    $results['processed']++;

                } catch (\Exception $e) {
                    $results['errors'][] = [
                        'index' => $index,
                        'external_id' => $movement['material_external_id'] ?? null,
                        'error' => $e->getMessage()
                    ];
                }
            }

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Stock movements processed',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Stock movements processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Webhook endpoint for real-time stock updates
     */
    public function stockUpdateWebhook(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'external_id' => 'required|string',
            'current_stock' => 'required|numeric|min:0',
            'timestamp' => 'required|date',
        ]);

        $material = Material::where('external_id', $validated['external_id'])->first();

        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Material not found'
            ], 404);
        }

        $oldStock = $material->current_stock;
        $newStock = $validated['current_stock'];
        $difference = $newStock - $oldStock;

        if ($difference != 0) {
            // Create inventory transaction for the difference
            InventoryTransaction::create([
                'material_id' => $material->id,
                'type' => 'adjustment',
                'quantity' => $difference,
                'notes' => 'External system webhook update',
                'reference' => 'WEBHOOK-' . time(),
                'user_id' => auth()->id(),
                'created_at' => $validated['timestamp'],
            ]);

            // Update material stock
            $material->update(['current_stock' => $newStock]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Stock updated successfully',
            'data' => [
                'material_id' => $material->id,
                'old_stock' => $oldStock,
                'new_stock' => $newStock,
                'difference' => $difference
            ]
        ]);
    }

    /**
     * Health check endpoint for external systems
     */
    public function healthCheck(): JsonResponse
    {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0',
            'database' => \DB::connection()->getPdo() ? 'connected' : 'disconnected',
        ]);
    }
}