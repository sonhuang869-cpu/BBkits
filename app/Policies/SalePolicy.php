<?php

namespace App\Policies;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SalePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceiro();
    }

    public function create(User $user): bool
    {
        // Vendedoras can create sales, admin can also create on behalf of sellers
        return $user->isVendedora() || $user->isAdmin();
    }

    /**
     * Determine whether the user can view comments for a sale.
     */
    public function viewComments(User $user, Sale $sale): bool
    {
        // Owner, admin, or financeiro can view comments
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceiro();
    }

    /**
     * Determine whether the user can add comments to a sale.
     */
    public function addComment(User $user, Sale $sale): bool
    {
        // Owner, admin, or financeiro can add comments
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceiro();
    }

    /**
     * Determine whether the user can add payments to a sale.
     */
    public function addPayment(User $user, Sale $sale): bool
    {
        // Owner, admin, or financeiro can add payments
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceiro();
    }

    public function update(User $user, Sale $sale): bool
    {
        // BUG-V10: Vendedora can edit their own pending sales
        // Admin can edit any sale at any status
        if ($user->isAdmin()) {
            return true;
        }

        // Owner can edit their own pending sales
        return $user->id === $sale->user_id && $sale->isPending();
    }

    public function delete(User $user, Sale $sale): bool
    {
        // Only admin users can delete sales, regardless of ownership or status
        return $user->isAdmin();
    }

    public function cancel(User $user, Sale $sale): bool
    {
        // BUG-V05: Only owner, admin, or financeiro can cancel
        // Admin password will be verified in controller for non-owner/non-admin
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceiro();
    }

    public function approve(User $user): bool
    {
        return $user->isFinanceiro() || $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Sale $sale): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Sale $sale): bool
    {
        return false;
    }
}
