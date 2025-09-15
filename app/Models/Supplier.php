<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'notes',
        'payment_terms',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationships
    public function materials()
    {
        return $this->hasMany(Material::class, 'supplier_id');
    }

    public function secondaryMaterials()
    {
        return $this->hasMany(Material::class, 'secondary_supplier_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Accessors
    public function getFormattedContactAttribute()
    {
        $contact = $this->contact_name;
        if ($this->email) {
            $contact .= ' (' . $this->email . ')';
        }
        return $contact;
    }
}