<?php

namespace App\Http\Controllers;

use App\Services\TinyERPService;
use App\Services\WATIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * BUG-D02: Public webhook controller for external service callbacks
 * These endpoints use token/signature validation instead of session authentication
 */
class WebhookController extends Controller
{
    /**
     * Handle Tiny ERP webhook
     * Public endpoint - validates using X-TinyERP-Token header or webhook_secret parameter
     */
    public function tinyErp(Request $request)
    {
        try {
            // Validate webhook signature/token
            if (!$this->validateTinyErpSignature($request)) {
                Log::warning('Tiny ERP webhook: Invalid signature', [
                    'ip' => $request->ip(),
                    'headers' => $request->headers->all(),
                ]);
                return response()->json(['error' => 'Assinatura inválida.'], 401);
            }

            $webhookData = $request->all();
            Log::info('Tiny ERP webhook received', [
                'type' => $webhookData['type'] ?? 'unknown',
                'ip' => $request->ip(),
            ]);

            $service = app(TinyERPService::class);
            $result = $service->processWebhook($webhookData);

            return response()->json(['status' => 'processed', 'result' => $result]);

        } catch (\Exception $e) {
            Log::error('Tiny ERP webhook processing failed', [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            return response()->json(['error' => 'Falha no processamento do webhook.'], 500);
        }
    }

    /**
     * Handle WATI WhatsApp webhook
     * Public endpoint - validates using X-WATI-Token header or webhook_secret parameter
     */
    public function wati(Request $request)
    {
        try {
            // Validate webhook signature/token
            if (!$this->validateWatiSignature($request)) {
                Log::warning('WATI webhook: Invalid signature', [
                    'ip' => $request->ip(),
                    'headers' => $request->headers->all(),
                ]);
                return response()->json(['error' => 'Assinatura inválida.'], 401);
            }

            $webhookData = $request->all();
            Log::info('WATI webhook received', [
                'type' => $webhookData['type'] ?? 'unknown',
                'ip' => $request->ip(),
            ]);

            $service = app(WATIService::class);
            $result = $service->processWebhook($webhookData);

            return response()->json(['status' => 'processed', 'result' => $result]);

        } catch (\Exception $e) {
            Log::error('WATI webhook processing failed', [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            return response()->json(['error' => 'Falha no processamento do webhook.'], 500);
        }
    }

    /**
     * Validate Tiny ERP webhook signature
     * Checks X-TinyERP-Token header or webhook_secret parameter against configured secret
     */
    private function validateTinyErpSignature(Request $request): bool
    {
        $configuredSecret = config('services.tiny_erp.webhook_secret');

        // If no secret is configured, allow all requests (for development/testing)
        // In production, you should always configure a secret
        if (empty($configuredSecret)) {
            Log::warning('Tiny ERP webhook: No secret configured, accepting all requests');
            return true;
        }

        // Check header first
        $headerToken = $request->header('X-TinyERP-Token');
        if ($headerToken === $configuredSecret) {
            return true;
        }

        // Check request body parameter
        $bodyToken = $request->input('webhook_secret');
        if ($bodyToken === $configuredSecret) {
            return true;
        }

        return false;
    }

    /**
     * Validate WATI webhook signature
     * Checks X-WATI-Token header or webhook_secret parameter against configured secret
     */
    private function validateWatiSignature(Request $request): bool
    {
        $configuredSecret = config('services.wati.webhook_secret');

        // If no secret is configured, allow all requests (for development/testing)
        // In production, you should always configure a secret
        if (empty($configuredSecret)) {
            Log::warning('WATI webhook: No secret configured, accepting all requests');
            return true;
        }

        // Check header first
        $headerToken = $request->header('X-WATI-Token');
        if ($headerToken === $configuredSecret) {
            return true;
        }

        // Check request body parameter
        $bodyToken = $request->input('webhook_secret');
        if ($bodyToken === $configuredSecret) {
            return true;
        }

        return false;
    }
}
