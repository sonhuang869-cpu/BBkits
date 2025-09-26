<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Services\TinyERPService;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class IntegrationController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    private function getTinyERPService(): TinyERPService
    {
        return app(TinyERPService::class);
    }

    private function getWhatsAppService(): WhatsAppService
    {
        return app(WhatsAppService::class);
    }

    /**
     * Show integrations dashboard
     */
    public function index()
    {
        // Test connections
        $tinyErpStatus = $this->getTinyERPService()->testConnection();
        $whatsAppStatus = $this->getWhatsAppService()->testConnection();

        // Get integration statistics
        $stats = $this->getIntegrationStats();

        return Inertia::render('Admin/Integrations/Index', [
            'tinyErp' => [
                'status' => $tinyErpStatus,
                'config' => [
                    'base_url' => config('services.tiny_erp.base_url'),
                    'has_token' => !empty(config('services.tiny_erp.token')),
                    'sender_configured' => !empty(config('services.tiny_erp.sender_address')),
                ]
            ],
            'whatsApp' => [
                'status' => $whatsAppStatus,
                'config' => [
                    'base_url' => config('services.wati.base_url'),
                    'has_token' => !empty(config('services.wati.access_token')),
                    'enabled' => config('services.wati.enabled', true),
                    'templates_count' => count(config('services.wati.templates', [])),
                ]
            ],
            'stats' => $stats
        ]);
    }

    /**
     * Test Tiny ERP connection
     */
    public function testTinyErp()
    {
        try {
            $result = $this->getTinyERPService()->testConnection();
            
            return response()->json([
                'success' => $result['success'],
                'message' => $result['message'],
                'data' => $result['data'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Tiny ERP test failed', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erro ao testar conexão: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test WhatsApp connection
     */
    public function testWhatsApp()
    {
        try {
            $result = $this->getWhatsAppService()->testConnection();
            
            return response()->json([
                'success' => $result['success'],
                'message' => $result['message'],
                'data' => $result['data'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('WhatsApp test failed', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erro ao testar conexão: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate invoice manually for a sale
     */
    public function generateInvoice(Request $request, Sale $sale)
    {
        try {
            $result = $this->getTinyERPService()->generateInvoice($sale);
            
            if ($result['success']) {
                return back()->with('message', $result['message']);
            } else {
                return back()->withErrors(['error' => $result['message']]);
            }
        } catch (\Exception $e) {
            Log::error('Manual invoice generation failed', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao gerar nota fiscal: ' . $e->getMessage()]);
        }
    }

    /**
     * Generate shipping label manually for a sale
     */
    public function generateShippingLabel(Request $request, Sale $sale)
    {
        try {
            $result = $this->getTinyERPService()->generateShippingLabel($sale);
            
            if ($result['success']) {
                return back()->with('message', $result['message']);
            } else {
                return back()->withErrors(['error' => $result['message']]);
            }
        } catch (\Exception $e) {
            Log::error('Manual shipping label generation failed', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao gerar etiqueta: ' . $e->getMessage()]);
        }
    }

    /**
     * Send WhatsApp message manually
     */
    public function sendWhatsAppMessage(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'message_type' => 'required|string|in:order_confirmation,payment_approved,production_started,photo_approval,order_shipped,payment_rejected,final_payment_reminder,custom',
            'custom_message' => 'nullable|string|max:1000'
        ]);

        try {
            $result = null;
            
            switch ($validated['message_type']) {
                case 'order_confirmation':
                    $result = $this->getWhatsAppService()->sendOrderConfirmation($sale);
                    break;
                case 'payment_approved':
                    $result = $this->getWhatsAppService()->sendPaymentApproved($sale);
                    break;
                case 'production_started':
                    $result = $this->getWhatsAppService()->sendProductionStarted($sale);
                    break;
                case 'photo_approval':
                    $result = $this->getWhatsAppService()->sendPhotoApprovalRequest($sale);
                    break;
                case 'order_shipped':
                    $result = $this->getWhatsAppService()->sendShippingNotification($sale);
                    break;
                case 'payment_rejected':
                    $result = $this->getWhatsAppService()->sendPaymentRejected($sale, 'Teste manual');
                    break;
                case 'final_payment_reminder':
                    $result = $this->getWhatsAppService()->sendFinalPaymentReminder($sale);
                    break;
                case 'custom':
                    $result = $this->getWhatsAppService()->sendCustomMessage(
                        $sale->client_phone,
                        $validated['custom_message'] ?? 'Mensagem de teste BBKits'
                    );
                    break;
            }
            
            if ($result && $result['success']) {
                return back()->with('message', 'Mensagem WhatsApp enviada com sucesso!');
            } else {
                return back()->withErrors(['error' => $result['message'] ?? 'Erro ao enviar mensagem']);
            }
        } catch (\Exception $e) {
            Log::error('Manual WhatsApp message failed', [
                'sale_id' => $sale->id,
                'message_type' => $validated['message_type'],
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao enviar mensagem: ' . $e->getMessage()]);
        }
    }

    /**
     * Sync order status with Tiny ERP
     */
    public function syncOrderStatus(Request $request, Sale $sale)
    {
        try {
            $result = $this->getTinyERPService()->syncOrderStatus($sale);
            
            if ($result['success']) {
                return back()->with('message', $result['message']);
            } else {
                return back()->withErrors(['error' => $result['message']]);
            }
        } catch (\Exception $e) {
            Log::error('Order status sync failed', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao sincronizar status: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk sync all orders with Tiny ERP
     */
    public function bulkSyncOrders(Request $request)
    {
        try {
            $orders = Sale::whereNotNull('tiny_erp_invoice_id')
                         ->where('order_status', '!=', 'shipped')
                         ->limit(20) // Process 20 at a time
                         ->get();

            $synced = 0;
            $errors = 0;

            foreach ($orders as $order) {
                $result = $this->getTinyERPService()->syncOrderStatus($order);
                
                if ($result['success']) {
                    $synced++;
                } else {
                    $errors++;
                }
            }

            return back()->with('message', "Sincronização concluída: {$synced} pedidos sincronizados, {$errors} erros.");
        } catch (\Exception $e) {
            Log::error('Bulk sync failed', ['error' => $e->getMessage()]);
            
            return back()->withErrors(['error' => 'Erro na sincronização em lote: ' . $e->getMessage()]);
        }
    }

    /**
     * Get integration statistics
     */
    private function getIntegrationStats()
    {
        $now = now();
        $lastMonth = $now->subMonth();

        return [
            'tiny_erp' => [
                'invoices_generated' => Sale::whereNotNull('tiny_erp_invoice_id')->count(),
                'invoices_this_month' => Sale::whereNotNull('tiny_erp_invoice_id')
                    ->whereMonth('invoice_generated_at', $now->month)
                    ->whereYear('invoice_generated_at', $now->year)
                    ->count(),
                'shipping_labels_generated' => Sale::whereNotNull('tiny_erp_shipping_id')->count(),
                'shipping_labels_this_month' => Sale::whereNotNull('tiny_erp_shipping_id')
                    ->whereMonth('shipping_label_generated_at', $now->month)
                    ->whereYear('shipping_label_generated_at', $now->year)
                    ->count(),
                'failed_invoices' => Sale::where('tiny_erp_status', 'invoice_failed')->count(),
                'failed_shipping' => Sale::where('tiny_erp_status', 'shipping_failed')->count(),
                'success_rate' => $this->calculateTinyErpSuccessRate()
            ],
            'whatsapp' => [
                'total_sent' => Sale::where('whatsapp_confirmation_sent', true)->count(),
                'sent_this_month' => Sale::where('whatsapp_confirmation_sent', true)
                    ->whereMonth('whatsapp_confirmation_sent_at', $now->month)
                    ->whereYear('whatsapp_confirmation_sent_at', $now->year)
                    ->count(),
                'payment_notifications' => Sale::where('whatsapp_payment_approved_sent', true)->count(),
                'photo_requests' => Sale::where('whatsapp_photo_sent', true)->count(),
                'shipping_notifications' => Sale::where('whatsapp_shipping_sent', true)->count(),
                'success_rate' => $this->getWhatsAppService()->getMessagingStats()['success_rate'] ?? 0
            ],
            'orders' => [
                'total_orders' => Sale::count(),
                'orders_this_month' => Sale::whereMonth('created_at', $now->month)
                    ->whereYear('created_at', $now->year)
                    ->count(),
                'integrated_orders' => Sale::where(function ($query) {
                    $query->whereNotNull('tiny_erp_invoice_id')
                          ->orWhere('whatsapp_confirmation_sent', true);
                })->count(),
                'integration_rate' => $this->calculateIntegrationRate()
            ]
        ];
    }

    /**
     * Calculate Tiny ERP success rate
     */
    private function calculateTinyErpSuccessRate()
    {
        $totalOrders = Sale::count();
        
        if ($totalOrders === 0) {
            return 100;
        }
        
        $successfulIntegrations = Sale::where(function ($query) {
            $query->whereNotNull('tiny_erp_invoice_id')
                  ->where('tiny_erp_status', '!=', 'invoice_failed')
                  ->where('tiny_erp_status', '!=', 'shipping_failed');
        })->count();
        
        return round(($successfulIntegrations / $totalOrders) * 100, 2);
    }

    /**
     * Calculate overall integration rate
     */
    private function calculateIntegrationRate()
    {
        $totalOrders = Sale::count();
        
        if ($totalOrders === 0) {
            return 100;
        }
        
        $integratedOrders = Sale::where(function ($query) {
            $query->whereNotNull('tiny_erp_invoice_id')
                  ->orWhere('whatsapp_confirmation_sent', true);
        })->count();
        
        return round(($integratedOrders / $totalOrders) * 100, 2);
    }

    /**
     * Show integration logs
     */
    public function logs(Request $request)
    {
        $type = $request->get('type', 'all'); // all, tiny_erp, whatsapp
        $dateFrom = $request->get('date_from', now()->subDays(7)->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->format('Y-m-d'));

        $query = Sale::whereBetween('created_at', [$dateFrom, $dateTo]);

        if ($type === 'tiny_erp') {
            $query->where(function ($q) {
                $q->whereNotNull('tiny_erp_invoice_id')
                  ->orWhereNotNull('tiny_erp_error');
            });
        } elseif ($type === 'whatsapp') {
            $query->where(function ($q) {
                $q->where('whatsapp_confirmation_sent', true)
                  ->orWhere('whatsapp_payment_approved_sent', true)
                  ->orWhere('whatsapp_photo_sent', true)
                  ->orWhere('whatsapp_shipping_sent', true);
            });
        }

        $logs = $query->with(['user'])
                     ->orderBy('created_at', 'desc')
                     ->paginate(50);

        return Inertia::render('Admin/Integrations/Logs', [
            'logs' => $logs,
            'filters' => [
                'type' => $type,
                'date_from' => $dateFrom,
                'date_to' => $dateTo
            ]
        ]);
    }
}