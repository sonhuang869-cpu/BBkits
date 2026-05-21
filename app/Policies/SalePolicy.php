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

    /**
     * BUG-D09: financeiro can view (read-only), finance_admin can view and act
     */
    public function view(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceAdmin() || $user->isFinanceiro();
    }

    public function create(User $user): bool
    {
        // Vendedoras can create sales, admin can also create on behalf of sellers
        return $user->isVendedora() || $user->isAdmin();
    }

    /**
     * Determine whether the user can view comments for a sale.
     * BUG-D09: financeiro can view (read-only), finance_admin can view and act
     */
    public function viewComments(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceAdmin() || $user->isFinanceiro();
    }

    /**
     * Determine whether the user can add comments to a sale.
     * BUG-D09: Removed financeiro - only owner, admin, or finance_admin can add comments
     */
    public function addComment(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceAdmin();
    }

    /**
     * Determine whether the user can add payments to a sale.
     * BUG-D09: Removed financeiro - only owner, admin, or finance_admin can add payments
     */
    public function addPayment(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceAdmin();
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

    /**
     * BUG-D09: Removed financeiro - only owner, admin, or finance_admin can cancel
     */
    public function cancel(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceAdmin();
    }

    /**
     * BUG-D09: Removed financeiro - only admin or finance_admin can approve
     */
    public function approve(User $user): bool
    {
        return $user->isAdmin() || $user->isFinanceAdmin();
    }

    /**
     * BUG-D06/D09: Determine whether the user can update the status of a sale.
     * Only admin or finance_admin can update status (not financeiro).
     */
    public function updateStatus(User $user, Sale $sale): bool
    {
        return $user->isAdmin() || $user->isFinanceAdmin();
    }

    /**
     * BUG-D08: Determine whether the user can correct a sale.
     * Only admin can correct sales (financial corrections).
     */
    public function correct(User $user, Sale $sale): bool
    {
        return $user->isAdmin();
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
