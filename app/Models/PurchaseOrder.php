<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_number',
        'supplier_id',
        'status',
        'order_date',
        'expected_delivery_date',
        'actual_delivery_date',
        'total_amount',
        'tax_amount',
        'shipping_cost',
        'payment_terms',
        'notes',
        'delivery_address',
        'created_by',
        'approved_by',
        'approved_at',
        'line_items',
        'priority',
    ];

    protected $casts = [
        'order_date' => 'date',
        'expected_delivery_date' => 'date',
        'actual_delivery_date' => 'date',
        'approved_at' => 'datetime',
        'line_items' => 'array',
        'total_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
    ];

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SENT = 'sent';
    public const STATUS_ACKNOWLEDGED = 'acknowledged';
    public const STATUS_PARTIALLY_RECEIVED = 'partially_received';
    public const STATUS_RECEIVED = 'received';
    public const STATUS_CANCELLED = 'cancelled';

    public const PRIORITY_LOW = 'low';
    public const PRIORITY_NORMAL = 'normal';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    public static function getStatusOptions(): array
    {
        return [
            self::STATUS_DRAFT => 'Draft',
            self::STATUS_SENT => 'Sent',
            self::STATUS_ACKNOWLEDGED => 'Acknowledged',
            self::STATUS_PARTIALLY_RECEIVED => 'Partially Received',
            self::STATUS_RECEIVED => 'Received',
            self::STATUS_CANCELLED => 'Cancelled',
        ];
    }

    public static function getPriorityOptions(): array
    {
        return [
            self::PRIORITY_LOW => 'Low',
            self::PRIORITY_NORMAL => 'Normal',
            self::PRIORITY_HIGH => 'High',
            self::PRIORITY_URGENT => 'Urgent',
        ];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getSubtotalAttribute(): float
    {
        return $this->total_amount - $this->tax_amount - $this->shipping_cost;
    }

    public function getGrandTotalAttribute(): float
    {
        return $this->total_amount + $this->tax_amount + $this->shipping_cost;
    }

    public function isOverdue(): bool
    {
        return $this->expected_delivery_date &&
               $this->expected_delivery_date->isPast() &&
               !in_array($this->status, [self::STATUS_RECEIVED, self::STATUS_CANCELLED]);
    }

    public function getDaysUntilDelivery(): int
    {
        if (!$this->expected_delivery_date) {
            return 0;
        }

        return now()->diffInDays($this->expected_delivery_date, false);
    }

    public function getStatusBadgeClass(): string
    {
        return match($this->status) {
            self::STATUS_DRAFT => 'bg-gray-100 text-gray-800',
            self::STATUS_SENT => 'bg-blue-100 text-blue-800',
            self::STATUS_ACKNOWLEDGED => 'bg-yellow-100 text-yellow-800',
            self::STATUS_PARTIALLY_RECEIVED => 'bg-orange-100 text-orange-800',
            self::STATUS_RECEIVED => 'bg-green-100 text-green-800',
            self::STATUS_CANCELLED => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getPriorityBadgeClass(): string
    {
        return match($this->priority) {
            self::PRIORITY_LOW => 'bg-gray-100 text-gray-800',
            self::PRIORITY_NORMAL => 'bg-blue-100 text-blue-800',
            self::PRIORITY_HIGH => 'bg-orange-100 text-orange-800',
            self::PRIORITY_URGENT => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getLineItemsTotal(): float
    {
        if (!$this->line_items) {
            return 0;
        }

        $total = 0;
        foreach ($this->line_items as $item) {
            $quantity = $item['quantity'] ?? 0;
            $unitPrice = $item['unit_price'] ?? 0;
            $total += $quantity * $unitPrice;
        }

        return $total;
    }

    public function calculateTaxAmount(float $taxRate = 0): float
    {
        return $this->getLineItemsTotal() * ($taxRate / 100);
    }

    public function recalculateTotals(): void
    {
        $lineItemsTotal = $this->getLineItemsTotal();
        $this->total_amount = $lineItemsTotal;

        // Tax and shipping are set separately, so grand total would be:
        // $lineItemsTotal + $this->tax_amount + $this->shipping_cost
    }

    public function getReceivedQuantities(): array
    {
        // This would need to be tracked in a separate table for received items
        // For now, return empty array - to be implemented with inventory transactions
        return [];
    }

    public function getPendingQuantities(): array
    {
        $received = $this->getReceivedQuantities();
        $pending = [];

        foreach ($this->line_items as $index => $item) {
            $orderedQuantity = $item['quantity'] ?? 0;
            $receivedQuantity = $received[$index]['received_quantity'] ?? 0;

            $pending[] = [
                'material_id' => $item['material_id'] ?? null,
                'material_name' => $item['material_name'] ?? '',
                'ordered_quantity' => $orderedQuantity,
                'received_quantity' => $receivedQuantity,
                'pending_quantity' => max(0, $orderedQuantity - $receivedQuantity),
            ];
        }

        return $pending;
    }

    public function isFullyReceived(): bool
    {
        $pending = $this->getPendingQuantities();

        foreach ($pending as $item) {
            if ($item['pending_quantity'] > 0) {
                return false;
            }
        }

        return true;
    }

    public function generatePoNumber(): string
    {
        $year = now()->year;
        $month = now()->format('m');

        $lastPo = static::whereYear('created_at', $year)
                       ->whereMonth('created_at', now()->month)
                       ->orderBy('id', 'desc')
                       ->first();

        $sequence = $lastPo ? (int)substr($lastPo->po_number, -4) + 1 : 1;

        return sprintf('PO-%s%s-%04d', $year, $month, $sequence);
    }

    public function scopeOverdue($query)
    {
        return $query->where('expected_delivery_date', '<', now())
                    ->whereNotIn('status', [self::STATUS_RECEIVED, self::STATUS_CANCELLED]);
    }

    public function scopeUpcoming($query, $days = 7)
    {
        return $query->whereBetween('expected_delivery_date', [now(), now()->addDays($days)])
                    ->whereNotIn('status', [self::STATUS_RECEIVED, self::STATUS_CANCELLED]);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeBySupplier($query, $supplierId)
    {
        return $query->where('supplier_id', $supplierId);
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', [
            self::STATUS_SENT,
            self::STATUS_ACKNOWLEDGED,
            self::STATUS_PARTIALLY_RECEIVED
        ]);
    }
}