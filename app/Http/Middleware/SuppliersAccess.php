<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuppliersAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $permission = 'view'): Response
    {
        $user = $request->user();

        if (!$user || !$user->isApproved()) {
            abort(403, 'Acesso negado. Usuário não aprovado.');
        }

        $hasPermission = match($permission) {
            'view' => $user->canViewSuppliers(),
            'create' => $user->canEditSuppliers(), // Use edit permission for create
            'edit' => $user->canEditSuppliers(),
            'manage' => $user->canManageSuppliers(),
            'delete' => $user->canDeleteSuppliers(),
            default => false
        };

        if (!$hasPermission) {
            abort(403, 'Você não tem permissão para acessar o sistema de fornecedores.');
        }

        return $next($request);
    }
}