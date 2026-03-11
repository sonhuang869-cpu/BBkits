<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Services\PurchaseOrderService;
use App\Services\PurchaseSuggestionService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    protected PurchaseOrderService $orderService;

    public function __construct(PurchaseOrderService $orderService)
    {
        $this->middleware(['auth', 'approved']);
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $query = PurchaseOrder::with(['supplier', 'createdBy'])
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->supplier_id, fn($q, $id) => $q->where('supplier_id', $id))
            ->when($request->search, function ($q, $search) {
                $q->where('po_number', 'like', "%{$search}%")
                    ->orWhereHas('supplier', fn($sq) => $sq->where('name', 'like', "%{$search}%"));
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc');

        $purchaseOrders = $query->paginate(20)->withQueryString();

        $suppliers = Supplier::active()->orderBy('name')->get(['id', 'name']);
        $summary = $this->orderService->getPurchaseOrderSummary();

        return Inertia::render('Admin/PurchaseOrders/Index', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => $suppliers,
            'summary' => $summary,
            'statuses' => PurchaseOrder::getStatusOptions(),
            'filters' => $request->only(['status', 'supplier_id', 'search', 'sort', 'direction']),
        ]);
    }

    public function create(Request $request)
    {
        $suppliers = Supplier::active()->orderBy('name')->get(['id', 'name', 'payment_terms']);
        $materials = Material::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'reference', 'unit', 'purchase_price', 'supplier_id']);

        // Pre-fill from suggestions if supplier_id provided
        $prefilledItems = [];
        if ($request->supplier_id) {
            $suggestionService = app(PurchaseSuggestionService::class);
            $suggestions = $suggestionService->getSuggestions(['supplier_id' => $request->supplier_id]);

            foreach ($suggestions['suggestions'] as $s) {
                $prefilledItems[] = [
                    'material_id' => $s['material_id'],
                    'material_name' => $s['material_name'],
                    'material_reference' => $s['material_reference'],
                    'quantity' => $s['suggested_quantity'],
                    'unit_price' => $s['purchase_price'],
                    'unit' => $s['unit'],
                ];
            }
        }

        return Inertia::render('Admin/PurchaseOrders/Create', [
            'suppliers' => $suppliers,
            'materials' => $materials,
            'prefilledItems' => $prefilledItems,
            'prefilledSupplierId' => $request->supplier_id,
            'priorities' => PurchaseOrder::getPriorityOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'expected_delivery_date' => 'nullable|date|after_or_equal:today',
            'payment_terms' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'delivery_address' => 'nullable|string',
            'priority' => 'nullable|in:low,normal,high,urgent',
            'line_items' => 'required|array|min:1',
            'line_items.*.material_id' => 'required|exists:materials,id',
            'line_items.*.quantity' => 'required|numeric|min:0.01',
            'line_items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Enrich line items with material info
        foreach ($validated['line_items'] as &$item) {
            $material = Material::find($item['material_id']);
            $item['material_name'] = $material->name;
            $item['material_reference'] = $material->reference;
            $item['unit'] = $material->unit;
            $item['total_price'] = $item['quantity'] * $item['unit_price'];
        }

        $validated['created_by'] = auth()->id();

        $purchaseOrder = $this->orderService->createPurchaseOrder($validated);

        return redirect()
            ->route('admin.purchase-orders.show', $purchaseOrder)
            ->with('success', 'Pedido de compra criado com sucesso!');
    }

    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'createdBy', 'approvedBy']);

        return Inertia::render('Admin/PurchaseOrders/Show', [
            'purchaseOrder' => $purchaseOrder,
            'statuses' => PurchaseOrder::getStatusOptions(),
        ]);
    }

    public function edit(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== PurchaseOrder::STATUS_DRAFT) {
            return back()->withErrors(['edit' => 'Apenas pedidos em rascunho podem ser editados.']);
        }

        $suppliers = Supplier::active()->orderBy('name')->get(['id', 'name', 'payment_terms']);
        $materials = Material::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'reference', 'unit', 'purchase_price', 'supplier_id']);

        return Inertia::render('Admin/PurchaseOrders/Edit', [
            'purchaseOrder' => $purchaseOrder,
            'suppliers' => $suppliers,
            'materials' => $materials,
            'priorities' => PurchaseOrder::getPriorityOptions(),
        ]);
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== PurchaseOrder::STATUS_DRAFT) {
            return back()->withErrors(['edit' => 'Apenas pedidos em rascunho podem ser editados.']);
        }

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'expected_delivery_date' => 'nullable|date',
            'payment_terms' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'delivery_address' => 'nullable|string',
            'priority' => 'nullable|in:low,normal,high,urgent',
            'line_items' => 'required|array|min:1',
            'line_items.*.material_id' => 'required|exists:materials,id',
            'line_items.*.quantity' => 'required|numeric|min:0.01',
            'line_items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Enrich line items
        foreach ($validated['line_items'] as &$item) {
            $material = Material::find($item['material_id']);
            $item['material_name'] = $material->name;
            $item['material_reference'] = $material->reference;
            $item['unit'] = $material->unit;
            $item['total_price'] = $item['quantity'] * $item['unit_price'];
        }

        $purchaseOrder->update($validated);
        $this->orderService->recalculatePurchaseOrderTotals($purchaseOrder);

        return redirect()
            ->route('admin.purchase-orders.show', $purchaseOrder)
            ->with('success', 'Pedido de compra atualizado!');
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        if (!in_array($purchaseOrder->status, [PurchaseOrder::STATUS_DRAFT, PurchaseOrder::STATUS_CANCELLED])) {
            return back()->withErrors(['delete' => 'Apenas pedidos em rascunho ou cancelados podem ser excluídos.']);
        }

        $purchaseOrder->delete();

        return redirect()
            ->route('admin.purchase-orders.index')
            ->with('success', 'Pedido de compra excluído!');
    }

    public function approve(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== PurchaseOrder::STATUS_DRAFT) {
            return back()->withErrors(['approve' => 'Apenas pedidos em rascunho podem ser aprovados.']);
        }

        $this->orderService->approvePurchaseOrder($purchaseOrder, auth()->id());

        return back()->with('success', 'Pedido de compra aprovado e enviado!');
    }

    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', array_keys(PurchaseOrder::getStatusOptions())),
        ]);

        $purchaseOrder->update(['status' => $validated['status']]);

        return back()->with('success', 'Status atualizado!');
    }

    public function receive(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'received_items' => 'required|array',
            'received_items.*.material_id' => 'required|exists:materials,id',
            'received_items.*.received_quantity' => 'required|numeric|min:0',
        ]);

        $this->orderService->receivePurchaseOrder($purchaseOrder, $validated['received_items']);

        return back()->with('success', 'Materiais recebidos com sucesso!');
    }

    public function exportPdf(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load(['supplier', 'createdBy', 'approvedBy']);

        $pdf = Pdf::loadView('pdf.purchase-order', [
            'purchaseOrder' => $purchaseOrder,
            'generatedAt' => now()->format('d/m/Y H:i:s'),
        ]);

        $filename = 'pedido-compra-' . $purchaseOrder->po_number . '.pdf';

        return $pdf->download($filename);
    }

    public function createFromSuggestions(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'material_ids' => 'required|array|min:1',
            'material_ids.*' => 'exists:materials,id',
        ]);

        $suggestionService = app(PurchaseSuggestionService::class);
        $suggestions = $suggestionService->getSuggestions(['supplier_id' => $validated['supplier_id']]);

        $lineItems = [];
        foreach ($suggestions['suggestions'] as $s) {
            if (in_array($s['material_id'], $validated['material_ids'])) {
                $lineItems[] = [
                    'material_id' => $s['material_id'],
                    'material_name' => $s['material_name'],
                    'material_reference' => $s['material_reference'],
                    'quantity' => $s['suggested_quantity'],
                    'unit_price' => $s['purchase_price'],
                    'unit' => $s['unit'],
                    'total_price' => $s['estimated_cost'],
                ];
            }
        }

        if (empty($lineItems)) {
            return back()->withErrors(['create' => 'Nenhum material selecionado.']);
        }

        $supplier = Supplier::find($validated['supplier_id']);

        $purchaseOrder = $this->orderService->createPurchaseOrder([
            'supplier_id' => $validated['supplier_id'],
            'line_items' => $lineItems,
            'payment_terms' => $supplier->payment_terms,
            'notes' => 'Gerado a partir de sugestões de compra',
            'priority' => PurchaseOrder::PRIORITY_NORMAL,
            'created_by' => auth()->id(),
        ]);

        return redirect()
            ->route('admin.purchase-orders.show', $purchaseOrder)
            ->with('success', 'Pedido de compra criado a partir das sugestões!');
    }
}
