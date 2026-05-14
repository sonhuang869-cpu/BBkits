<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

/**
 * BUG-N05: Add security headers to all responses
 * BUG-N07: Remove X-Powered-By header
 * BUG-D12: Use nonce-based CSP instead of unsafe-inline/unsafe-eval
 */
class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // BUG-D12: Generate CSP nonce before processing the request
        // This allows Vite to inject the nonce into script/style tags
        $nonce = $this->generateNonce();
        Vite::useCspNonce($nonce);

        $response = $next($request);

        // BUG-N07: Remove X-Powered-By header
        header_remove('X-Powered-By');

        // BUG-N05: Add security headers
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        // HSTS - only on HTTPS
        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // BUG-D12: CSP - Content Security Policy with nonces (no unsafe-inline/unsafe-eval)
        // The nonce allows only scripts/styles that have the matching nonce attribute
        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'nonce-{$nonce}'",
            "style-src 'self' 'nonce-{$nonce}' https://fonts.bunny.net https://fonts.googleapis.com",
            "font-src 'self' https://fonts.bunny.net https://fonts.gstatic.com",
            "img-src 'self' data: blob: https:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "base-uri 'self'",
        ]);
        $response->headers->set('Content-Security-Policy', $csp);

        // Remove server identification
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }

    /**
     * Generate a cryptographically secure random nonce.
     */
    private function generateNonce(): string
    {
        return base64_encode(random_bytes(16));
    }
}
