<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'suppliers.access:view'])->only(['index', 'show']);
        $this->middleware(['auth:sanctum', 'suppliers.access:edit'])->only(['store', 'update']);
        $this->middleware(['auth:sanctum', 'suppliers.access:delete'])->only(['destroy']);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Supplier::withCount('materials');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%");
            });
        }

        if ($request->has('has_materials')) {
            if ($request->boolean('has_materials')) {
                $query->has('materials');
            } else {
                $query->doesntHave('materials');
            }
        }

        $perPage = min($request->get('per_page', 15), 100);
        $suppliers = $query->orderBy('name')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $suppliers->items(),
            'meta' => [
                'current_page' => $suppliers->currentPage(),
                'last_page' => $suppliers->lastPage(),
                'per_page' => $suppliers->perPage(),
                'total' => $suppliers->total(),
                'from' => $suppliers->firstItem(),
                'to' => $suppliers->lastItem(),
            ],
            'links' => [
                'first' => $suppliers->url(1),
                'last' => $suppliers->url($suppliers->lastPage()),
                'prev' => $suppliers->previousPageUrl(),
                'next' => $suppliers->nextPageUrl(),
            ]
        ]);
    }

    public function show(Supplier $supplier): JsonResponse
    {
        $supplier->load(['materials' => function ($query) {
            $query->orderBy('name');
        }]);

        return response()->json([
            'success' => true,
            'data' => $supplier
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:suppliers',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Supplier created successfully',
            'data' => $supplier
        ], 201);
    }

    public function update(Request $request, Supplier $supplier): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('suppliers')->ignore($supplier->id)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Supplier updated successfully',
            'data' => $supplier
        ]);
    }

    public function destroy(Supplier $supplier): JsonResponse
    {
        if ($supplier->materials()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete supplier: it has associated materials'
            ], 422);
        }

        $supplier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Supplier deleted successfully'
        ]);
    }

    public function materials(Supplier $supplier): JsonResponse
    {
        $materials = $supplier->materials()
                             ->orderBy('name')
                             ->get();

        return response()->json([
            'success' => true,
            'data' => $materials
        ]);
    }
}