<?php

namespace App\Http\Controllers;

use App\Services\TinyERPService;
use App\Services\WATIService;
use App\Traits\SanitizesErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * BUG-D02: Public webhook controller for external service callbacks
 * These endpoints use token/signature validation instead of session authentication
 */
class WebhookController extends Controller
{
    use SanitizesErrorMessages;
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
            // SECURITY FIX: Use sanitized logging
            $this->logErrorSafely('Tiny ERP webhook processing failed', $e, [
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
            // SECURITY FIX: Use sanitized logging
            $this->logErrorSafely('WATI webhook processing failed', $e, [
                'ip' => $request->ip(),
            ]);

            return response()->json(['error' => 'Falha no processamento do webhook.'], 500);
        }
    }

    /**
     * Validate Tiny ERP webhook signature
     * SECURITY: Only checks X-TinyERP-Token header against configured secret
     * Never accepts secrets from request body (could be logged by proxies)
     */
    private function validateTinyErpSignature(Request $request): bool
    {
        $configuredSecret = config('services.tiny_erp.webhook_secret');

        // SECURITY FIX: Require webhook secret to be configured
        // Never accept all requests - this is a critical security vulnerability
        if (empty($configuredSecret)) {
            Log::error('Tiny ERP webhook: No secret configured - REJECTING request for security');
            return false;
        }

        // SECURITY FIX: Only check header, never request body
        // Request body content may be logged by proxies, load balancers, or WAFs
        $headerToken = $request->header('X-TinyERP-Token');
        if ($headerToken && hash_equals($configuredSecret, $headerToken)) {
            return true;
        }

        return false;
    }

    /**
     * Validate WATI webhook signature
     * SECURITY: Only checks X-WATI-Token header against configured secret
     * Never accepts secrets from request body (could be logged by proxies)
     */
    private function validateWatiSignature(Request $request): bool
    {
        $configuredSecret = config('services.wati.webhook_secret');

        // SECURITY FIX: Require webhook secret to be configured
        // Never accept all requests - this is a critical security vulnerability
        if (empty($configuredSecret)) {
            Log::error('WATI webhook: No secret configured - REJECTING request for security');
            return false;
        }

        // SECURITY FIX: Only check header, never request body
        // Request body content may be logged by proxies, load balancers, or WAFs
        $headerToken = $request->header('X-WATI-Token');
        if ($headerToken && hash_equals($configuredSecret, $headerToken)) {
            return true;
        }

        return false;
    }
}
