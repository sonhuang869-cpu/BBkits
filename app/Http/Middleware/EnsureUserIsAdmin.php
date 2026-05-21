<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect('/login');
        }
        
        $user = auth()->user();
        // BUG-D09: Removed 'financeiro' - only admin and finance_admin can access admin areas
        // 'financeiro' role is view-only and should access via /finance/* routes instead
        if ($user->role !== 'admin' && $user->role !== 'finance_admin') {
            abort(403, 'Acesso negado. Apenas administradores podem acessar esta área.');
        }
        
        return $next($request);
    }
}
