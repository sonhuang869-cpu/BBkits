import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Compare({ availableProducts, comparison, selectedIds }) {
    const [selected, setSelected] = useState(selectedIds || []);

    const toggleProduct = (productId) => {
        setSelected(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const compare = () => {
        if (selected.length < 2) {
            alert('Selecione pelo menos 2 produtos para comparar.');
            return;
        }
        router.get('/admin/product-costs/compare', { product_ids: selected });
    };

    const clearSelection = () => {
        setSelected([]);
        router.get('/admin/product-costs/compare');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const getMarginColor = (margin) => {
        if (margin < 20) return 'text-red-600';
        if (margin < 30) return 'text-yellow-600';
        if (margin < 50) return 'text-green-600';
        return 'text-emerald-600';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Comparar Custos" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Comparar Custos</h1>
                            <p className="text-gray-600 mt-1">Compare custos e margens entre produtos</p>
                        </div>
                        <Link href="/admin/product-costs" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            Voltar
                        </Link>
                    </div>

                    {/* Product Selection */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Selecione os Produtos ({selected.length} selecionados)</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto mb-4">
                            {availableProducts.map(product => (
                                <label
                                    key={product.id}
                                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                                        selected.includes(product.id) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(product.id)}
                                        onChange={() => toggleProduct(product.id)}
                                        className="rounded border-gray-300 text-blue-600"
                                    />
                                    <span className="text-sm truncate">{product.name}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={compare}
                                disabled={selected.length < 2}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Comparar ({selected.length})
                            </button>
                            <button
                                onClick={clearSelection}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Limpar
                            </button>
                        </div>
                    </div>

                    {/* Comparison Results */}
                    {comparison && comparison.products?.length > 0 && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-medium">Resultado da Comparação ({comparison.count} produtos)</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Produto</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Preço Venda</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Custo Mat.</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Lucro Bruto</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Margem %</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Markup %</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Materiais</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {comparison.products.map(product => (
                                            <tr key={product.product_id}>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={`/admin/product-costs/${product.product_id}`}
                                                        className="text-blue-600 hover:underline font-medium"
                                                    >
                                                        {product.product_name}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right">{formatCurrency(product.selling_price)}</td>
                                                <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(product.material_cost)}</td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{formatCurrency(product.gross_profit)}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`font-bold ${getMarginColor(product.gross_margin_percent)}`}>
                                                        {product.gross_margin_percent.toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center">{product.markup_percent.toFixed(1)}%</td>
                                                <td className="px-4 py-3 text-sm text-center">{product.materials_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Visual Comparison */}
                            <div className="p-6 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700 mb-4">Comparação Visual - Margem Bruta</h3>
                                <div className="space-y-3">
                                    {comparison.products
                                        .sort((a, b) => b.gross_margin_percent - a.gross_margin_percent)
                                        .map(product => (
                                            <div key={product.product_id} className="flex items-center gap-3">
                                                <div className="w-32 text-sm truncate">{product.product_name}</div>
                                                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                                                    <div
                                                        className={`h-full flex items-center justify-end pr-2 text-white text-xs font-medium ${
                                                            product.gross_margin_percent < 20 ? 'bg-red-500' :
                                                            product.gross_margin_percent < 30 ? 'bg-yellow-500' :
                                                            product.gross_margin_percent < 50 ? 'bg-green-500' : 'bg-emerald-500'
                                                        }`}
                                                        style={{ width: `${Math.min(product.gross_margin_percent, 100)}%` }}
                                                    >
                                                        {product.gross_margin_percent.toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
