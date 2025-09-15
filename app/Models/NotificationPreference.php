<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'email_enabled',
        'system_enabled',
        'settings',
    ];

    protected $casts = [
        'email_enabled' => 'boolean',
        'system_enabled' => 'boolean',
        'settings' => 'array',
    ];

    const TYPES = [
        'low_stock' => 'Estoque Baixo',
        'out_of_stock' => 'Sem Estoque',
        'stock_change' => 'Mudanças de Estoque',
        'purchase_required' => 'Compra Necessária',
        'material_created' => 'Material Criado',
        'material_updated' => 'Material Atualizado',
        'category_changes' => 'Mudanças de Categoria',
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

    public static function getDefaultPreferences(): array
    {
        return [
            'low_stock' => [
                'email_enabled' => true,
                'system_enabled' => true,
                'settings' => [
                    'threshold_percentage' => 20, // Alert when stock is 20% below minimum
                    'frequency' => 'daily', // daily, weekly, immediate
                ]
            ],
            'out_of_stock' => [
                'email_enabled' => true,
                'system_enabled' => true,
                'settings' => [
                    'frequency' => 'immediate',
                ]
            ],
            'stock_change' => [
                'email_enabled' => false,
                'system_enabled' => true,
                'settings' => [
                    'minimum_change_percentage' => 10, // Only notify for changes > 10%
                    'frequency' => 'immediate',
                ]
            ],
            'purchase_required' => [
                'email_enabled' => true,
                'system_enabled' => true,
                'settings' => [
                    'days_ahead' => 7, // Notify 7 days before stock runs out
                    'frequency' => 'daily',
                ]
            ],
            'material_created' => [
                'email_enabled' => false,
                'system_enabled' => true,
                'settings' => [
                    'frequency' => 'immediate',
                ]
            ],
            'material_updated' => [
                'email_enabled' => false,
                'system_enabled' => false,
                'settings' => [
                    'frequency' => 'immediate',
                ]
            ],
            'category_changes' => [
                'email_enabled' => false,
                'system_enabled' => true,
                'settings' => [
                    'frequency' => 'immediate',
                ]
            ],
        ];
    }

    public static function createDefaultPreferences(User $user): void
    {
        foreach (self::getDefaultPreferences() as $type => $defaults) {
            self::updateOrCreate(
                ['user_id' => $user->id, 'type' => $type],
                [
                    'email_enabled' => $defaults['email_enabled'],
                    'system_enabled' => $defaults['system_enabled'],
                    'settings' => $defaults['settings'],
                ]
            );
        }
    }

    public function getSetting(string $key, mixed $default = null): mixed
    {
        return data_get($this->settings, $key, $default);
    }

    public function setSetting(string $key, mixed $value): void
    {
        $settings = $this->settings ?? [];
        data_set($settings, $key, $value);
        $this->settings = $settings;
    }
}