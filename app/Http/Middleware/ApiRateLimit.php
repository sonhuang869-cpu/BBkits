<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Symfony\Component\HttpFoundation\Response;

class ApiRateLimit extends ThrottleRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  int|string  $maxAttempts
     * @param  float|int  $decayMinutes
     * @param  string  $prefix
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle($request, Closure $next, $maxAttempts = 60, $decayMinutes = 1, $prefix = '')
    {
        // Different rate limits based on route patterns
        $routeName = $request->route()->getName();

        if (str_contains($routeName, 'integration')) {
            // Integration endpoints - higher limits for ERP systems
            $maxAttempts = 1000;
            $decayMinutes = 1;
        } elseif (str_contains($routeName, 'webhook')) {
            // Webhook endpoints - very high limits
            $maxAttempts = 5000;
            $decayMinutes = 1;
        } elseif (str_contains($routeName, 'bulk')) {
            // Bulk operations - lower limits
            $maxAttempts = 10;
            $decayMinutes = 1;
        } else {
            // Standard API endpoints
            $maxAttempts = 100;
            $decayMinutes = 1;
        }

        return parent::handle($request, $next, $maxAttempts, $decayMinutes, $prefix);
    }

    /**
     * Resolve the number of attempts if the user is authenticated or not.
     */
    protected function resolveMaxAttempts($request, $maxAttempts)
    {
        if ($request->user()) {
            // Authenticated users get higher limits
            $userRole = $request->user()->role;

            switch ($userRole) {
                case 'admin':
                    return $maxAttempts * 5;
                case 'manager':
                    return $maxAttempts * 3;
                case 'production_admin':
                    return $maxAttempts * 2;
                default:
                    return $maxAttempts;
            }
        }

        // Unauthenticated requests get standard limits
        return $maxAttempts;
    }

    /**
     * Create a 'too many attempts' response.
     */
    protected function buildException($request, $key, $maxAttempts, $responseCallback = null)
    {
        $retryAfter = $this->getTimeUntilNextRetry($key);

        $headers = $this->getHeaders(
            $maxAttempts,
            $this->calculateRemainingAttempts($key, $maxAttempts, $retryAfter),
            $retryAfter
        );

        return response()->json([
            'success' => false,
            'message' => 'Too many API requests. Please try again later.',
            'error' => 'rate_limit_exceeded',
            'retry_after' => $retryAfter,
            'max_attempts' => $maxAttempts,
        ], 429, $headers);
    }
}