<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Laravel\Sanctum\Exceptions\MissingAbilityException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // BUG-A10: Trust all proxies (Render load balancer) for correct HTTPS detection
        $middleware->trustProxies(at: '*');

        // BUG-N05: Add security headers middleware globally
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);

        $middleware->web(append: [
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // BUG-D03: Enable Sanctum stateful authentication for API routes
        // This allows web session cookies to authenticate API requests
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'approved' => \App\Http\Middleware\EnsureUserIsApproved::class,
            'production.access' => \App\Http\Middleware\EnsureUserCanManageProduction::class,
            'finance.access' => \App\Http\Middleware\FinanceAccess::class,
            'finance.admin' => \App\Http\Middleware\FinanceAdminMiddleware::class,
            'production.admin' => \App\Http\Middleware\ProductionAdminMiddleware::class,
            'manager' => \App\Http\Middleware\ManagerMiddleware::class,
            'materials.access' => \App\Http\Middleware\MaterialsAccess::class,
            'suppliers.access' => \App\Http\Middleware\SuppliersAccess::class,
            'inventory.access' => \App\Http\Middleware\InventoryAccess::class,
            'api.auth' => \App\Http\Middleware\ApiAuthentication::class,
            'api.rate' => \App\Http\Middleware\ApiRateLimit::class,
            'login.rate' => \App\Http\Middleware\LoginRateLimit::class, // BUG-N02
        ]);
    })
    ->withCommands([
        \App\Console\Commands\MigrateReceiptsToBase64::class,
    ])
    ->withExceptions(function (Exceptions $exceptions): void {
        // BUG-N04: Hide Eloquent namespace in 404 errors
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Recurso não encontrado.'
                ], 404);
            }
            return response()->view('errors.404', [], 404);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Recurso não encontrado.'
                ], 404);
            }
        });

        // BUG-N01: Handle authentication exceptions (invalid tokens, etc.)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Não autenticado.'
                ], 401);
            }
        });

        // Handle Sanctum's missing ability exception
        $exceptions->render(function (MissingAbilityException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Não autorizado.'
                ], 403);
            }
        });

        // Handle unauthorized HTTP exceptions
        $exceptions->render(function (UnauthorizedHttpException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Não autenticado.'
                ], 401);
            }
        });

        // Catch-all for API errors to prevent 500 exposing server details
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') && !config('app.debug')) {
                // Check if it's an auth-related error
                $message = strtolower($e->getMessage());
                $isAuthError = str_contains($message, 'unauthenticated') ||
                               str_contains($message, 'unauthorized') ||
                               str_contains($message, 'token') ||
                               str_contains($message, 'bearer') ||
                               str_contains($message, 'credential');

                if ($isAuthError) {
                    return response()->json([
                        'message' => 'Não autenticado.'
                    ], 401);
                }

                \Log::error('API Error', [
                    'message' => $e->getMessage(),
                    'url' => $request->fullUrl(),
                    'exception' => get_class($e)
                ]);

                return response()->json([
                    'message' => 'Erro interno do servidor.'
                ], 500);
            }
        });
    })->create();
