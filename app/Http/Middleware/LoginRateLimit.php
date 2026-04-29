<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

/**
 * BUG-N02: Custom database-based rate limiting for login attempts.
 * This uses the database directly instead of the cache system
 * to ensure persistence on Render.com's ephemeral filesystem.
 */
class LoginRateLimit
{
    /**
     * Maximum login attempts allowed per window.
     */
    protected int $maxAttempts = 5;

    /**
     * Time window in seconds (1 minute).
     */
    protected int $decaySeconds = 60;

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = $this->resolveRequestSignature($request);

        // Clean up expired entries
        $this->cleanupExpired();

        // Count current attempts
        $attempts = $this->getAttempts($key);

        if ($attempts >= $this->maxAttempts) {
            $retryAfter = $this->getRetryAfter($key);

            throw new TooManyRequestsHttpException(
                $retryAfter,
                'Muitas tentativas de login. Por favor, aguarde ' . ceil($retryAfter / 60) . ' minuto(s).'
            );
        }

        // Record this attempt
        $this->recordAttempt($key);

        $response = $next($request);

        // Add rate limit headers
        $remaining = max(0, $this->maxAttempts - $this->getAttempts($key));
        $response->headers->set('X-RateLimit-Limit', $this->maxAttempts);
        $response->headers->set('X-RateLimit-Remaining', $remaining);

        return $response;
    }

    /**
     * Resolve request signature (IP-based for login).
     */
    protected function resolveRequestSignature(Request $request): string
    {
        return 'login_rate_limit:' . sha1($request->ip());
    }

    /**
     * Get the number of attempts for a key.
     */
    protected function getAttempts(string $key): int
    {
        try {
            return DB::table('login_attempts')
                ->where('key', $key)
                ->where('expires_at', '>', now())
                ->count();
        } catch (\Exception $e) {
            // If table doesn't exist or query fails, allow the request
            return 0;
        }
    }

    /**
     * Record a login attempt.
     */
    protected function recordAttempt(string $key): void
    {
        try {
            DB::table('login_attempts')->insert([
                'key' => $key,
                'created_at' => now(),
                'expires_at' => now()->addSeconds($this->decaySeconds),
            ]);
        } catch (\Exception $e) {
            // Silently fail if table doesn't exist
            \Log::warning('LoginRateLimit: Could not record attempt', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get seconds until retry is allowed.
     */
    protected function getRetryAfter(string $key): int
    {
        try {
            $oldest = DB::table('login_attempts')
                ->where('key', $key)
                ->where('expires_at', '>', now())
                ->orderBy('expires_at', 'asc')
                ->value('expires_at');

            if ($oldest) {
                return max(1, now()->diffInSeconds($oldest, false));
            }
        } catch (\Exception $e) {
            // Ignore errors
        }

        return $this->decaySeconds;
    }

    /**
     * Clean up expired entries.
     */
    protected function cleanupExpired(): void
    {
        try {
            DB::table('login_attempts')
                ->where('expires_at', '<', now())
                ->delete();
        } catch (\Exception $e) {
            // Silently fail if table doesn't exist
        }
    }
}
