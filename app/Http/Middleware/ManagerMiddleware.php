<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ManagerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // SECURITY FIX: Check authentication first before accessing user properties
        if (!auth()->check()) {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json(['message' => 'Não autenticado.'], 401);
            }
            return redirect()->route('login');
        }

        $user = auth()->user();
        if ($user->role !== 'manager' && $user->role !== 'admin') {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json(['message' => 'Acesso negado. Apenas gerentes podem acessar esta área.'], 403);
            }
            abort(403, 'Acesso negado. Apenas gerentes podem acessar esta área.');
        }

        return $next($request);
    }
}