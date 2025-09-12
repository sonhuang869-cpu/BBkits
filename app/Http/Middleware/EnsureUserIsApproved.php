<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login');
        }

        if ($user->isVendedora() && !$user->isApproved()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Usuário aguardando aprovação.'], 403);
            }
            return redirect()->route('pending-approval');
        }

        return $next($request);
    }
}