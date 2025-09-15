<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'priority',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    const PRIORITIES = [
        'low' => 'Baixa',
        'normal' => 'Normal',
        'high' => 'Alta',
        'critical' => 'Crítica',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function markAsUnread(): void
    {
        $this->update(['read_at' => null]);
    }

    public function isRead(): bool
    {
        return !is_null($this->read_at);
    }

    public function isUnread(): bool
    {
        return is_null($this->read_at);
    }

    public function getPriorityColorAttribute(): string
    {
        return match($this->priority) {
            'low' => 'text-gray-600 bg-gray-100',
            'normal' => 'text-blue-600 bg-blue-100',
            'high' => 'text-orange-600 bg-orange-100',
            'critical' => 'text-red-600 bg-red-100',
            default => 'text-gray-600 bg-gray-100',
        };
    }

    public function getPriorityIconAttribute(): string
    {
        return match($this->priority) {
            'low' => '📝',
            'normal' => 'ℹ️',
            'high' => '⚠️',
            'critical' => '🚨',
            default => 'ℹ️',
        };
    }

    public function getTypeIconAttribute(): string
    {
        return match($this->type) {
            'low_stock' => '📉',
            'out_of_stock' => '🚫',
            'stock_change' => '📊',
            'purchase_required' => '🛒',
            'material_created' => '➕',
            'material_updated' => '✏️',
            'category_changes' => '📁',
            default => 'ℹ️',
        };
    }

    public static function createNotification(
        User $user,
        string $type,
        string $title,
        string $message,
        array $data = [],
        string $priority = 'normal'
    ): self {
        return self::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'priority' => $priority,
        ]);
    }

    public static function createForAllAdmins(
        string $type,
        string $title,
        string $message,
        array $data = [],
        string $priority = 'normal'
    ): void {
        $admins = User::whereIn('role', ['admin', 'manager'])->get();

        foreach ($admins as $admin) {
            self::createNotification($admin, $type, $title, $message, $data, $priority);
        }
    }
}