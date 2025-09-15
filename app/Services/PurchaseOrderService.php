<?php

namespace App\Services;

use App\Models\PurchaseOrder;
use App\Models\Material;
use App\Models\Supplier;
use App\Models\ProductionOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class PurchaseOrderService
{
    public function createPurchaseOrder(array $data): PurchaseOrder
    {
        try {
            DB::beginTransaction();

            $poNumber = $this->generatePoNumber();

            $purchaseOrder = PurchaseOrder::create([
                'po_number' => $poNumber,
                'supplier_id' => $data['supplier_id'],
                'status' => PurchaseOrder::STATUS_DRAFT,
                'order_date' => $data['order_date'] ?? now()->toDateString(),
                'expected_delivery_date' => $data['expected_delivery_date'] ?? null,
                'total_amount' => 0, // Will be calculated from line items
                'tax_amount' => $data['tax_amount'] ?? 0,
                'shipping_cost' => $data['shipping_cost'] ?? 0,
                'payment_terms' => $data['payment_terms'] ?? null,
                'notes' => $data['notes'] ?? null,
                'delivery_address' => $data['delivery_address'] ?? null,
                'created_by' => $data['created_by'] ?? auth()->id(),
                'line_items' => $data['line_items'] ?? [],
                'priority' => $data['priority'] ?? PurchaseOrder::PRIORITY_NORMAL,
            ]);

            // Calculate total from line items
            $this->recalculatePurchaseOrderTotals($purchaseOrder);

            DB::commit();

            Log::info('Purchase order created', [
                'purchase_order_id' => $purchaseOrder->id,
                'po_number' => $poNumber,
                'supplier_id' => $data['supplier_id'],
                'total_amount' => $purchaseOrder->total_amount,
            ]);

            return $purchaseOrder;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to create purchase order', [
                'data' => $data,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function generatePurchaseOrderFromMaterialShortages(array $shortages, Supplier $supplier): PurchaseOrder
    {
        $lineItems = [];

        foreach ($shortages as $shortage) {
            $material = Material::find($shortage['material_id']);
            if (!$material) {
                continue;
            }

            // Calculate suggested order quantity (shortage + some buffer)
            $bufferPercentage = 20; // 20% buffer
            $shortageQuantity = $shortage['shortage_quantity'];
            $bufferQuantity = $shortageQuantity * ($bufferPercentage / 100);
            $orderQuantity = $shortageQuantity + $bufferQuantity;

            // Use supplier pricing if available, otherwise material cost
            $unitPrice = $material->cost ?? 0;

            $lineItems[] = [
                'material_id' => $material->id,
                'material_name' => $material->name,
                'material_code' => $material->code,
                'quantity' => $orderQuantity,
                'unit_price' => $unitPrice,
                'total_price' => $orderQuantity * $unitPrice,
                'unit' => $material->unit,
                'shortage_quantity' => $shortageQuantity,
                'buffer_quantity' => $bufferQuantity,
            ];
        }

        return $this->createPurchaseOrder([
            'supplier_id' => $supplier->id,
            'line_items' => $lineItems,
            'notes' => 'Purchase order generated from material shortages',
            'priority' => PurchaseOrder::PRIORITY_HIGH,
        ]);
    }

    public function generatePurchaseOrderFromProductionOrder(ProductionOrder $productionOrder): ?PurchaseOrder
    {
        $materialAvailability = app(ProductionIntegrationService::class)
                               ->checkMaterialRequirements($productionOrder);

        if (!$materialAvailability['has_shortages']) {
            return null; // No shortages, no need for purchase order
        }

        $shortages = $materialAvailability['shortages'];

        // Group shortages by supplier
        $supplierShortages = [];
        foreach ($shortages as $shortage) {
            $material = Material::find($shortage['material_id']);
            if (!$material || !$material->supplier_id) {
                continue;
            }

            $supplierId = $material->supplier_id;
            if (!isset($supplierShortages[$supplierId])) {
                $supplierShortages[$supplierId] = [];
            }

            $supplierShortages[$supplierId][] = $shortage;
        }

        // Create purchase orders for each supplier
        $purchaseOrders = [];
        foreach ($supplierShortages as $supplierId => $shortages) {
            $supplier = Supplier::find($supplierId);
            if (!$supplier) {
                continue;
            }

            $purchaseOrder = $this->generatePurchaseOrderFromMaterialShortages($shortages, $supplier);
            $purchaseOrder->update([
                'notes' => "Purchase order generated for Production Order #{$productionOrder->order_number}",
            ]);

            $purchaseOrders[] = $purchaseOrder;
        }

        return count($purchaseOrders) === 1 ? $purchaseOrders[0] : null;
    }

    public function approvePurchaseOrder(PurchaseOrder $purchaseOrder, int $approvedBy): bool
    {
        try {
            $purchaseOrder->update([
                'approved_by' => $approvedBy,
                'approved_at' => now(),
                'status' => PurchaseOrder::STATUS_SENT,
            ]);

            Log::info('Purchase order approved', [
                'purchase_order_id' => $purchaseOrder->id,
                'po_number' => $purchaseOrder->po_number,
                'approved_by' => $approvedBy,
            ]);

            return true;

        } catch (Exception $e) {
            Log::error('Failed to approve purchase order', [
                'purchase_order_id' => $purchaseOrder->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function receivePurchaseOrder(PurchaseOrder $purchaseOrder, array $receivedItems): bool
    {
        try {
            DB::beginTransaction();

            $allItemsReceived = true;

            foreach ($receivedItems as $receivedItem) {
                $materialId = $receivedItem['material_id'];
                $receivedQuantity = $receivedItem['received_quantity'];

                if ($receivedQuantity <= 0) {
                    continue;
                }

                // Update material stock
                $material = Material::find($materialId);
                if ($material) {
                    $material->current_stock += $receivedQuantity;
                    $material->save();

                    Log::info('Material stock updated from purchase order', [
                        'purchase_order_id' => $purchaseOrder->id,
                        'material_id' => $materialId,
                        'material_name' => $material->name,
                        'received_quantity' => $receivedQuantity,
                        'new_stock' => $material->current_stock,
                    ]);
                }

                // Check if this material is fully received
                $lineItem = collect($purchaseOrder->line_items)->firstWhere('material_id', $materialId);
                if ($lineItem) {
                    $orderedQuantity = $lineItem['quantity'];
                    if ($receivedQuantity < $orderedQuantity) {
                        $allItemsReceived = false;
                    }
                }
            }

            // Update purchase order status
            $newStatus = $allItemsReceived ?
                        PurchaseOrder::STATUS_RECEIVED :
                        PurchaseOrder::STATUS_PARTIALLY_RECEIVED;

            $purchaseOrder->update([
                'status' => $newStatus,
                'actual_delivery_date' => now()->toDateString(),
            ]);

            DB::commit();

            Log::info('Purchase order items received', [
                'purchase_order_id' => $purchaseOrder->id,
                'status' => $newStatus,
                'all_items_received' => $allItemsReceived,
            ]);

            return true;

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to receive purchase order items', [
                'purchase_order_id' => $purchaseOrder->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function recalculatePurchaseOrderTotals(PurchaseOrder $purchaseOrder): void
    {
        $lineItemsTotal = 0;

        foreach ($purchaseOrder->line_items as $item) {
            $quantity = $item['quantity'] ?? 0;
            $unitPrice = $item['unit_price'] ?? 0;
            $lineItemsTotal += $quantity * $unitPrice;
        }

        $purchaseOrder->update([
            'total_amount' => $lineItemsTotal
        ]);
    }

    public function updateLineItem(PurchaseOrder $purchaseOrder, int $lineIndex, array $updatedItem): bool
    {
        $lineItems = $purchaseOrder->line_items;

        if (!isset($lineItems[$lineIndex])) {
            throw new Exception('Line item not found');
        }

        $lineItems[$lineIndex] = array_merge($lineItems[$lineIndex], $updatedItem);

        $purchaseOrder->update(['line_items' => $lineItems]);
        $this->recalculatePurchaseOrderTotals($purchaseOrder);

        return true;
    }

    public function addLineItem(PurchaseOrder $purchaseOrder, array $newItem): bool
    {
        $lineItems = $purchaseOrder->line_items;
        $lineItems[] = $newItem;

        $purchaseOrder->update(['line_items' => $lineItems]);
        $this->recalculatePurchaseOrderTotals($purchaseOrder);

        return true;
    }

    public function removeLineItem(PurchaseOrder $purchaseOrder, int $lineIndex): bool
    {
        $lineItems = $purchaseOrder->line_items;

        if (!isset($lineItems[$lineIndex])) {
            throw new Exception('Line item not found');
        }

        unset($lineItems[$lineIndex]);
        $lineItems = array_values($lineItems); // Re-index array

        $purchaseOrder->update(['line_items' => $lineItems]);
        $this->recalculatePurchaseOrderTotals($purchaseOrder);

        return true;
    }

    public function generatePoNumber(): string
    {
        $year = now()->year;
        $month = now()->format('m');

        $lastPo = PurchaseOrder::whereYear('created_at', $year)
                              ->whereMonth('created_at', now()->month)
                              ->orderBy('id', 'desc')
                              ->first();

        $sequence = $lastPo ? (int)substr($lastPo->po_number, -4) + 1 : 1;

        return sprintf('PO-%s%s-%04d', $year, $month, $sequence);
    }

    public function getPurchaseOrderSummary(): array
    {
        $draft = PurchaseOrder::where('status', PurchaseOrder::STATUS_DRAFT)->count();
        $sent = PurchaseOrder::where('status', PurchaseOrder::STATUS_SENT)->count();
        $acknowledged = PurchaseOrder::where('status', PurchaseOrder::STATUS_ACKNOWLEDGED)->count();
        $partiallyReceived = PurchaseOrder::where('status', PurchaseOrder::STATUS_PARTIALLY_RECEIVED)->count();
        $received = PurchaseOrder::where('status', PurchaseOrder::STATUS_RECEIVED)->count();
        $cancelled = PurchaseOrder::where('status', PurchaseOrder::STATUS_CANCELLED)->count();
        $overdue = PurchaseOrder::overdue()->count();

        return [
            'draft' => $draft,
            'sent' => $sent,
            'acknowledged' => $acknowledged,
            'partially_received' => $partiallyReceived,
            'received' => $received,
            'cancelled' => $cancelled,
            'overdue' => $overdue,
            'total_active' => $sent + $acknowledged + $partiallyReceived,
        ];
    }
}