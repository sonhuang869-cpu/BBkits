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
                'message' => 'Autenticação da API obrigatória.',
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
                    'message' => 'Chave de API inválida.',
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
     * SECURITY FIX: Removed regex-only validation which accepted ANY matching key
     * API keys must be explicitly configured in config/api.php or stored securely
     */
    private function validateDynamicApiKey(string $apiKey): bool
    {
        // SECURITY: Only accept API keys that are explicitly configured
        // The regex-only validation was a critical vulnerability - it accepted
        // ANY key matching the format, allowing attackers to forge valid keys
        //
        // For production with database-stored keys, implement:
        // return \App\Models\ApiKey::where('key', hash('sha256', $apiKey))
        //     ->where('is_active', true)
        //     ->where('expires_at', '>', now())
        //     ->exists();

        // For now, reject all dynamic keys - only configured keys are valid
        return false;
    }

    /**
     * Get system user for API operations
     * SECURITY FIX H-02: Role removed from $fillable, set explicitly
     */
    private function getApiUser()
    {
        // Return a system user or find an admin user for API operations
        $existingAdmin = \App\Models\User::where('role', 'admin')->first();
        if ($existingAdmin) {
            return $existingAdmin;
        }

        // Create a temporary user object for API operations (not saved)
        $apiUser = new \App\Models\User();
        $apiUser->name = 'API System';
        $apiUser->role = 'admin'; // Direct assignment allowed for temp objects
        return $apiUser;
    }
}