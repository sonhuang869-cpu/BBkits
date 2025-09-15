<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InventoryAccess
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
            'view' => $user->canViewInventoryTransactions(),
            'create' => $user->canCreateInventoryTransactions(),
            'adjust' => $user->canAdjustStock(),
            'bulk' => $user->canBulkAdjustInventory(),
            'manage' => $user->canManageInventory(),
            default => false
        };

        if (!$hasPermission) {
            abort(403, 'Você não tem permissão para acessar o sistema de estoque.');
        }

        return $next($request);
    }
}