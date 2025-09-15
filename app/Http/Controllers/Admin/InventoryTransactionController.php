<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryTransaction;
use App\Models\Material;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryTransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved']);
        $this->middleware('inventory.access:view')->only(['index', 'show']);
        $this->middleware('inventory.access:create')->only(['create', 'store']);
        $this->middleware('inventory.access:bulk')->only(['bulkAdjustment', 'processBulkAdjustment']);
    }

    public function index(Request $request)
    {
        $query = InventoryTransaction::with(['material', 'user'])
            ->when($request->search, function ($query, $search) {
                return $query->whereHas('material', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('reference', 'like', "%{$search}%");
                })
                ->orWhere('reference', 'like', "%{$search}%")
                ->orWhere('notes', 'like', "%{$search}%");
            })
            ->when($request->type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->material_id, function ($query, $materialId) {
                return $query->where('material_id', $materialId);
            })
            ->when($request->user_id, function ($query, $userId) {
                return $query->where('user_id', $userId);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc');

        $transactions = $query->paginate(20)->withQueryString();

        // Get filter options
        $materials = Material::active()->orderBy('name')->get(['id', 'name', 'reference']);
        $users = User::orderBy('name')->get(['id', 'name']);

        // Transaction statistics
        $stats = [
            'total_transactions' => InventoryTransaction::count(),
            'purchases' => InventoryTransaction::where('type', 'purchase')->count(),
            'consumption' => InventoryTransaction::where('type', 'consumption')->count(),
            'adjustments' => InventoryTransaction::where('type', 'adjustment')->count(),
            'returns' => InventoryTransaction::where('type', 'return')->count(),
        ];

        return Inertia::render('Admin/Inventory/TestIndex', [
            'transactions' => $transactions,
            'materials' => $materials,
            'users' => $users,
            'filters' => $request->only(['search', 'type', 'material_id', 'user_id', 'date_from', 'date_to', 'sort', 'direction']),
            'stats' => $stats,
        ]);
    }

    public function show(InventoryTransaction $transaction)
    {
        $transaction->load(['material', 'user']);

        return Inertia::render('Admin/Inventory/Show', [
            'transaction' => $transaction,
        ]);
    }

    public function create(Request $request)
    {
        $materials = Material::active()->orderBy('name')->get(['id', 'name', 'reference', 'unit', 'current_stock']);
        $selectedMaterial = null;

        if ($request->material_id) {
            $selectedMaterial = Material::find($request->material_id);
        }

        return Inertia::render('Admin/Inventory/Create', [
            'materials' => $materials,
            'selectedMaterial' => $selectedMaterial,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|numeric',
            'type' => 'required|in:purchase,consumption,adjustment,return',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'unit_cost' => 'nullable|numeric|min:0',
        ]);

        $material = Material::findOrFail($validated['material_id']);

        // Validate quantity for consumption
        if ($validated['type'] === 'consumption' && $validated['quantity'] > 0) {
            $validated['quantity'] = -abs($validated['quantity']); // Ensure negative for consumption
        }

        if ($validated['type'] === 'consumption' && abs($validated['quantity']) > $material->current_stock) {
            return back()->withErrors([
                'quantity' => 'Quantidade de consumo não pode ser maior que o estoque atual (' . $material->current_stock . ' ' . $material->unit . ')'
            ]);
        }

        $material->adjustStock(
            $validated['quantity'],
            $validated['type'],
            $validated['reference'] ?? null,
            $validated['notes'] ?? null
        );

        // Update unit cost if provided
        if (isset($validated['unit_cost'])) {
            $material->inventoryTransactions()->latest()->first()->update([
                'unit_cost' => $validated['unit_cost']
            ]);
        }

        return redirect()->route('admin.inventory.index')
            ->with('message', 'Transação de estoque criada com sucesso!');
    }

    public function bulkAdjustment()
    {
        $materials = Material::active()
            ->with(['supplier'])
            ->orderBy('name')
            ->get(['id', 'name', 'reference', 'unit', 'current_stock', 'supplier_id']);

        return Inertia::render('Admin/Inventory/BulkAdjustment', [
            'materials' => $materials,
        ]);
    }

    public function processBulkAdjustment(Request $request)
    {
        $validated = $request->validate([
            'adjustments' => 'required|array|min:1',
            'adjustments.*.material_id' => 'required|exists:materials,id',
            'adjustments.*.quantity' => 'required|numeric',
            'adjustments.*.type' => 'required|in:purchase,consumption,adjustment,return',
            'adjustments.*.notes' => 'nullable|string|max:500',
            'adjustments.*.unit_cost' => 'nullable|numeric|min:0',
            'reference' => 'nullable|string|max:255',
        ]);

        $processed = 0;
        $errors = [];

        foreach ($validated['adjustments'] as $index => $adjustment) {
            try {
                $material = Material::findOrFail($adjustment['material_id']);

                // Validate consumption quantity
                if ($adjustment['type'] === 'consumption' && $adjustment['quantity'] > 0) {
                    $adjustment['quantity'] = -abs($adjustment['quantity']);
                }

                if ($adjustment['type'] === 'consumption' && abs($adjustment['quantity']) > $material->current_stock) {
                    $errors[] = "Material {$material->name}: Quantidade de consumo maior que estoque disponível";
                    continue;
                }

                $notes = $adjustment['notes'] ?? null;
                if ($validated['reference']) {
                    $notes = ($notes ? $notes . ' - ' : '') . "Ref: {$validated['reference']}";
                }

                $material->adjustStock(
                    $adjustment['quantity'],
                    $adjustment['type'],
                    $validated['reference'] ?? null,
                    $notes
                );

                // Update unit cost if provided
                if (isset($adjustment['unit_cost'])) {
                    $material->inventoryTransactions()->latest()->first()->update([
                        'unit_cost' => $adjustment['unit_cost']
                    ]);
                }

                $processed++;
            } catch (\Exception $e) {
                $errors[] = "Erro no item " . ($index + 1) . ": " . $e->getMessage();
            }
        }

        $message = "Processados {$processed} ajustes com sucesso!";
        if (!empty($errors)) {
            $message .= " Erros: " . implode(', ', $errors);
        }

        return redirect()->route('admin.inventory.index')
            ->with('message', $message);
    }
}