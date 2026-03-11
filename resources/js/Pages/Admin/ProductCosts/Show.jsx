import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ product, costData, categoryBreakdown, sizes, colors, selectedSize, selectedColor }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const exportPdf = () => {
        window.location.href = `/admin/product-costs/${product.id}/export-pdf`;
    };

    const getMarginColor = (margin) => {
        if (margin < 20) return 'text-red-600';
        if (margin < 30) return 'text-yellow-600';
        if (margin < 50) return 'text-green-600';
        return 'text-emerald-600';
    };

    const getCategoryColors = () => {
        return ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Custo - ${product.name}`} />

            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                            <p className="text-gray-600 mt-1">Análise detalhada de custo de produção</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/admin/product-costs" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                Voltar
                            </Link>
                            <button onClick={exportPdf} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Exportar PDF
                            </button>
                        </div>
                    </div>

                    {costData.success ? (
                        <>
                            {/* Cost Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                                <div className="bg-white p-4 rounded-lg shadow text-center">
                                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(costData.selling_price)}</div>
                                    <div className="text-sm text-gray-500">Preço de Venda</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow text-center">
                                    <div className="text-2xl font-bold text-red-600">{formatCurrency(costData.material_cost)}</div>
                                    <div className="text-sm text-gray-500">Custo Materiais</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow text-center">
                                    <div className="text-2xl font-bold text-green-600">{formatCurrency(costData.gross_profit)}</div>
                                    <div className="text-sm text-gray-500">Lucro Bruto</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow text-center">
                                    <div className={`text-2xl font-bold ${getMarginColor(costData.gross_margin_percent)}`}>
                                        {costData.gross_margin_percent.toFixed(1)}%
                                    </div>
                                    <div className="text-sm text-gray-500">Margem Bruta</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow text-center">
                                    <div className="text-2xl font-bold text-gray-700">{costData.markup_percent.toFixed(1)}%</div>
                                    <div className="text-sm text-gray-500">Markup</div>
                                </div>
                            </div>

                            {/* Cost Breakdown by Category */}
                            {categoryBreakdown.success && categoryBreakdown.categories?.length > 0 && (
                                <div className="bg-white rounded-lg shadow p-6 mb-6">
                                    <h2 className="text-lg font-medium mb-4">Distribuição por Categoria</h2>
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        {categoryBreakdown.categories.map((cat, index) => (
                                            <div key={cat.category} className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: getCategoryColors()[index % 8] }}
                                                />
                                                <span className="text-sm">
                                                    {cat.category}: {formatCurrency(cat.total_cost)} ({cat.percentage}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden flex">
                                        {categoryBreakdown.categories.map((cat, index) => (
                                            <div
                                                key={cat.category}
                                                className="h-full flex items-center justify-center text-white text-xs font-medium"
                                                style={{
                                                    width: `${cat.percentage}%`,
                                                    backgroundColor: getCategoryColors()[index % 8],
                                                    minWidth: cat.percentage > 5 ? 'auto' : '0',
                                                }}
                                            >
                                                {cat.percentage > 10 && `${cat.percentage}%`}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Materials Table */}
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-medium">Materiais ({costData.materials_count} itens)</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Referência</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Material</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Categoria</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Quantidade</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Unidade</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Custo Unit.</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Custo Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {costData.materials.map((material, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{material.material_reference || '-'}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{material.material_name}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{material.category}</td>
                                                    <td className="px-4 py-3 text-sm text-right">{material.quantity.toFixed(3)}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{material.unit}</td>
                                                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(material.unit_cost)}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(material.total_cost)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-50">
                                                <td colSpan="6" className="px-4 py-3 text-right font-bold">Total:</td>
                                                <td className="px-4 py-3 text-right font-bold text-lg">{formatCurrency(costData.material_cost)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Profit Analysis */}
                            <div className="mt-6 bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium mb-4">Análise de Lucratividade</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Composição do Preço</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Custo de Materiais:</span>
                                                <span className="font-medium">{costData.cost_percent_of_price}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Margem Bruta:</span>
                                                <span className="font-medium text-green-600">{costData.gross_margin_percent.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 w-full bg-gray-200 rounded-full h-4 overflow-hidden flex">
                                            <div
                                                className="h-full bg-red-500"
                                                style={{ width: `${costData.cost_percent_of_price}%` }}
                                            />
                                            <div
                                                className="h-full bg-green-500"
                                                style={{ width: `${costData.gross_margin_percent}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-red-600">Custo</span>
                                            <span className="text-green-600">Lucro</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Indicadores</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Markup sobre custo:</span>
                                                <span className="font-medium">{costData.markup_percent.toFixed(1)}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Lucro por unidade:</span>
                                                <span className="font-medium text-green-600">{formatCurrency(costData.gross_profit)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Materiais utilizados:</span>
                                                <span className="font-medium">{costData.materials_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                            <p className="text-red-600 font-medium">{costData.error || 'Erro ao calcular custo'}</p>
                            <p className="text-sm text-red-500 mt-2">Este produto não possui BOM cadastrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
