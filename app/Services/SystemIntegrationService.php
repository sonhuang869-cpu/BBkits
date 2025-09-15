<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\ProductionOrder;
use App\Models\PurchaseOrder;
use App\Models\Material;
use App\Events\SaleStatusChanged;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Exception;

class SystemIntegrationService
{
    protected ProductionIntegrationService $productionService;
    protected PurchaseOrderService $purchaseOrderService;
    protected MaterialNotificationService $notificationService;

    public function __construct(
        ProductionIntegrationService $productionService,
        PurchaseOrderService $purchaseOrderService,
        MaterialNotificationService $notificationService
    ) {
        $this->productionService = $productionService;
        $this->purchaseOrderService = $purchaseOrderService;
        $this->notificationService = $notificationService;
    }

    /**
     * Handle sale approval and trigger production workflow
     */
    public function handleSaleApproval(Sale $sale): array
    {
        try {
            $results = [
                'sale_updated' => true,
                'production_order_created' => false,
                'purchase_orders_created' => [],
                'material_shortages' => [],
                'notifications_sent' => false,
            ];

            // Check if this sale requires production
            if (!$this->saleRequiresProduction($sale)) {
                Log::info('Sale does not require production', ['sale_id' => $sale->id]);
                return $results;
            }

            // Extract production requirements from sale
            $productionData = $this->extractProductionDataFromSale($sale);

            // Create production order
            $productionOrder = $this->productionService->createProductionOrderFromSale($sale, $productionData);
            $results['production_order_created'] = true;

            // Check material availability for production
            $materialAvailability = $this->productionService->checkMaterialRequirements($productionOrder);
            $results['material_shortages'] = $materialAvailability['shortages'];

            // If there are material shortages, create purchase orders
            if ($materialAvailability['has_shortages']) {
                $purchaseOrder = $this->purchaseOrderService->generatePurchaseOrderFromProductionOrder($productionOrder);
                if ($purchaseOrder) {
                    $results['purchase_orders_created'][] = $purchaseOrder->id;
                }

                // Send low stock notifications
                $this->notificationService->notifyPurchaseRequired();
                $results['notifications_sent'] = true;
            }

            // Fire event for other systems to listen
            Event::dispatch(new SaleStatusChanged($sale, 'approved'));

            Log::info('Sale approval workflow completed', [
                'sale_id' => $sale->id,
                'production_order_id' => $productionOrder->id,
                'has_shortages' => $materialAvailability['has_shortages'],
                'purchase_orders_created' => count($results['purchase_orders_created']),
            ]);

            return $results;

        } catch (Exception $e) {
            Log::error('Failed to handle sale approval workflow', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Handle production order completion and update sale status
     */
    public function handleProductionCompletion(ProductionOrder $productionOrder): bool
    {
        try {
            // Update related sale status
            if ($productionOrder->sale) {
                $productionOrder->sale->update([
                    'production_status' => 'completed',
                    'status' => 'ready_for_delivery'
                ]);

                Log::info('Sale status updated after production completion', [
                    'sale_id' => $productionOrder->sale->id,
                    'production_order_id' => $productionOrder->id,
                ]);
            }

            return true;

        } catch (Exception $e) {
            Log::error('Failed to handle production completion', [
                'production_order_id' => $productionOrder->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Handle purchase order receipt and check if production can proceed
     */
    public function handlePurchaseOrderReceipt(PurchaseOrder $purchaseOrder): array
    {
        try {
            $results = [
                'materials_updated' => true,
                'production_orders_ready' => [],
                'notifications_sent' => false,
            ];

            // Find production orders that might be affected by this material receipt
            $affectedProductionOrders = $this->findAffectedProductionOrders($purchaseOrder);

            foreach ($affectedProductionOrders as $productionOrder) {
                $materialAvailability = $this->productionService->checkMaterialRequirements($productionOrder);

                if ($materialAvailability['production_ready']) {
                    $results['production_orders_ready'][] = $productionOrder->id;

                    // Optionally auto-start production if configured
                    if ($this->shouldAutoStartProduction($productionOrder)) {
                        $this->productionService->reserveMaterials($productionOrder);
                    }
                }
            }

            // Send notifications about production readiness
            if (!empty($results['production_orders_ready'])) {
                $this->notifyProductionReadiness($results['production_orders_ready']);
                $results['notifications_sent'] = true;
            }

            Log::info('Purchase order receipt processed', [
                'purchase_order_id' => $purchaseOrder->id,
                'production_orders_ready' => count($results['production_orders_ready']),
            ]);

            return $results;

        } catch (Exception $e) {
            Log::error('Failed to handle purchase order receipt', [
                'purchase_order_id' => $purchaseOrder->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get system integration dashboard data
     */
    public function getDashboardData(): array
    {
        $productionSummary = $this->productionService->getProductionSummary();
        $purchaseSummary = $this->purchaseOrderService->getPurchaseOrderSummary();

        // Get recent integrations activity
        $recentActivity = $this->getRecentIntegrationActivity();

        return [
            'production' => $productionSummary,
            'purchase_orders' => $purchaseSummary,
            'recent_activity' => $recentActivity,
            'system_health' => $this->getSystemHealthStatus(),
        ];
    }

    /**
     * Check if a sale requires production
     */
    protected function saleRequiresProduction(Sale $sale): bool
    {
        // This logic would depend on your business rules
        // For example, check if sale has custom products, special requirements, etc.

        // Simple implementation: check if sale has production-related fields
        return !empty($sale->product_description) ||
               isset($sale->custom_requirements) ||
               $sale->production_required === true;
    }

    /**
     * Extract production data from sale
     */
    protected function extractProductionDataFromSale(Sale $sale): array
    {
        return [
            'product_name' => $sale->product_name ?? 'Custom Product',
            'product_description' => $sale->description ?? $sale->product_description,
            'quantity' => $sale->quantity ?? 1,
            'priority' => $sale->priority ?? ProductionOrder::PRIORITY_NORMAL,
            'required_date' => $sale->delivery_date ?? null,
            'material_requirements' => $this->calculateMaterialRequirements($sale),
            'estimated_cost' => $sale->production_cost ?? 0,
            'created_by' => auth()->id(),
            'notes' => "Production order auto-created from sale #{$sale->id}",
        ];
    }

    /**
     * Calculate material requirements for a sale
     */
    protected function calculateMaterialRequirements(Sale $sale): array
    {
        // This would contain your business logic for determining material requirements
        // based on the sale details. For now, return empty array.

        // Example implementation would look at:
        // - Product specifications
        // - Custom requirements
        // - Standard recipes/BOMs

        return [];
    }

    /**
     * Find production orders affected by purchase order materials
     */
    protected function findAffectedProductionOrders(PurchaseOrder $purchaseOrder): \Illuminate\Database\Eloquent\Collection
    {
        $materialIds = collect($purchaseOrder->line_items)->pluck('material_id')->filter();

        return ProductionOrder::where('status', ProductionOrder::STATUS_PENDING)
                             ->get()
                             ->filter(function ($productionOrder) use ($materialIds) {
                                 $requiredMaterialIds = collect($productionOrder->material_requirements)
                                                       ->pluck('material_id')
                                                       ->filter();

                                 return $materialIds->intersect($requiredMaterialIds)->isNotEmpty();
                             });
    }

    /**
     * Check if production should auto-start when materials are available
     */
    protected function shouldAutoStartProduction(ProductionOrder $productionOrder): bool
    {
        // Business logic to determine auto-start
        // Could be based on priority, customer requirements, etc.
        return $productionOrder->priority === ProductionOrder::PRIORITY_URGENT;
    }

    /**
     * Notify about production readiness
     */
    protected function notifyProductionReadiness(array $productionOrderIds): void
    {
        // Implementation would send notifications to production team
        Log::info('Production orders ready for manufacturing', [
            'production_order_ids' => $productionOrderIds,
        ]);
    }

    /**
     * Get recent integration activity
     */
    protected function getRecentIntegrationActivity(): array
    {
        // This would query recent activities across the integrated systems
        return [
            'sales_to_production' => ProductionOrder::whereDate('created_at', today())->count(),
            'purchase_orders_generated' => PurchaseOrder::whereDate('created_at', today())->count(),
            'materials_received' => PurchaseOrder::where('status', PurchaseOrder::STATUS_RECEIVED)
                                                ->whereDate('actual_delivery_date', today())
                                                ->count(),
        ];
    }

    /**
     * Get system health status
     */
    protected function getSystemHealthStatus(): array
    {
        return [
            'status' => 'healthy',
            'last_integration' => now()->toDateTimeString(),
            'pending_actions' => $this->getPendingActions(),
        ];
    }

    /**
     * Get pending integration actions
     */
    protected function getPendingActions(): array
    {
        return [
            'pending_production_orders' => ProductionOrder::where('status', ProductionOrder::STATUS_PENDING)->count(),
            'overdue_purchase_orders' => PurchaseOrder::overdue()->count(),
            'materials_low_stock' => Material::whereColumn('current_stock', '<=', 'minimum_stock')->count(),
        ];
    }
}