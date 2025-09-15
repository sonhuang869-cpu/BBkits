<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaterialCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialCategoriesController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved', 'materials.access:view']);
        $this->middleware('materials.access:create')->only(['create', 'store']);
        $this->middleware('materials.access:edit')->only(['edit', 'update']);
        $this->middleware('materials.access:delete')->only(['destroy']);
    }

    public function index(Request $request)
    {
        $query = MaterialCategory::with(['parent', 'children'])
            ->withCount('materials');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('parent_id')) {
            if ($request->get('parent_id') === 'root') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $request->get('parent_id'));
            }
        }

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        $categories = $query->ordered()->paginate(20);

        // Get root categories for filter
        $rootCategories = MaterialCategory::rootCategories()
            ->active()
            ->ordered()
            ->get(['id', 'name']);

        return Inertia::render('Admin/MaterialCategories/Index', [
            'categories' => $categories,
            'rootCategories' => $rootCategories,
            'filters' => [
                'search' => $request->get('search'),
                'parent_id' => $request->get('parent_id'),
                'active' => $request->get('active'),
            ],
            'stats' => [
                'total' => MaterialCategory::count(),
                'active' => MaterialCategory::active()->count(),
                'root' => MaterialCategory::rootCategories()->count(),
                'with_materials' => MaterialCategory::has('materials')->count(),
            ],
        ]);
    }

    public function create()
    {
        $parentCategories = MaterialCategory::active()
            ->ordered()
            ->get(['id', 'name', 'parent_id'])
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->full_name,
                ];
            });

        return Inertia::render('Admin/MaterialCategories/Create', [
            'parentCategories' => $parentCategories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:material_categories',
            'description' => 'nullable|string',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'icon' => 'nullable|string|max:50',
            'parent_id' => 'nullable|exists:material_categories,id',
            'active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $category = MaterialCategory::create($validated);

        return redirect()
            ->route('admin.material-categories.index')
            ->with('success', 'Categoria criada com sucesso!');
    }

    public function show(MaterialCategory $materialCategory)
    {
        $materialCategory->load(['parent', 'children.materials', 'materials.supplier']);

        $stats = [
            'direct_materials' => $materialCategory->materials()->count(),
            'total_materials' => $materialCategory->total_materials_count,
            'total_stock_value' => $materialCategory->materials()
                ->sum(\DB::raw('current_stock * purchase_price')),
            'low_stock_materials' => $materialCategory->materials()
                ->whereColumn('current_stock', '<=', 'minimum_stock')
                ->count(),
        ];

        return Inertia::render('Admin/MaterialCategories/Show', [
            'category' => $materialCategory,
            'stats' => $stats,
        ]);
    }

    public function edit(MaterialCategory $materialCategory)
    {
        $parentCategories = MaterialCategory::active()
            ->where('id', '!=', $materialCategory->id)
            ->ordered()
            ->get(['id', 'name', 'parent_id'])
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->full_name,
                ];
            });

        return Inertia::render('Admin/MaterialCategories/Edit', [
            'category' => $materialCategory,
            'parentCategories' => $parentCategories,
        ]);
    }

    public function update(Request $request, MaterialCategory $materialCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:material_categories,code,' . $materialCategory->id,
            'description' => 'nullable|string',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'icon' => 'nullable|string|max:50',
            'parent_id' => 'nullable|exists:material_categories,id',
            'active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Prevent setting parent to self or descendant
        if ($validated['parent_id'] && $this->wouldCreateCycle($materialCategory, $validated['parent_id'])) {
            return back()->withErrors(['parent_id' => 'Não é possível definir esta categoria como pai pois criaria um ciclo.']);
        }

        $materialCategory->update($validated);

        return redirect()
            ->route('admin.material-categories.index')
            ->with('success', 'Categoria atualizada com sucesso!');
    }

    public function destroy(MaterialCategory $materialCategory)
    {
        // Check if category has materials
        if ($materialCategory->materials()->count() > 0) {
            return back()->withErrors(['delete' => 'Não é possível excluir categoria que possui materiais associados.']);
        }

        // Check if category has children
        if ($materialCategory->children()->count() > 0) {
            return back()->withErrors(['delete' => 'Não é possível excluir categoria que possui subcategorias.']);
        }

        $materialCategory->delete();

        return redirect()
            ->route('admin.material-categories.index')
            ->with('success', 'Categoria excluída com sucesso!');
    }

    private function wouldCreateCycle(MaterialCategory $category, $parentId): bool
    {
        $current = MaterialCategory::find($parentId);

        while ($current) {
            if ($current->id === $category->id) {
                return true;
            }
            $current = $current->parent;
        }

        return false;
    }
}