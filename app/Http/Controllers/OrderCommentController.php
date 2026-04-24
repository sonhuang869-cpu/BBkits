<?php

namespace App\Http\Controllers;

use App\Models\OrderComment;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderCommentController extends Controller
{
    public function store(Request $request, Sale $sale)
    {
        // BUG-V07 & BUG-V09: Verify user has access to add comments to this sale
        $user = Auth::user();

        // Vendedoras can only add comments to their own sales
        if ($user->role === 'vendedora' && $sale->user_id !== $user->id) {
            abort(403, 'Você não tem permissão para comentar nesta venda.');
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
            'department' => 'required|in:finance,production,admin,sales,general',
            'mention_user_id' => 'nullable|exists:users,id',
            'is_internal' => 'boolean'
        ]);

        // BUG-V09: Add try-catch to prevent 500 errors
        try {
            $comment = OrderComment::create([
                'sale_id' => $sale->id,
                'user_id' => Auth::id(),
                'department' => $validated['department'],
                'comment' => $validated['comment'],
                'is_internal' => $validated['is_internal'] ?? true,
                'mention_user_id' => $validated['mention_user_id'] ?? null
            ]);

            // Send notification to mentioned user if exists (non-blocking)
            if ($comment->mention_user_id) {
                try {
                    $notificationService = app(\App\Services\NotificationService::class);
                    $notificationService->notifyUserMentioned($comment);
                } catch (\Exception $e) {
                    // Log notification error but don't fail the comment creation
                    \Log::warning('Failed to send comment mention notification', [
                        'comment_id' => $comment->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            return back()->with('success', 'Comentário adicionado com sucesso!');

        } catch (\Exception $e) {
            \Log::error('Failed to create comment', [
                'sale_id' => $sale->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return back()->withErrors(['error' => 'Erro ao adicionar comentário. Tente novamente.']);
        }
    }

    public function index(Sale $sale)
    {
        // BUG-V07: Verify user has access to this sale's comments
        $user = Auth::user();

        // Vendedoras can only see comments on their own sales
        if ($user->role === 'vendedora' && $sale->user_id !== $user->id) {
            abort(403, 'Você não tem permissão para ver comentários desta venda.');
        }

        $comments = $sale->comments()
            ->with(['user', 'mentionedUser'])
            ->latest()
            ->paginate(20);

        return response()->json($comments);
    }

    public function update(Request $request, OrderComment $comment)
    {
        // Only allow the author to edit their comment
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comentário atualizado com sucesso!');
    }

    public function destroy(OrderComment $comment)
    {
        // Only allow the author or admin to delete comment
        if ($comment->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $comment->delete();

        return back()->with('success', 'Comentário removido com sucesso!');
    }
}