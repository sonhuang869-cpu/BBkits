<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved']);
        $this->middleware('suppliers.access:view')->only(['index', 'show']);
        $this->middleware('suppliers.access:edit')->only(['create', 'store', 'edit', 'update']);
        $this->middleware('suppliers.access:delete')->only(['destroy']);
    }

    public function index(Request $request)
    {
        $query = Supplier::withCount('materials')
            ->when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('contact_name', 'like', "%{$search}%");
            })
            ->when($request->status === 'active', function ($query) {
                return $query->active();
            })
            ->orderBy($request->sort ?? 'name', $request->direction ?? 'asc');

        $suppliers = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Suppliers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'payment_terms' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        Supplier::create($validated);

        return redirect()->route('admin.suppliers.index')
            ->with('message', 'Fornecedor criado com sucesso!');
    }

    public function show(Supplier $supplier)
    {
        $supplier->load(['materials' => function ($query) {
            $query->orderBy('name');
        }]);

        return Inertia::render('Admin/Suppliers/Show', [
            'supplier' => $supplier,
        ]);
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Admin/Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'payment_terms' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $supplier->update($validated);

        return redirect()->route('admin.suppliers.index')
            ->with('message', 'Fornecedor atualizado com sucesso!');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('admin.suppliers.index')
            ->with('message', 'Fornecedor removido com sucesso!');
    }
}