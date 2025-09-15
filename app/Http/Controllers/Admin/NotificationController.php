<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationPreference;
use App\Models\SystemNotification;
use App\Services\MaterialNotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved']);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $query = SystemNotification::where('user_id', $user->id);

        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('unread_only') && $request->boolean('unread_only')) {
            $query->unread();
        }

        $notifications = $query->orderBy('created_at', 'desc')->paginate(20);

        $stats = [
            'total' => SystemNotification::where('user_id', $user->id)->count(),
            'unread' => SystemNotification::where('user_id', $user->id)->unread()->count(),
            'high_priority' => SystemNotification::where('user_id', $user->id)->unread()->where('priority', 'high')->count(),
            'critical' => SystemNotification::where('user_id', $user->id)->unread()->where('priority', 'critical')->count(),
        ];

        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $notifications,
            'stats' => $stats,
            'filters' => [
                'type' => $request->get('type'),
                'priority' => $request->get('priority'),
                'unread_only' => $request->get('unread_only'),
            ],
            'notificationTypes' => NotificationPreference::TYPES,
            'priorities' => SystemNotification::PRIORITIES,
        ]);
    }

    public function preferences(Request $request)
    {
        $user = $request->user();

        // Ensure user has all default preferences
        NotificationPreference::createDefaultPreferences($user);

        $preferences = $user->notificationPreferences()
            ->orderBy('type')
            ->get()
            ->keyBy('type');

        return Inertia::render('Admin/Notifications/Preferences', [
            'preferences' => $preferences,
            'notificationTypes' => NotificationPreference::TYPES,
            'defaultPreferences' => NotificationPreference::getDefaultPreferences(),
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'preferences' => 'required|array',
            'preferences.*.email_enabled' => 'boolean',
            'preferences.*.system_enabled' => 'boolean',
            'preferences.*.settings' => 'nullable|array',
        ]);

        foreach ($validated['preferences'] as $type => $data) {
            NotificationPreference::updateOrCreate(
                ['user_id' => $user->id, 'type' => $type],
                [
                    'email_enabled' => $data['email_enabled'] ?? false,
                    'system_enabled' => $data['system_enabled'] ?? false,
                    'settings' => $data['settings'] ?? [],
                ]
            );
        }

        return back()->with('success', 'Preferências de notificação atualizadas com sucesso!');
    }

    public function markAsRead(SystemNotification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAsUnread(SystemNotification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->markAsUnread();

        return response()->json(['success' => true]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        SystemNotification::where('user_id', $user->id)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    public function delete(SystemNotification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->delete();

        return back()->with('success', 'Notificação excluída com sucesso!');
    }

    public function getUnreadCount(Request $request)
    {
        $count = SystemNotification::where('user_id', $request->user()->id)
            ->unread()
            ->count();

        return response()->json(['count' => $count]);
    }

    public function testNotifications(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'manager'])) {
            abort(403);
        }

        $notificationService = app(MaterialNotificationService::class);

        $type = $request->get('type', 'low_stock');

        try {
            switch ($type) {
                case 'low_stock':
                    $notificationService->checkLowStockAlerts();
                    break;
                case 'out_of_stock':
                    $notificationService->checkOutOfStockAlerts();
                    break;
                case 'purchase_required':
                    $notificationService->notifyPurchaseRequired();
                    break;
                default:
                    return response()->json(['success' => false, 'message' => 'Tipo de teste inválido']);
            }

            return response()->json(['success' => true, 'message' => 'Teste de notificação executado com sucesso!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erro ao executar teste: ' . $e->getMessage()]);
        }
    }
}