<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaterialCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'color',
        'icon',
        'parent_id',
        'active',
        'sort_order',
    ];

    protected $casts = [
        'active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MaterialCategory::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MaterialCategory::class, 'parent_id')->orderBy('sort_order');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class, 'category_id');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeRootCategories($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function getFullNameAttribute(): string
    {
        if ($this->parent) {
            return $this->parent->name . ' > ' . $this->name;
        }
        return $this->name;
    }

    public function getMaterialsCountAttribute(): int
    {
        return $this->materials()->count();
    }

    public function getTotalMaterialsCountAttribute(): int
    {
        $count = $this->materials()->count();

        foreach ($this->children as $child) {
            $count += $child->total_materials_count;
        }

        return $count;
    }
}