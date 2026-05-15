<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanManageProduction
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->canManageProduction()) {
            abort(403, 'Acesso negado. Você não tem permissão para gerenciar produção.');
        }

        return $next($request);
    }
}