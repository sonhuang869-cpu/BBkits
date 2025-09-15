<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\Integration\ExternalController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public health check endpoint
Route::get('/health', [ExternalController::class, 'healthCheck']);

// API v1 routes with authentication and rate limiting
Route::prefix('v1')->group(function () {

    // Standard API endpoints for materials management
    Route::middleware(['throttle:api'])->group(function () {

        // Materials API
        Route::prefix('materials')->name('api.materials.')->group(function () {
            Route::get('/', [MaterialController::class, 'index'])->name('index');
            Route::get('/stats', [MaterialController::class, 'stats'])->name('stats');
            Route::get('/{material}', [MaterialController::class, 'show'])->name('show');
            Route::post('/', [MaterialController::class, 'store'])->name('store');
            Route::put('/{material}', [MaterialController::class, 'update'])->name('update');
            Route::delete('/{material}', [MaterialController::class, 'destroy'])->name('destroy');
            Route::post('/{material}/adjust-stock', [MaterialController::class, 'adjustStock'])->name('adjust-stock');
        });

        // Suppliers API
        Route::prefix('suppliers')->name('api.suppliers.')->group(function () {
            Route::get('/', [SupplierController::class, 'index'])->name('index');
            Route::get('/{supplier}', [SupplierController::class, 'show'])->name('show');
            Route::get('/{supplier}/materials', [SupplierController::class, 'materials'])->name('materials');
            Route::post('/', [SupplierController::class, 'store'])->name('store');
            Route::put('/{supplier}', [SupplierController::class, 'update'])->name('update');
            Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('destroy');
        });

        // Inventory API
        Route::prefix('inventory')->name('api.inventory.')->group(function () {
            Route::get('/', [InventoryController::class, 'index'])->name('index');
            Route::get('/stats', [InventoryController::class, 'stats'])->name('stats');
            Route::get('/{transaction}', [InventoryController::class, 'show'])->name('show');
            Route::post('/', [InventoryController::class, 'store'])->name('store');
        });

        // Bulk operations with lower rate limits
        Route::middleware(['throttle:10,1'])->group(function () {
            Route::post('/inventory/bulk-adjustment', [InventoryController::class, 'bulkAdjustment'])->name('api.inventory.bulk-adjustment');
        });
    });

    // Integration endpoints for external systems
    Route::prefix('integration')->name('api.integration.')->middleware(['throttle:1000,1'])->group(function () {

        // Material sync endpoints
        Route::post('/sync/materials', [ExternalController::class, 'syncMaterials'])->name('sync.materials');
        Route::post('/sync/suppliers', [ExternalController::class, 'syncSuppliers'])->name('sync.suppliers');

        // Stock operations
        Route::get('/stock-levels', [ExternalController::class, 'getStockLevels'])->name('stock.levels');
        Route::post('/stock-movements', [ExternalController::class, 'processStockMovements'])->name('stock.movements');

        // Webhook endpoints with highest rate limits
        Route::middleware(['throttle:5000,1'])->group(function () {
            Route::post('/webhook/stock-update', [ExternalController::class, 'stockUpdateWebhook'])->name('webhook.stock-update');
        });
    });
});

// Legacy API endpoints (for backward compatibility)
Route::prefix('legacy')->middleware(['throttle:api'])->group(function () {
    Route::get('/materials', [MaterialController::class, 'index']);
    Route::get('/materials/{material}', [MaterialController::class, 'show']);
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::get('/inventory', [InventoryController::class, 'index']);
});

// API Documentation endpoint
Route::get('/docs', function () {
    return response()->json([
        'api_version' => '1.0.0',
        'documentation_url' => config('app.url') . '/api/docs',
        'endpoints' => [
            'materials' => [
                'GET /api/v1/materials' => 'List all materials with optional filters',
                'GET /api/v1/materials/{id}' => 'Get specific material details',
                'POST /api/v1/materials' => 'Create new material',
                'PUT /api/v1/materials/{id}' => 'Update material',
                'DELETE /api/v1/materials/{id}' => 'Delete material',
                'POST /api/v1/materials/{id}/adjust-stock' => 'Adjust material stock',
                'GET /api/v1/materials/stats' => 'Get materials statistics',
            ],
            'suppliers' => [
                'GET /api/v1/suppliers' => 'List all suppliers',
                'GET /api/v1/suppliers/{id}' => 'Get specific supplier details',
                'GET /api/v1/suppliers/{id}/materials' => 'Get supplier materials',
                'POST /api/v1/suppliers' => 'Create new supplier',
                'PUT /api/v1/suppliers/{id}' => 'Update supplier',
                'DELETE /api/v1/suppliers/{id}' => 'Delete supplier',
            ],
            'inventory' => [
                'GET /api/v1/inventory' => 'List inventory transactions',
                'GET /api/v1/inventory/{id}' => 'Get specific transaction',
                'POST /api/v1/inventory' => 'Create inventory transaction',
                'POST /api/v1/inventory/bulk-adjustment' => 'Bulk inventory adjustment',
                'GET /api/v1/inventory/stats' => 'Get inventory statistics',
            ],
            'integration' => [
                'POST /api/v1/integration/sync/materials' => 'Sync materials from external ERP',
                'POST /api/v1/integration/sync/suppliers' => 'Sync suppliers from external ERP',
                'GET /api/v1/integration/stock-levels' => 'Get current stock levels',
                'POST /api/v1/integration/stock-movements' => 'Process stock movements',
                'POST /api/v1/integration/webhook/stock-update' => 'Stock update webhook',
            ]
        ],
        'authentication' => [
            'type' => 'Bearer Token (Sanctum) or API Key',
            'header' => 'Authorization: Bearer {token} or X-API-Key: {key}',
            'note' => 'All endpoints require authentication except /health and /docs'
        ],
        'rate_limits' => [
            'standard' => '100 requests per minute',
            'integration' => '1000 requests per minute',
            'bulk' => '10 requests per minute',
            'webhook' => '5000 requests per minute'
        ]
    ]);
});