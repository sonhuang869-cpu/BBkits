<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * BUG-D09: Middleware for admin-only routes.
 * Unlike EnsureUserIsAdmin, this does NOT allow 'financeiro' role.
 * Use this for sensitive routes like user management, backups, etc.
 */
class EnsureUserIsAdminOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Não autenticado.'
                ], 401);
            }
            return redirect('/login');
        }

        $user = auth()->user();
        if ($user->role !== 'admin') {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Acesso negado. Apenas administradores podem acessar esta área.'
                ], 403);
            }
            abort(403, 'Acesso negado. Apenas administradores podem acessar esta área.');
        }

        return $next($request);
    }
}
