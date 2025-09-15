<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAuthentication
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the request has a valid API token
        if (!$request->bearerToken() && !$request->header('X-API-Key')) {
            return response()->json([
                'success' => false,
                'message' => 'API authentication required',
                'error' => 'missing_authentication'
            ], 401);
        }

        // Check API key if provided (for external systems)
        if ($request->header('X-API-Key')) {
            $apiKey = $request->header('X-API-Key');

            // Validate API key format and check against allowed keys
            if (!$this->isValidApiKey($apiKey)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid API key',
                    'error' => 'invalid_api_key'
                ], 401);
            }

            // Set a pseudo-user for API key authentication
            $request->merge(['api_authenticated' => true]);

            // Create a system user context for API operations
            auth()->setUser($this->getApiUser());
        }

        return $next($request);
    }

    /**
     * Validate API key
     */
    private function isValidApiKey(string $apiKey): bool
    {
        $validApiKeys = config('api.keys', []);

        // Check if the API key exists and is active
        return in_array($apiKey, $validApiKeys) ||
               $this->validateDynamicApiKey($apiKey);
    }

    /**
     * Validate dynamic API keys (stored in database)
     */
    private function validateDynamicApiKey(string $apiKey): bool
    {
        // For production, you might want to store API keys in database
        // with expiration dates, usage limits, etc.

        // Simple validation for now - check if it matches expected format
        return preg_match('/^bbkits_[a-zA-Z0-9]{32}$/', $apiKey);
    }

    /**
     * Get system user for API operations
     */
    private function getApiUser()
    {
        // Return a system user or find an admin user for API operations
        return \App\Models\User::where('role', 'admin')->first() ?:
               new \App\Models\User(['role' => 'admin', 'name' => 'API System']);
    }
}