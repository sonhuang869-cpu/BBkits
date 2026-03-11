import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ suppliers, materials, prefilledItems, prefilledSupplierId, priorities }) {
    const [lineItems, setLineItems] = useState(prefilledItems || []);
    const [selectedMaterial, setSelectedMaterial] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: prefilledSupplierId || '',
        expected_delivery_date: '',
        payment_terms: '',
        notes: '',
        delivery_address: '',
        priority: 'normal',
        line_items: prefilledItems || [],
    });

    const addLineItem = () => {
        if (!selectedMaterial) return;

        const material = materials.find(m => m.id === parseInt(selectedMaterial));
        if (!material) return;

        const existing = lineItems.find(li => li.material_id === material.id);
        if (existing) {
            alert('Este material já foi adicionado.');
            return;
        }

        const newItem = {
            material_id: material.id,
            material_name: material.name,
            material_reference: material.reference,
            quantity: 1,
            unit_price: material.purchase_price || 0,
            unit: material.unit,
        };

        const updated = [...lineItems, newItem];
        setLineItems(updated);
        setData('line_items', updated);
        setSelectedMaterial('');
    };

    const updateLineItem = (index, field, value) => {
        const updated = [...lineItems];
        updated[index][field] = value;
        setLineItems(updated);
        setData('line_items', updated);
    };

    const removeLineItem = (index) => {
        const updated = lineItems.filter((_, i) => i !== index);
        setLineItems(updated);
        setData('line_items', updated);
    };

    const calculateTotal = () => {
        return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/purchase-orders');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const filteredMaterials = data.supplier_id
        ? materials.filter(m => m.supplier_id === parseInt(data.supplier_id) || !m.supplier_id)
        : materials;

    return (
        <AuthenticatedLayout>
            <Head title="Novo Pedido de Compra" />

            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Novo Pedido de Compra</h1>
                            <p className="text-gray-600 mt-1">Criar pedido para fornecedor</p>
                        </div>
                        <a href="/admin/purchase-orders" className="text-gray-600 hover:text-gray-800">
                            Voltar
                        </a>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-lg font-medium mb-4">Informações do Pedido</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor *</label>
                                    <select
                                        value={data.supplier_id}
                                        onChange={(e) => setData('supplier_id', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm"
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && <p className="text-red-500 text-sm mt-1">{errors.supplier_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega Prevista</label>
                                    <input
                                        type="date"
                                        value={data.expected_delivery_date}
                                        onChange={(e) => setData('expected_delivery_date', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Condições de Pagamento</label>
                                    <input
                                        type="text"
                                        value={data.payment_terms}
                                        onChange={(e) => setData('payment_terms', e.target.value)}
                                        placeholder="Ex: 30 dias"
                                        className="w-full border-gray-300 rounded-lg shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                                    <select
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm"
                                    >
                                        {Object.entries(priorities).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                                    <input
                                        type="text"
                                        value={data.delivery_address}
                                        onChange={(e) => setData('delivery_address', e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows="2"
                                        className="w-full border-gray-300 rounded-lg shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-lg font-medium mb-4">Itens do Pedido</h2>

                            {/* Add Item */}
                            <div className="flex gap-2 mb-4">
                                <select
                                    value={selectedMaterial}
                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                    className="flex-1 border-gray-300 rounded-lg shadow-sm"
                                >
                                    <option value="">Selecione um material...</option>
                                    {filteredMaterials.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.reference} - {m.name} ({m.unit})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={addLineItem}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Adicionar
                                </button>
                            </div>

                            {/* Items Table */}
                            {lineItems.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Material</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Unidade</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Quantidade</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Preço Unit.</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {lineItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2">
                                                    <div className="text-sm font-medium">{item.material_name}</div>
                                                    <div className="text-xs text-gray-500">{item.material_reference}</div>
                                                </td>
                                                <td className="px-4 py-2 text-center text-sm">{item.unit}</td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={item.quantity}
                                                        onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        className="w-24 text-center border-gray-300 rounded shadow-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                        className="w-28 text-center border-gray-300 rounded shadow-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right font-medium">
                                                    {formatCurrency(item.quantity * item.unit_price)}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLineItem(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Remover
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50">
                                            <td colSpan="4" className="px-4 py-3 text-right font-bold">Total:</td>
                                            <td className="px-4 py-3 text-right font-bold text-lg">{formatCurrency(calculateTotal())}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhum item adicionado. Selecione materiais acima.
                                </div>
                            )}
                            {errors.line_items && <p className="text-red-500 text-sm mt-2">{errors.line_items}</p>}
                        </div>

                        <div className="flex justify-end gap-4">
                            <a
                                href="/admin/purchase-orders"
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Cancelar
                            </a>
                            <button
                                type="submit"
                                disabled={processing || lineItems.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Salvando...' : 'Criar Pedido'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
