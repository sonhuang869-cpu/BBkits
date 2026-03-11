import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ suggestions, bySupplier, summary, suppliers, categories, filters, groupBySupplier }) {
    const [supplierId, setSupplierId] = useState(filters.supplier_id || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [grouped, setGrouped] = useState(groupBySupplier);
    const [expandedSuppliers, setExpandedSuppliers] = useState({});

    const applyFilters = () => {
        router.get('/admin/purchase-suggestions', {
            supplier_id: supplierId,
            category_id: categoryId,
            group_by_supplier: grouped ? '1' : '0',
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSupplierId('');
        setCategoryId('');
        router.get('/admin/purchase-suggestions');
    };

    const toggleSupplier = (supplierId) => {
        setExpandedSuppliers(prev => ({
            ...prev,
            [supplierId]: !prev[supplierId]
        }));
    };

    const exportPdf = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/admin/purchase-suggestions/export-pdf';

        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = document.querySelector('meta[name="csrf-token"]').content;
        form.appendChild(csrfInput);

        if (supplierId) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'supplier_id';
            input.value = supplierId;
            form.appendChild(input);
        }

        if (categoryId) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'category_id';
            input.value = categoryId;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const getPriorityBadge = (priority) => {
        if (priority === 'critical') {
            return <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded">CRÍTICO</span>;
        }
        return <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded">BAIXO</span>;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sugestões de Compra" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Sugestões de Compra</h1>
                            <p className="text-gray-600 mt-1">Materiais abaixo do ponto de reposição</p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href="/admin/purchase-suggestions/reorder-config"
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Configurar Pontos
                            </a>
                            <button
                                onClick={exportPdf}
                                disabled={summary.total_items === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Exportar PDF
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-blue-600">{summary.total_items}</div>
                            <div className="text-sm text-gray-600">Itens a Comprar</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-red-600">{summary.critical_items}</div>
                            <div className="text-sm text-gray-600">Críticos</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-yellow-600">{summary.low_items}</div>
                            <div className="text-sm text-gray-600">Baixos</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-gray-600">{summary.suppliers_involved}</div>
                            <div className="text-sm text-gray-600">Fornecedores</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.total_estimated_cost)}</div>
                            <div className="text-sm text-gray-600">Custo Estimado</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm"
                                >
                                    <option value="">Todas</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={grouped}
                                        onChange={(e) => setGrouped(e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700">Agrupar por fornecedor</span>
                                </label>
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Filtrar
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Limpar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {summary.total_items === 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                            <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-green-800">Estoque OK!</h3>
                            <p className="text-green-600 mt-1">Todos os materiais estão acima do ponto de reposição.</p>
                        </div>
                    ) : grouped && bySupplier ? (
                        <div className="space-y-4">
                            {bySupplier.map(supplier => (
                                <div key={supplier.supplier_id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <button
                                        onClick={() => toggleSupplier(supplier.supplier_id)}
                                        className="w-full px-4 py-3 bg-blue-600 text-white flex justify-between items-center hover:bg-blue-700"
                                    >
                                        <span className="font-bold">{supplier.supplier_name}</span>
                                        <span className="text-sm">
                                            {supplier.total_items} itens | {formatCurrency(supplier.total_cost)}
                                            <span className="ml-2">{expandedSuppliers[supplier.supplier_id] ? '▲' : '▼'}</span>
                                        </span>
                                    </button>
                                    {(expandedSuppliers[supplier.supplier_id] !== false) && (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ref</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Material</th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Un</th>
                                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Estoque</th>
                                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Mínimo</th>
                                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Sugerido</th>
                                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Preço</th>
                                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Prioridade</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {supplier.materials.map(m => (
                                                        <tr key={m.material_id} className={m.priority === 'critical' ? 'bg-red-50' : ''}>
                                                            <td className="px-4 py-2 text-sm text-gray-500">{m.material_reference}</td>
                                                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{m.material_name}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500 text-center">{m.unit}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500 text-right">{formatNumber(m.available_stock)}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500 text-right">{formatNumber(m.minimum_stock)}</td>
                                                            <td className="px-4 py-2 text-sm font-bold text-blue-600 text-right">{formatNumber(m.suggested_quantity)}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500 text-right">{formatCurrency(m.purchase_price)}</td>
                                                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(m.estimated_cost)}</td>
                                                            <td className="px-4 py-2 text-center">{getPriorityBadge(m.priority)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Ref</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Material</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Fornecedor</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Un</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Estoque</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Mínimo</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Sugerido</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Preço</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Prioridade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {suggestions.map(m => (
                                        <tr key={m.material_id} className={m.priority === 'critical' ? 'bg-red-50' : ''}>
                                            <td className="px-4 py-2 text-sm text-gray-500">{m.material_reference}</td>
                                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{m.material_name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{m.supplier_name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 text-center">{m.unit}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 text-right">{formatNumber(m.available_stock)}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 text-right">{formatNumber(m.minimum_stock)}</td>
                                            <td className="px-4 py-2 text-sm font-bold text-blue-600 text-right">{formatNumber(m.suggested_quantity)}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 text-right">{formatCurrency(m.purchase_price)}</td>
                                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(m.estimated_cost)}</td>
                                            <td className="px-4 py-2 text-center">{getPriorityBadge(m.priority)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
