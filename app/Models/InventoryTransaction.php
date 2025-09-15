<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_id',
        'type',
        'quantity',
        'unit_cost',
        'reference',
        'notes',
        'user_id',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'unit_cost' => 'decimal:2',
    ];

    // Relationships
    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessors
    public function getFormattedQuantityAttribute()
    {
        $sign = $this->quantity >= 0 ? '+' : '';
        return $sign . number_format($this->quantity, 3, ',', '.') . ' ' . $this->material->unit;
    }

    public function getTypeDisplayAttribute()
    {
        return match($this->type) {
            'purchase' => 'Compra',
            'consumption' => 'Consumo',
            'adjustment' => 'Ajuste',
            'return' => 'Devolução',
            default => ucfirst($this->type)
        };
    }
}