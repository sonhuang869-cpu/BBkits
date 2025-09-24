<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\InventoryTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class MaterialConsumptionReportController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved']);
    }

    public function index(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->format('Y-m-d'));
        $materialId = $request->get('material_id');
        $userId = $request->get('user_id');
        $groupBy = $request->get('group_by', 'day'); // day, week, month

        // Validate date range
        $dateFrom = Carbon::parse($dateFrom)->startOfDay();
        $dateTo = Carbon::parse($dateTo)->endOfDay();

        // Overall consumption statistics
        $overallStats = $this->getOverallConsumptionStats($dateFrom, $dateTo, $materialId, $userId);

        // Top consumed materials by quantity and value
        $topMaterialsByQuantity = $this->getTopMaterialsByQuantity($dateFrom, $dateTo, $userId, 10);
        $topMaterialsByValue = $this->getTopMaterialsByValue($dateFrom, $dateTo, $userId, 10);

        // Consumption trends over time
        $consumptionTrends = $this->getConsumptionTrends($dateFrom, $dateTo, $materialId, $userId, $groupBy);

        // User/department consumption analysis
        $consumptionByUser = $this->getConsumptionByUser($dateFrom, $dateTo, $materialId);

        // Daily average consumption rates
        $averageConsumptionRates = $this->getAverageConsumptionRates($dateFrom, $dateTo, $materialId, $userId);

        // Cost analysis
        $costAnalysis = $this->getCostAnalysis($dateFrom, $dateTo, $materialId, $userId);

        // Recent consumption transactions for detail view
        $recentTransactions = $this->getRecentConsumptionTransactions($dateFrom, $dateTo, $materialId, $userId, 20);

        // Filter options
        $materials = Material::active()->orderBy('name')->get(['id', 'name', 'reference']);
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Reports/MaterialConsumptionReport', [
            'overallStats' => $overallStats,
            'topMaterialsByQuantity' => $topMaterialsByQuantity,
            'topMaterialsByValue' => $topMaterialsByValue,
            'consumptionTrends' => $consumptionTrends,
            'consumptionByUser' => $consumptionByUser,
            'averageConsumptionRates' => $averageConsumptionRates,
            'costAnalysis' => $costAnalysis,
            'recentTransactions' => $recentTransactions,
            'materials' => $materials,
            'users' => $users,
            'filters' => [
                'date_from' => $dateFrom->format('Y-m-d'),
                'date_to' => $dateTo->format('Y-m-d'),
                'material_id' => $materialId,
                'user_id' => $userId,
                'group_by' => $groupBy,
            ],
        ]);
    }

    public function exportPdf(Request $request)
    {
        // Implementation for PDF export would go here
        // This would generate a PDF version of the consumption report
        return response()->json(['message' => 'PDF export functionality to be implemented']);
    }

    public function exportExcel(Request $request)
    {
        // Implementation for Excel export would go here
        // This would generate an Excel version of the consumption report
        return response()->json(['message' => 'Excel export functionality to be implemented']);
    }

    private function getOverallConsumptionStats($dateFrom, $dateTo, $materialId = null, $userId = null)
    {
        $query = InventoryTransaction::where('type', 'consumption')
            ->whereBetween('created_at', [$dateFrom, $dateTo]);

        if ($materialId) {
            $query->where('material_id', $materialId);
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $baseStats = $query->select([
            DB::raw('COUNT(*) as total_transactions'),
            DB::raw('SUM(ABS(quantity)) as total_quantity_consumed'),
            DB::raw('COUNT(DISTINCT material_id) as unique_materials_consumed'),
            DB::raw('COUNT(DISTINCT user_id) as unique_users'),
            DB::raw('AVG(ABS(quantity)) as average_transaction_quantity'),
        ])->first();

        // Calculate total value consumed
        $totalValueConsumed = InventoryTransaction::join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
            ->where('inventory_transactions.type', 'consumption')
            ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
            ->when($materialId, function ($query) use ($materialId) {
                return $query->where('inventory_transactions.material_id', $materialId);
            })
            ->when($userId, function ($query) use ($userId) {
                return $query->where('inventory_transactions.user_id', $userId);
            })
            ->sum(DB::raw('ABS(inventory_transactions.quantity) * materials.purchase_price'));

        // Calculate days in period for daily averages
        $daysInPeriod = $dateFrom->diffInDays($dateTo) + 1;

        return [
            'total_transactions' => $baseStats->total_transactions ?? 0,
            'total_quantity_consumed' => $baseStats->total_quantity_consumed ?? 0,
            'total_value_consumed' => $totalValueConsumed ?? 0,
            'unique_materials_consumed' => $baseStats->unique_materials_consumed ?? 0,
            'unique_users' => $baseStats->unique_users ?? 0,
            'average_transaction_quantity' => $baseStats->average_transaction_quantity ?? 0,
            'daily_average_quantity' => $daysInPeriod > 0 ? ($baseStats->total_quantity_consumed ?? 0) / $daysInPeriod : 0,
            'daily_average_value' => $daysInPeriod > 0 ? ($totalValueConsumed ?? 0) / $daysInPeriod : 0,
            'days_in_period' => $daysInPeriod,
        ];
    }

    private function getTopMaterialsByQuantity($dateFrom, $dateTo, $userId = null, $limit = 10)
    {
        $query = InventoryTransaction::select([
            'materials.id',
            'materials.name',
            'materials.reference',
            'materials.unit',
            'materials.purchase_price',
            DB::raw('SUM(ABS(inventory_transactions.quantity)) as total_consumed'),
            DB::raw('COUNT(inventory_transactions.id) as transaction_count'),
            DB::raw('AVG(ABS(inventory_transactions.quantity)) as average_per_transaction'),
            DB::raw('SUM(ABS(inventory_transactions.quantity) * materials.purchase_price) as total_value'),
        ])
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($userId, function ($query) use ($userId) {
            return $query->where('inventory_transactions.user_id', $userId);
        })
        ->groupBy('materials.id', 'materials.name', 'materials.reference', 'materials.unit', 'materials.purchase_price')
        ->orderBy('total_consumed', 'desc')
        ->limit($limit);

        return $query->get();
    }

    private function getTopMaterialsByValue($dateFrom, $dateTo, $userId = null, $limit = 10)
    {
        $query = InventoryTransaction::select([
            'materials.id',
            'materials.name',
            'materials.reference',
            'materials.unit',
            'materials.purchase_price',
            DB::raw('SUM(ABS(inventory_transactions.quantity)) as total_consumed'),
            DB::raw('COUNT(inventory_transactions.id) as transaction_count'),
            DB::raw('SUM(ABS(inventory_transactions.quantity) * materials.purchase_price) as total_value'),
            DB::raw('AVG(ABS(inventory_transactions.quantity) * materials.purchase_price) as average_value_per_transaction'),
        ])
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($userId, function ($query) use ($userId) {
            return $query->where('inventory_transactions.user_id', $userId);
        })
        ->groupBy('materials.id', 'materials.name', 'materials.reference', 'materials.unit', 'materials.purchase_price')
        ->orderBy('total_value', 'desc')
        ->limit($limit);

        return $query->get();
    }

    private function getConsumptionTrends($dateFrom, $dateTo, $materialId = null, $userId = null, $groupBy = 'day')
    {
        $dateFormat = match($groupBy) {
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d'
        };

        $query = InventoryTransaction::select([
            DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
            DB::raw('SUM(ABS(quantity)) as total_quantity'),
            DB::raw('COUNT(*) as transaction_count'),
        ])
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($materialId, function ($query) use ($materialId) {
            return $query->where('inventory_transactions.material_id', $materialId);
        })
        ->when($userId, function ($query) use ($userId) {
            return $query->where('inventory_transactions.user_id', $userId);
        })
        ->groupBy('period')
        ->orderBy('period');

        $trends = $query->get();

        // Calculate total value for each period
        $valueQuery = InventoryTransaction::select([
            DB::raw("DATE_FORMAT(inventory_transactions.created_at, '{$dateFormat}') as period"),
            DB::raw('SUM(ABS(inventory_transactions.quantity) * materials.purchase_price) as total_value'),
        ])
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($materialId, function ($query) use ($materialId) {
            return $query->where('inventory_transactions.material_id', $materialId);
        })
        ->when($userId, function ($query) use ($userId) {
            return $query->where('inventory_transactions.user_id', $userId);
        })
        ->groupBy('period')
        ->orderBy('period')
        ->pluck('total_value', 'period');

        // Merge value data with trends
        $trends->each(function ($trend) use ($valueQuery) {
            $trend->total_value = $valueQuery->get($trend->period) ?? 0;
        });

        return $trends;
    }

    private function getConsumptionByUser($dateFrom, $dateTo, $materialId = null)
    {
        $query = InventoryTransaction::select([
            'users.id',
            'users.name',
            DB::raw('SUM(ABS(inventory_transactions.quantity)) as total_consumed'),
            DB::raw('COUNT(inventory_transactions.id) as transaction_count'),
            DB::raw('COUNT(DISTINCT inventory_transactions.material_id) as unique_materials'),
        ])
        ->join('users', 'inventory_transactions.user_id', '=', 'users.id')
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($materialId, function ($query) use ($materialId) {
            return $query->where('inventory_transactions.material_id', $materialId);
        })
        ->groupBy('users.id', 'users.name')
        ->orderBy('total_consumed', 'desc');

        $userConsumption = $query->get();

        // Calculate total value consumed per user
        $userValues = InventoryTransaction::select([
            'users.id',
            DB::raw('SUM(ABS(inventory_transactions.quantity) * materials.purchase_price) as total_value'),
        ])
        ->join('users', 'inventory_transactions.user_id', '=', 'users.id')
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($materialId, function ($query) use ($materialId) {
            return $query->where('inventory_transactions.material_id', $materialId);
        })
        ->groupBy('users.id')
        ->pluck('total_value', 'id');

        // Add value data to user consumption
        $userConsumption->each(function ($user) use ($userValues) {
            $user->total_value = $userValues->get($user->id) ?? 0;
        });

        return $userConsumption;
    }

    private function getAverageConsumptionRates($dateFrom, $dateTo, $materialId = null, $userId = null)
    {
        $daysInPeriod = $dateFrom->diffInDays($dateTo) + 1;

        $query = InventoryTransaction::select([
            'materials.id',
            'materials.name',
            'materials.reference',
            'materials.unit',
            DB::raw('SUM(ABS(inventory_transactions.quantity)) as total_consumed'),
            DB::raw('COUNT(DISTINCT DATE(inventory_transactions.created_at)) as active_days'),
            DB::raw('COUNT(inventory_transactions.id) as transaction_count'),
        ])
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($materialId, function ($query) use ($materialId) {
            return $query->where('inventory_transactions.material_id', $materialId);
        })
        ->when($userId, function ($query) use ($userId) {
            return $query->where('inventory_transactions.user_id', $userId);
        })
        ->groupBy('materials.id', 'materials.name', 'materials.reference', 'materials.unit')
        ->having('total_consumed', '>', 0)
        ->orderBy('total_consumed', 'desc');

        $rates = $query->get();

        // Calculate averages
        $rates->each(function ($rate) use ($daysInPeriod) {
            $rate->daily_average = $rate->total_consumed / $daysInPeriod;
            $rate->weekly_average = $rate->total_consumed / max(1, $daysInPeriod / 7);
            $rate->monthly_average = $rate->total_consumed / max(1, $daysInPeriod / 30);
            $rate->average_per_transaction = $rate->total_consumed / max(1, $rate->transaction_count);
            $rate->consumption_frequency = $rate->active_days / $daysInPeriod; // Percentage of days with consumption
        });

        return $rates;
    }

    private function getCostAnalysis($dateFrom, $dateTo, $materialId = null, $userId = null)
    {
        // Cost per material category if categories exist
        $costByCategory = InventoryTransaction::select([
            'material_categories.name as category_name',
            DB::raw('SUM(ABS(inventory_transactions.quantity) * materials.purchase_price) as total_cost'),
            DB::raw('SUM(ABS(inventory_transactions.quantity)) as total_quantity'),
            DB::raw('COUNT(DISTINCT materials.id) as material_count'),
        ])
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->leftJoin('material_categories', 'materials.category_id', '=', 'material_categories.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($materialId, function ($query) use ($materialId) {
            return $query->where('inventory_transactions.material_id', $materialId);
        })
        ->when($userId, function ($query) use ($userId) {
            return $query->where('inventory_transactions.user_id', $userId);
        })
        ->groupBy('material_categories.id', 'material_categories.name')
        ->orderBy('total_cost', 'desc')
        ->get();

        // Cost efficiency metrics
        $costEfficiency = InventoryTransaction::select([
            DB::raw('AVG(materials.purchase_price) as average_unit_cost'),
            DB::raw('MIN(materials.purchase_price) as min_unit_cost'),
            DB::raw('MAX(materials.purchase_price) as max_unit_cost'),
            DB::raw('SUM(ABS(inventory_transactions.quantity) * materials.purchase_price) / SUM(ABS(inventory_transactions.quantity)) as weighted_average_cost'),
        ])
        ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
        ->where('inventory_transactions.type', 'consumption')
        ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo])
        ->when($materialId, function ($query) use ($materialId) {
            return $query->where('inventory_transactions.material_id', $materialId);
        })
        ->when($userId, function ($query) use ($userId) {
            return $query->where('inventory_transactions.user_id', $userId);
        })
        ->first();

        return [
            'cost_by_category' => $costByCategory,
            'cost_efficiency' => $costEfficiency,
        ];
    }

    private function getRecentConsumptionTransactions($dateFrom, $dateTo, $materialId = null, $userId = null, $limit = 20)
    {
        $query = InventoryTransaction::with(['material', 'user'])
            ->where('type', 'consumption')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->when($materialId, function ($query) use ($materialId) {
                return $query->where('material_id', $materialId);
            })
            ->when($userId, function ($query) use ($userId) {
                return $query->where('user_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->limit($limit);

        return $query->get();
    }
}