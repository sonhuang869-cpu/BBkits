<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'sale_id',
        'product_name',
        'product_description',
        'quantity',
        'status',
        'priority',
        'required_date',
        'start_date',
        'completion_date',
        'assigned_to',
        'created_by',
        'notes',
        'material_requirements',
        'estimated_cost',
        'actual_cost',
    ];

    protected $casts = [
        'required_date' => 'date',
        'start_date' => 'date',
        'completion_date' => 'date',
        'material_requirements' => 'array',
        'estimated_cost' => 'decimal:2',
        'actual_cost' => 'decimal:2',
    ];

    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const PRIORITY_LOW = 'low';
    public const PRIORITY_NORMAL = 'normal';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    public static function getStatusOptions(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_IN_PROGRESS => 'In Progress',
            self::STATUS_COMPLETED => 'Completed',
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

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isOverdue(): bool
    {
        return $this->required_date &&
               $this->required_date->isPast() &&
               !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function getDaysUntilDue(): int
    {
        if (!$this->required_date) {
            return 0;
        }

        return now()->diffInDays($this->required_date, false);
    }

    public function getStatusBadgeClass(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'bg-yellow-100 text-yellow-800',
            self::STATUS_IN_PROGRESS => 'bg-blue-100 text-blue-800',
            self::STATUS_COMPLETED => 'bg-green-100 text-green-800',
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

    public function getTotalMaterialCost(): float
    {
        if (!$this->material_requirements) {
            return 0;
        }

        $total = 0;
        foreach ($this->material_requirements as $requirement) {
            $materialId = $requirement['material_id'] ?? null;
            $quantity = $requirement['quantity'] ?? 0;
            $unitCost = $requirement['unit_cost'] ?? 0;

            $total += $quantity * $unitCost;
        }

        return $total;
    }

    public function checkMaterialAvailability(): array
    {
        if (!$this->material_requirements) {
            return [];
        }

        $availability = [];
        foreach ($this->material_requirements as $requirement) {
            $materialId = $requirement['material_id'] ?? null;
            $requiredQuantity = $requirement['quantity'] ?? 0;

            if ($materialId) {
                $material = Material::find($materialId);
                if ($material) {
                    $availability[] = [
                        'material_id' => $materialId,
                        'material_name' => $material->name,
                        'required_quantity' => $requiredQuantity,
                        'available_quantity' => $material->current_stock,
                        'sufficient' => $material->current_stock >= $requiredQuantity,
                        'shortage' => max(0, $requiredQuantity - $material->current_stock),
                    ];
                }
            }
        }

        return $availability;
    }

    public function hasInsufficientMaterials(): bool
    {
        $availability = $this->checkMaterialAvailability();

        foreach ($availability as $item) {
            if (!$item['sufficient']) {
                return true;
            }
        }

        return false;
    }

    public function scopeOverdue($query)
    {
        return $query->where('required_date', '<', now())
                    ->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function scopeUpcoming($query, $days = 7)
    {
        return $query->whereBetween('required_date', [now(), now()->addDays($days)])
                    ->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }
}