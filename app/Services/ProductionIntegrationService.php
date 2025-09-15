<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\ProductionOrder;
use App\Models\Material;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class ProductionIntegrationService
{
    public function createProductionOrderFromSale(Sale $sale, array $productionData): ProductionOrder
    {
        try {
            DB::beginTransaction();

            $orderNumber = $this->generateProductionOrderNumber();

            $productionOrder = ProductionOrder::create([
                'order_number' => $orderNumber,
                'sale_id' => $sale->id,
                'product_name' => $productionData['product_name'] ?? $sale->product_name,
                'product_description' => $productionData['product_description'] ?? $sale->description,
                'quantity' => $productionData['quantity'] ?? 1,
                'status' => ProductionOrder::STATUS_PENDING,
                'priority' => $productionData['priority'] ?? ProductionOrder::PRIORITY_NORMAL,
                'required_date' => $productionData['required_date'] ?? null,
                'material_requirements' => $productionData['material_requirements'] ?? [],
                'estimated_cost' => $productionData['estimated_cost'] ?? 0,
                'created_by' => $productionData['created_by'] ?? auth()->id(),
                'notes' => $productionData['notes'] ?? "Production order created from sale #{$sale->id}",
            ]);

            // Update sale status to indicate production order created
            $sale->update([
                'production_status' => 'production_ordered'
            ]);

            DB::commit();

            Log::info('Production order created from sale', [
                'production_order_id' => $productionOrder->id,
                'sale_id' => $sale->id,
                'order_number' => $orderNumber,
            ]);

            return $productionOrder;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to create production order from sale', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function checkMaterialRequirements(ProductionOrder $productionOrder): array
    {
        $requirements = $productionOrder->material_requirements ?? [];
        $availability = [];
        $shortages = [];

        foreach ($requirements as $requirement) {
            $materialId = $requirement['material_id'] ?? null;
            $requiredQuantity = $requirement['quantity'] ?? 0;

            if (!$materialId) {
                continue;
            }

            $material = Material::find($materialId);
            if (!$material) {
                continue;
            }

            $available = $material->current_stock;
            $sufficient = $available >= $requiredQuantity;
            $shortage = max(0, $requiredQuantity - $available);

            $materialData = [
                'material_id' => $materialId,
                'material_name' => $material->name,
                'material_code' => $material->code,
                'required_quantity' => $requiredQuantity,
                'available_quantity' => $available,
                'sufficient' => $sufficient,
                'shortage_quantity' => $shortage,
                'unit' => $material->unit,
            ];

            $availability[] = $materialData;

            if (!$sufficient) {
                $shortages[] = $materialData;
            }
        }

        return [
            'all_materials' => $availability,
            'shortages' => $shortages,
            'has_shortages' => !empty($shortages),
            'production_ready' => empty($shortages),
        ];
    }

    public function reserveMaterials(ProductionOrder $productionOrder): bool
    {
        try {
            DB::beginTransaction();

            $requirements = $productionOrder->material_requirements ?? [];

            foreach ($requirements as $requirement) {
                $materialId = $requirement['material_id'] ?? null;
                $requiredQuantity = $requirement['quantity'] ?? 0;

                if (!$materialId || $requiredQuantity <= 0) {
                    continue;
                }

                $material = Material::find($materialId);
                if (!$material) {
                    throw new Exception("Material with ID {$materialId} not found");
                }

                if ($material->current_stock < $requiredQuantity) {
                    throw new Exception("Insufficient stock for material {$material->name}. Required: {$requiredQuantity}, Available: {$material->current_stock}");
                }

                // Reserve the materials by reducing current stock
                $material->current_stock -= $requiredQuantity;
                $material->save();

                // Log the reservation
                Log::info('Material reserved for production', [
                    'production_order_id' => $productionOrder->id,
                    'material_id' => $materialId,
                    'material_name' => $material->name,
                    'quantity_reserved' => $requiredQuantity,
                    'remaining_stock' => $material->current_stock,
                ]);
            }

            // Update production order status
            $productionOrder->update([
                'status' => ProductionOrder::STATUS_IN_PROGRESS,
                'start_date' => now(),
            ]);

            DB::commit();
            return true;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to reserve materials for production', [
                'production_order_id' => $productionOrder->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function completeProductionOrder(ProductionOrder $productionOrder, array $completionData = []): bool
    {
        try {
            DB::beginTransaction();

            $productionOrder->update([
                'status' => ProductionOrder::STATUS_COMPLETED,
                'completion_date' => now(),
                'actual_cost' => $completionData['actual_cost'] ?? $productionOrder->actual_cost,
                'notes' => $completionData['notes'] ?? $productionOrder->notes,
            ]);

            // Update related sale status
            if ($productionOrder->sale) {
                $productionOrder->sale->update([
                    'production_status' => 'completed'
                ]);
            }

            DB::commit();

            Log::info('Production order completed', [
                'production_order_id' => $productionOrder->id,
                'order_number' => $productionOrder->order_number,
                'completion_date' => $productionOrder->completion_date,
            ]);

            return true;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to complete production order', [
                'production_order_id' => $productionOrder->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function generateMaterialRequirements(array $productSpecifications): array
    {
        // This method would contain business logic to calculate material requirements
        // based on product specifications. For now, return basic structure.

        $requirements = [];

        foreach ($productSpecifications as $spec) {
            $materialId = $spec['material_id'] ?? null;
            $baseQuantity = $spec['base_quantity'] ?? 1;
            $productQuantity = $spec['product_quantity'] ?? 1;
            $wastePercentage = $spec['waste_percentage'] ?? 0;

            if ($materialId) {
                $totalQuantity = $baseQuantity * $productQuantity;
                $wasteQuantity = $totalQuantity * ($wastePercentage / 100);
                $finalQuantity = $totalQuantity + $wasteQuantity;

                $requirements[] = [
                    'material_id' => $materialId,
                    'quantity' => $finalQuantity,
                    'base_quantity' => $baseQuantity,
                    'waste_percentage' => $wastePercentage,
                    'waste_quantity' => $wasteQuantity,
                    'unit_cost' => $spec['unit_cost'] ?? 0,
                ];
            }
        }

        return $requirements;
    }

    public function getProductionOrdersByStatus(string $status): \Illuminate\Database\Eloquent\Collection
    {
        return ProductionOrder::with(['sale', 'assignedUser', 'createdBy'])
                             ->where('status', $status)
                             ->orderBy('priority', 'desc')
                             ->orderBy('required_date', 'asc')
                             ->get();
    }

    public function getOverdueProductionOrders(): \Illuminate\Database\Eloquent\Collection
    {
        return ProductionOrder::with(['sale', 'assignedUser', 'createdBy'])
                             ->overdue()
                             ->orderBy('required_date', 'asc')
                             ->get();
    }

    public function getUpcomingProductionOrders(int $days = 7): \Illuminate\Database\Eloquent\Collection
    {
        return ProductionOrder::with(['sale', 'assignedUser', 'createdBy'])
                             ->upcoming($days)
                             ->orderBy('required_date', 'asc')
                             ->get();
    }

    public function assignProductionOrder(ProductionOrder $productionOrder, User $user): bool
    {
        if (!$user->canManageProduction()) {
            throw new Exception('User does not have permission to manage production');
        }

        $productionOrder->update([
            'assigned_to' => $user->id
        ]);

        Log::info('Production order assigned', [
            'production_order_id' => $productionOrder->id,
            'assigned_to' => $user->id,
            'assigned_by' => auth()->id(),
        ]);

        return true;
    }

    public function generateProductionOrderNumber(): string
    {
        $year = now()->year;
        $month = now()->format('m');

        $lastOrder = ProductionOrder::whereYear('created_at', $year)
                                   ->whereMonth('created_at', now()->month)
                                   ->orderBy('id', 'desc')
                                   ->first();

        $sequence = $lastOrder ? (int)substr($lastOrder->order_number, -4) + 1 : 1;

        return sprintf('PROD-%s%s-%04d', $year, $month, $sequence);
    }

    public function getProductionSummary(): array
    {
        $pending = ProductionOrder::where('status', ProductionOrder::STATUS_PENDING)->count();
        $inProgress = ProductionOrder::where('status', ProductionOrder::STATUS_IN_PROGRESS)->count();
        $completed = ProductionOrder::where('status', ProductionOrder::STATUS_COMPLETED)->count();
        $overdue = ProductionOrder::overdue()->count();
        $upcoming = ProductionOrder::upcoming(7)->count();

        return [
            'pending' => $pending,
            'in_progress' => $inProgress,
            'completed' => $completed,
            'overdue' => $overdue,
            'upcoming_7_days' => $upcoming,
            'total_active' => $pending + $inProgress,
        ];
    }
}