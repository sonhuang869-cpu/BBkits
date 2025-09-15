<?php

namespace App\Services;

use App\Models\Material;
use App\Models\NotificationPreference;
use App\Models\SystemNotification;
use App\Models\User;
use App\Mail\LowStockAlert;
use App\Mail\StockChangeAlert;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MaterialNotificationService
{
    public function checkLowStockAlerts(): void
    {
        $lowStockMaterials = Material::with(['category', 'supplier'])
            ->whereColumn('current_stock', '<=', 'minimum_stock')
            ->where('is_active', true)
            ->get();

        if ($lowStockMaterials->isEmpty()) {
            return;
        }

        $this->processLowStockAlerts($lowStockMaterials);
    }

    public function checkOutOfStockAlerts(): void
    {
        $outOfStockMaterials = Material::with(['category', 'supplier'])
            ->where('current_stock', '<=', 0)
            ->where('is_active', true)
            ->get();

        if ($outOfStockMaterials->isEmpty()) {
            return;
        }

        $this->processOutOfStockAlerts($outOfStockMaterials);
    }

    public function notifyStockChange(Material $material, float $oldStock, float $newStock, string $reason = ''): void
    {
        $changePercentage = $oldStock > 0 ? abs(($newStock - $oldStock) / $oldStock) * 100 : 100;

        $users = $this->getUsersForNotification('stock_change');

        foreach ($users as $user) {
            $preference = $this->getUserPreference($user, 'stock_change');
            $minimumChangePercentage = $preference->getSetting('minimum_change_percentage', 10);

            if ($changePercentage >= $minimumChangePercentage) {
                $this->createStockChangeNotification($user, $material, $oldStock, $newStock, $reason);

                if ($preference->email_enabled && $preference->getSetting('frequency') === 'immediate') {
                    $this->sendStockChangeEmail($user, $material, $oldStock, $newStock, $reason);
                }
            }
        }
    }

    public function notifyMaterialCreated(Material $material, User $creator): void
    {
        $users = $this->getUsersForNotification('material_created');

        foreach ($users as $user) {
            if ($user->id === $creator->id) {
                continue; // Don't notify the creator
            }

            $preference = $this->getUserPreference($user, 'material_created');

            if ($preference->system_enabled) {
                SystemNotification::createNotification(
                    $user,
                    'material_created',
                    'Novo Material Criado',
                    "O material '{$material->name}' foi criado por {$creator->name}",
                    [
                        'material_id' => $material->id,
                        'material_name' => $material->name,
                        'creator_id' => $creator->id,
                        'creator_name' => $creator->name,
                    ],
                    'normal'
                );
            }
        }
    }

    public function notifyMaterialUpdated(Material $material, User $updater, array $changes): void
    {
        $users = $this->getUsersForNotification('material_updated');

        foreach ($users as $user) {
            if ($user->id === $updater->id) {
                continue; // Don't notify the updater
            }

            $preference = $this->getUserPreference($user, 'material_updated');

            if ($preference->system_enabled) {
                $changesSummary = $this->formatChangesSummary($changes);

                SystemNotification::createNotification(
                    $user,
                    'material_updated',
                    'Material Atualizado',
                    "O material '{$material->name}' foi atualizado por {$updater->name}. Mudanças: {$changesSummary}",
                    [
                        'material_id' => $material->id,
                        'material_name' => $material->name,
                        'updater_id' => $updater->id,
                        'updater_name' => $updater->name,
                        'changes' => $changes,
                    ],
                    'normal'
                );
            }
        }
    }

    public function notifyPurchaseRequired(): void
    {
        $users = $this->getUsersForNotification('purchase_required');

        foreach ($users as $user) {
            $preference = $this->getUserPreference($user, 'purchase_required');
            $daysAhead = $preference->getSetting('days_ahead', 7);

            $materialsNeedingPurchase = $this->getMaterialsNeedingPurchase($daysAhead);

            if ($materialsNeedingPurchase->isNotEmpty()) {
                $this->createPurchaseRequiredNotification($user, $materialsNeedingPurchase, $daysAhead);

                if ($preference->email_enabled) {
                    $this->sendPurchaseRequiredEmail($user, $materialsNeedingPurchase, $daysAhead);
                }
            }
        }
    }

    private function processLowStockAlerts($materials): void
    {
        $users = $this->getUsersForNotification('low_stock');

        foreach ($users as $user) {
            $preference = $this->getUserPreference($user, 'low_stock');

            // Group materials by severity
            $criticalMaterials = $materials->filter(function ($material) use ($preference) {
                $threshold = $preference->getSetting('threshold_percentage', 20);
                return ($material->current_stock / $material->minimum_stock) * 100 <= (100 - $threshold);
            });

            if ($criticalMaterials->isNotEmpty()) {
                $this->createLowStockNotification($user, $criticalMaterials);

                if ($preference->email_enabled) {
                    $this->sendLowStockEmail($user, $criticalMaterials);
                }
            }
        }
    }

    private function processOutOfStockAlerts($materials): void
    {
        $users = $this->getUsersForNotification('out_of_stock');

        foreach ($users as $user) {
            $preference = $this->getUserPreference($user, 'out_of_stock');

            if ($preference->system_enabled) {
                SystemNotification::createNotification(
                    $user,
                    'out_of_stock',
                    'Materiais Sem Estoque',
                    "Atenção! {$materials->count()} materiais estão sem estoque e precisam de reposição urgente.",
                    [
                        'materials_count' => $materials->count(),
                        'materials' => $materials->map(fn($m) => [
                            'id' => $m->id,
                            'name' => $m->name,
                            'reference' => $m->reference,
                        ])->toArray(),
                    ],
                    'critical'
                );
            }

            if ($preference->email_enabled) {
                $this->sendOutOfStockEmail($user, $materials);
            }
        }
    }

    private function createLowStockNotification(User $user, $materials): void
    {
        $count = $materials->count();
        $materialsList = $materials->pluck('name')->take(3)->implode(', ');
        $extraCount = $count > 3 ? " e mais " . ($count - 3) : "";

        SystemNotification::createNotification(
            $user,
            'low_stock',
            'Alerta de Estoque Baixo',
            "Atenção! {$count} materiais com estoque baixo: {$materialsList}{$extraCount}",
            [
                'materials_count' => $count,
                'materials' => $materials->map(fn($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'reference' => $m->reference,
                    'current_stock' => $m->current_stock,
                    'minimum_stock' => $m->minimum_stock,
                ])->toArray(),
            ],
            'high'
        );
    }

    private function createStockChangeNotification(User $user, Material $material, float $oldStock, float $newStock, string $reason): void
    {
        $change = $newStock - $oldStock;
        $changeText = $change > 0 ? "aumentou" : "diminuiu";
        $changeAmount = abs($change);

        SystemNotification::createNotification(
            $user,
            'stock_change',
            'Mudança de Estoque',
            "Estoque do material '{$material->name}' {$changeText} em {$changeAmount} {$material->unit}" . ($reason ? " ({$reason})" : ""),
            [
                'material_id' => $material->id,
                'material_name' => $material->name,
                'old_stock' => $oldStock,
                'new_stock' => $newStock,
                'change' => $change,
                'reason' => $reason,
            ],
            abs($change) > ($material->minimum_stock * 0.5) ? 'high' : 'normal'
        );
    }

    private function createPurchaseRequiredNotification(User $user, $materials, int $daysAhead): void
    {
        $count = $materials->count();

        SystemNotification::createNotification(
            $user,
            'purchase_required',
            'Compra Necessária',
            "Atenção! {$count} materiais precisarão de reposição nos próximos {$daysAhead} dias.",
            [
                'materials_count' => $count,
                'days_ahead' => $daysAhead,
                'materials' => $materials->map(fn($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'reference' => $m->reference,
                    'estimated_days' => $m->estimated_days_until_stockout,
                ])->toArray(),
            ],
            'high'
        );
    }

    private function getUsersForNotification(string $type): \Illuminate\Support\Collection
    {
        return User::whereIn('role', ['admin', 'manager'])
            ->whereHas('notificationPreferences', function ($query) use ($type) {
                $query->where('type', $type)
                      ->where(function ($q) {
                          $q->where('email_enabled', true)
                            ->orWhere('system_enabled', true);
                      });
            })
            ->get();
    }

    private function getUserPreference(User $user, string $type): NotificationPreference
    {
        return $user->notificationPreferences()
            ->where('type', $type)
            ->first() ?? $this->createDefaultPreference($user, $type);
    }

    private function createDefaultPreference(User $user, string $type): NotificationPreference
    {
        $defaults = NotificationPreference::getDefaultPreferences()[$type] ?? [];

        return NotificationPreference::create([
            'user_id' => $user->id,
            'type' => $type,
            'email_enabled' => $defaults['email_enabled'] ?? false,
            'system_enabled' => $defaults['system_enabled'] ?? true,
            'settings' => $defaults['settings'] ?? [],
        ]);
    }

    private function sendLowStockEmail(User $user, $materials): void
    {
        try {
            Mail::to($user->email)->send(new LowStockAlert($materials));
        } catch (\Exception $e) {
            Log::error('Failed to send low stock email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function sendStockChangeEmail(User $user, Material $material, float $oldStock, float $newStock, string $reason): void
    {
        try {
            Mail::to($user->email)->send(new StockChangeAlert($material, $oldStock, $newStock, $reason));
        } catch (\Exception $e) {
            Log::error('Failed to send stock change email', [
                'user_id' => $user->id,
                'material_id' => $material->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function sendOutOfStockEmail(User $user, $materials): void
    {
        // Similar to low stock but with critical urgency
        try {
            Mail::to($user->email)->send(new LowStockAlert($materials, true)); // true for out of stock
        } catch (\Exception $e) {
            Log::error('Failed to send out of stock email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function sendPurchaseRequiredEmail(User $user, $materials, int $daysAhead): void
    {
        // Implementation for purchase required email
    }

    private function getMaterialsNeedingPurchase(int $daysAhead): \Illuminate\Support\Collection
    {
        return Material::with(['category', 'supplier'])
            ->where('is_active', true)
            ->get()
            ->filter(function ($material) use ($daysAhead) {
                $estimatedDays = $this->calculateDaysUntilStockout($material);
                return $estimatedDays !== null && $estimatedDays <= $daysAhead;
            });
    }

    private function calculateDaysUntilStockout(Material $material): ?int
    {
        // Similar to the calculation in ReportsController
        $avgDailyConsumption = $material->inventoryTransactions()
            ->where('type', 'consumption')
            ->where('created_at', '>=', now()->subDays(30))
            ->avg(\DB::raw('ABS(quantity)'));

        if (!$avgDailyConsumption || $avgDailyConsumption <= 0) {
            return null;
        }

        return (int) round($material->current_stock / $avgDailyConsumption);
    }

    private function formatChangesSummary(array $changes): string
    {
        $summary = [];
        foreach ($changes as $field => $change) {
            $summary[] = "{$field}: {$change['old']} → {$change['new']}";
        }
        return implode(', ', array_slice($summary, 0, 3)) . (count($summary) > 3 ? '...' : '');
    }
}