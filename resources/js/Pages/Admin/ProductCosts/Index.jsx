import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ products, totals, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [marginStatus, setMarginStatus] = useState(filters.margin_status || '');

    const applyFilters = () => {
        router.get('/admin/product-costs', {
            search,
            margin_status: marginStatus,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setMarginStatus('');
        router.get('/admin/product-costs');
    };

    const exportPdf = () => {
        const params = new URLSearchParams();
        if (marginStatus) params.append('margin_status', marginStatus);
        window.location.href = `/admin/product-costs/export-pdf?${params.toString()}`;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const getMarginBadge = (status, margin) => {
        const styles = {
            critical: 'bg-red-100 text-red-700',
            low: 'bg-yellow-100 text-yellow-700',
            normal: 'bg-green-100 text-green-700',
            good: 'bg-emerald-100 text-emerald-700',
        };
        return (
            <span className={`px-2 py-1 text-xs font-bold rounded ${styles[status]}`}>
                {margin.toFixed(1)}%
            </span>
        );
    };

    const getMarginStatusLabel = (status) => {
        const labels = {
            critical: 'Crítico (<20%)',
            low: 'Baixo (20-30%)',
            normal: 'Normal (30-50%)',
            good: 'Bom (>50%)',
        };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Custos de Produtos" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Custos de Produtos</h1>
                            <p className="text-gray-600 mt-1">Análise de custo e margem de lucro</p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href="/admin/product-costs/compare"
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Comparar
                            </Link>
                            <button
                                onClick={exportPdf}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Exportar PDF
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-blue-600">{totals.total_products}</div>
                            <div className="text-sm text-gray-500">Produtos com BOM</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-gray-600">{formatCurrency(totals.avg_material_cost)}</div>
                            <div className="text-sm text-gray-500">Custo Médio</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-green-600">{totals.avg_margin.toFixed(1)}%</div>
                            <div className="text-sm text-gray-500">Margem Média</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-2xl font-bold text-red-600">{totals.low_margin_count}</div>
                            <div className="text-sm text-gray-500">Margem Baixa</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nome do produto..."
                                    className="w-full border-gray-300 rounded-lg shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status da Margem</label>
                                <select
                                    value={marginStatus}
                                    onChange={(e) => setMarginStatus(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg shadow-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="critical">Crítico (&lt;20%)</option>
                                    <option value="low">Baixo (20-30%)</option>
                                    <option value="normal">Normal (30-50%)</option>
                                    <option value="good">Bom (&gt;50%)</option>
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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Produto</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Preço Venda</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Custo Mat.</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Lucro Bruto</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Margem</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Markup</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Materiais</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map(product => (
                                        <tr key={product.product_id} className={product.margin_status === 'critical' ? 'bg-red-50' : product.margin_status === 'low' ? 'bg-yellow-50' : ''}>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                                                {product.product_sku !== '-' && (
                                                    <div className="text-xs text-gray-500">{product.product_sku}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(product.selling_price)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(product.material_cost)}</td>
                                            <td className="px-4 py-3 text-sm text-right font-medium text-green-600">{formatCurrency(product.gross_profit)}</td>
                                            <td className="px-4 py-3 text-center">{getMarginBadge(product.margin_status, product.gross_margin_percent)}</td>
                                            <td className="px-4 py-3 text-sm text-center">{product.markup_percent.toFixed(1)}%</td>
                                            <td className="px-4 py-3 text-sm text-center">{product.materials_count}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Link
                                                    href={`/admin/product-costs/${product.product_id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    Detalhes
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                                Nenhum produto com BOM encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
