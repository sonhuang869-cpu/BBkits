<?php

namespace App\Console\Commands;

use App\Services\MaterialNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckMaterialNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'materials:check-notifications {--type=all : Type of notifications to check (low_stock, out_of_stock, purchase_required, all)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and send material notifications (low stock, out of stock, purchase required)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $type = $this->option('type');
        $notificationService = app(MaterialNotificationService::class);

        $this->info('Starting material notifications check...');

        try {
            if ($type === 'all' || $type === 'low_stock') {
                $this->info('Checking low stock alerts...');
                $notificationService->checkLowStockAlerts();
                $this->info('✓ Low stock alerts checked');
            }

            if ($type === 'all' || $type === 'out_of_stock') {
                $this->info('Checking out of stock alerts...');
                $notificationService->checkOutOfStockAlerts();
                $this->info('✓ Out of stock alerts checked');
            }

            if ($type === 'all' || $type === 'purchase_required') {
                $this->info('Checking purchase required notifications...');
                $notificationService->notifyPurchaseRequired();
                $this->info('✓ Purchase required notifications checked');
            }

            $this->info('Material notifications check completed successfully!');

            Log::info('Material notifications check completed', [
                'type' => $type,
                'timestamp' => now(),
            ]);

            return self::SUCCESS;

        } catch (\Exception $e) {
            $this->error('Error checking material notifications: ' . $e->getMessage());

            Log::error('Material notifications check failed', [
                'type' => $type,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return self::FAILURE;
        }
    }
}