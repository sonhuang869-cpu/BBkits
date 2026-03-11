import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ eligibleOrders, filters }) {
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [status, setStatus] = useState(filters.status || '');
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleOrder = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const selectAll = () => {
        if (selectedOrders.length === eligibleOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(eligibleOrders.map(o => o.id));
        }
    };

    const applyFilters = () => {
        router.get('/admin/cutting-list', {
            date_from: dateFrom,
            date_to: dateTo,
            status: status,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setStatus('');
        router.get('/admin/cutting-list');
    };

    const previewCuttingList = async () => {
        if (selectedOrders.length === 0) {
            alert('Selecione pelo menos um pedido.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/admin/cutting-list/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ sale_ids: selectedOrders }),
            });
            const data = await response.json();
            setPreviewData(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao gerar preview.');
        } finally {
            setLoading(false);
        }
    };

    const exportPdf = () => {
        if (selectedOrders.length === 0) {
            alert('Selecione pelo menos um pedido.');
            return;
        }

        // Create form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/admin/cutting-list/export-pdf';

        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = document.querySelector('meta[name="csrf-token"]').content;
        form.appendChild(csrfInput);

        selectedOrders.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'sale_ids[]';
            input.value = id;
            form.appendChild(input);
        });

        const groupInput = document.createElement('input');
        groupInput.type = 'hidden';
        groupInput.name = 'group_by_category';
        groupInput.value = '1';
        form.appendChild(groupInput);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const getStatusBadge = (status) => {
        const badges = {
            payment_approved: { text: 'Pagamento Aprovado', color: 'bg-green-100 text-green-800' },
            in_production: { text: 'Em Produção', color: 'bg-blue-100 text-blue-800' },
        };
        return badges[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    };

    const formatCurrency = (value) => {
        return 'R$ ' + Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Lista de Corte</h2>
                        <p className="mt-1 text-sm text-gray-600">Gere listas de corte agrupando materiais de múltiplos pedidos</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={previewCuttingList}
                            disabled={selectedOrders.length === 0 || loading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            {loading ? 'Gerando...' : 'Preview'}
                        </button>
                        <button
                            onClick={exportPdf}
                            disabled={selectedOrders.length === 0}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Exportar PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Lista de Corte" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg mb-6 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Todos</option>
                                    <option value="payment_approved">Pagamento Aprovado</option>
                                    <option value="in_production">Em Produção</option>
                                </select>
                            </div>
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Filtrar
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Limpar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Selected Count */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-purple-800 font-medium">
                                {selectedOrders.length} pedido(s) selecionado(s)
                            </span>
                            <button
                                onClick={selectAll}
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                            >
                                {selectedOrders.length === eligibleOrders.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                            </button>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.length === eligibleOrders.length && eligibleOrders.length > 0}
                                            onChange={selectAll}
                                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produtos</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {eligibleOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            Nenhum pedido elegível encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    eligibleOrders.map((order) => {
                                        const badge = getStatusBadge(order.order_status);
                                        return (
                                            <tr key={order.id} className={selectedOrders.includes(order.id) ? 'bg-purple-50' : 'hover:bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOrders.includes(order.id)}
                                                        onChange={() => toggleOrder(order.id)}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.client_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.created_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                                                        {badge.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {order.products.length > 0 ? (
                                                        <ul className="list-disc list-inside">
                                                            {order.products.slice(0, 2).map((p, i) => (
                                                                <li key={i}>{p.name} x{p.quantity}</li>
                                                            ))}
                                                            {order.products.length > 2 && (
                                                                <li className="text-gray-400">+{order.products.length - 2} mais</li>
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-gray-400">Sem produtos</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(order.total_amount)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Preview Modal */}
                    {previewData && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">Preview da Lista de Corte</h3>
                                    <button
                                        onClick={() => setPreviewData(null)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        X
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto max-h-[70vh]">
                                    {/* Summary */}
                                    <div className="grid grid-cols-4 gap-4 mb-6">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-sm text-blue-600">Pedidos</div>
                                            <div className="text-2xl font-bold text-blue-900">{previewData.summary?.total_orders || 0}</div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-sm text-green-600">Materiais</div>
                                            <div className="text-2xl font-bold text-green-900">{previewData.summary?.total_materials || 0}</div>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-sm text-purple-600">Produtos</div>
                                            <div className="text-2xl font-bold text-purple-900">{previewData.summary?.unique_products || 0}</div>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <div className="text-sm text-red-600">Estoque Insuficiente</div>
                                            <div className="text-2xl font-bold text-red-900">{previewData.summary?.materials_with_insufficient_stock || 0}</div>
                                        </div>
                                    </div>

                                    {/* Materials Table */}
                                    <h4 className="font-medium text-gray-900 mb-3">Materiais Necessários</h4>
                                    <table className="min-w-full divide-y divide-gray-200 mb-4">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qtd Necessária</th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Estoque Atual</th>
                                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {(previewData.materials || []).map((material, index) => (
                                                <tr key={index} className={material.total_quantity > material.current_stock ? 'bg-red-50' : ''}>
                                                    <td className="px-4 py-2 text-sm text-gray-900">{material.material_name}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">{material.material_category}</td>
                                                    <td className="px-4 py-2 text-sm text-right font-medium">{material.total_quantity.toFixed(3)} {material.unit}</td>
                                                    <td className="px-4 py-2 text-sm text-right">{material.current_stock.toFixed(3)} {material.unit}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        {material.total_quantity > material.current_stock ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                                Insuficiente
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                OK
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Warnings */}
                                    {previewData.warnings && previewData.warnings.length > 0 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <h4 className="font-medium text-yellow-800 mb-2">Avisos</h4>
                                            <ul className="list-disc list-inside text-sm text-yellow-700">
                                                {previewData.warnings.map((warning, i) => (
                                                    <li key={i}>{warning}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setPreviewData(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Fechar
                                    </button>
                                    <button
                                        onClick={exportPdf}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        Exportar PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
