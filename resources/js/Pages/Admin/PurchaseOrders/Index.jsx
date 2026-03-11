import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ purchaseOrders, suppliers, summary, statuses, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [supplierId, setSupplierId] = useState(filters.supplier_id || '');

    const applyFilters = () => {
        router.get('/admin/purchase-orders', {
            search,
            status,
            supplier_id: supplierId,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setSupplierId('');
        router.get('/admin/purchase-orders');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const getStatusBadge = (status) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-800',
            sent: 'bg-blue-100 text-blue-800',
            acknowledged: 'bg-yellow-100 text-yellow-800',
            partially_received: 'bg-orange-100 text-orange-800',
            received: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status] || styles.draft}`}>
                {statuses[status] || status}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        if (!priority || priority === 'normal') return null;
        const styles = {
            low: 'bg-gray-100 text-gray-600',
            high: 'bg-orange-100 text-orange-700',
            urgent: 'bg-red-100 text-red-700',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded ml-1 ${styles[priority]}`}>
                {priority.toUpperCase()}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pedidos de Compra" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pedidos de Compra</h1>
                            <p className="text-gray-600 mt-1">Gerenciar pedidos para fornecedores</p>
                        </div>
                        <Link
                            href="/admin/purchase-orders/create"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Novo Pedido
                        </Link>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-gray-600">{summary.draft}</div>
                            <div className="text-sm text-gray-500">Rascunhos</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-blue-600">{summary.total_active}</div>
                            <div className="text-sm text-gray-500">Ativos</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-red-600">{summary.overdue}</div>
                            <div className="text-sm text-gray-500">Atrasados</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-green-600">{summary.received}</div>
                            <div className="text-sm text-gray-500">Recebidos</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Número do pedido..."
                                    className="w-full border-gray-300 rounded-lg shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm"
                                >
                                    <option value="">Todos</option>
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                                <select
                                    value={supplierId}
                                    onChange={(e) => setSupplierId(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm"
                                >
                                    <option value="">Todos</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end gap-2">
                                <button onClick={applyFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Filtrar
                                </button>
                                <button onClick={clearFilters} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                    Limpar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Pedido</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Fornecedor</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Data</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Entrega</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {purchaseOrders.data.map(po => (
                                        <tr key={po.id} className={po.status === 'draft' ? 'bg-gray-50' : ''}>
                                            <td className="px-4 py-3">
                                                <Link href={`/admin/purchase-orders/${po.id}`} className="text-blue-600 hover:underline font-medium">
                                                    {po.po_number}
                                                </Link>
                                                {getPriorityBadge(po.priority)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{po.supplier?.name || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(po.order_date || po.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(po.total_amount)}</td>
                                            <td className="px-4 py-3 text-center">{getStatusBadge(po.status)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={`/admin/purchase-orders/${po.id}`}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        Ver
                                                    </Link>
                                                    {po.status === 'draft' && (
                                                        <Link
                                                            href={`/admin/purchase-orders/${po.id}/edit`}
                                                            className="text-gray-600 hover:text-gray-800 text-sm"
                                                        >
                                                            Editar
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {purchaseOrders.data.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                                Nenhum pedido de compra encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {purchaseOrders.last_page > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    {purchaseOrders.from} - {purchaseOrders.to} de {purchaseOrders.total}
                                </div>
                                <div className="flex gap-1">
                                    {purchaseOrders.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1 text-sm rounded ${
                                                link.active ? 'bg-blue-600 text-white' : link.url ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-50 text-gray-400'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
