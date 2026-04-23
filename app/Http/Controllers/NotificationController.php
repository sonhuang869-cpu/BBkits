<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index(Request $request)
    {
        $notifications = $this->notificationService->getUserNotifications(auth()->id());
        
        // If this is an AJAX request (from the NotificationBell component)
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'notifications' => $notifications
            ]);
        }
        
        // Otherwise return the Inertia page for /notifications route
        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications
        ]);
    }

    public function unreadCount()
    {
        return response()->json([
            'count' => $this->notificationService->getUnreadCount(auth()->id())
        ]);
    }

    public function markAsRead($id)
    {
        // BUG-V06: Verify notification belongs to the authenticated user
        $notification = \App\Models\Notification::find($id);

        if (!$notification) {
            return response()->json(['error' => 'Notificação não encontrada.'], 404);
        }

        if ($notification->user_id !== auth()->id()) {
            return response()->json(['error' => 'Você não tem permissão para marcar esta notificação.'], 403);
        }

        $this->notificationService->markAsRead($id, auth()->id());

        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        $this->notificationService->markAllAsRead(auth()->id());
        
        return response()->json(['success' => true]);
    }
}