import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function InventoryStatus({ inventoryStatus, stockMovements, topMaterialsByActivity, stockValueBySupplier, filters }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.reports.inventory-status'), {
            date_from: dateFrom,
            date_to: dateTo,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.reports.inventory-status'));
    };

    const formatCurrency = (value) => {
        return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    const formatNumber = (value) => {
        return Number(value).toLocaleString('pt-BR');
    };

    const getHealthPercentage = () => {
        const total = inventoryStatus.total_materials;
        if (total === 0) return 0;
        return Math.round((inventoryStatus.active_materials / total) * 100);
    };

    const getHealthColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        if (percentage >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getHealthBadge = (percentage) => {
        if (percentage >= 80) return 'bg-green-100 text-green-800 border border-green-200';
        if (percentage >= 60) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        if (percentage >= 40) return 'bg-orange-100 text-orange-800 border border-orange-200';
        return 'bg-red-100 text-red-800 border border-red-200';
    };

    const getHealthLabel = (percentage) => {
        if (percentage >= 80) return 'Excelente';
        if (percentage >= 60) return 'Bom';
        if (percentage >= 40) return 'Regular';
        return 'Crítico';
    };

    const getMovementTypeLabel = (type) => {
        const types = {
            purchase: 'Compras',
            consumption: 'Consumo',
            adjustment: 'Ajustes',
            return: 'Devoluções',
            transfer: 'Transferências'
        };
        return types[type] || type;
    };

    const getMovementTypeColor = (type) => {
        const colors = {
            purchase: 'bg-green-500',
            consumption: 'bg-red-500',
            adjustment: 'bg-blue-500',
            return: 'bg-yellow-500',
            transfer: 'bg-purple-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    const healthPercentage = getHealthPercentage();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('admin.reports.index')}
                                className="text-purple-600 hover:text-purple-800"
                            >
                                ← Voltar aos Relatórios
                            </Link>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mt-2">Status do Inventário</h2>
                        <p className="mt-1 text-sm text-gray-600">Visão geral do estado atual do estoque</p>
                    </div>
                </div>
            }
        >
            <Head title="Status do Inventário" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Inventory Health Score */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">🏥 Saúde do Inventário</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center">
                                <div className="text-center">
                                    <div className={`text-6xl font-bold ${getHealthColor(healthPercentage)}`}>
                                        {healthPercentage}%
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getHealthBadge(healthPercentage)}`}>
                                        {getHealthLabel(healthPercentage)}
                                    </span>
                                    <p className="text-gray-600 mt-2">
                                        {inventoryStatus.active_materials} de {inventoryStatus.total_materials} materiais com estoque adequado
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📦</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total de Materiais</dt>
                                            <dd className="text-lg font-medium text-gray-900">{formatNumber(inventoryStatus.total_materials)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-green-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">✅</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Estoque Adequado</dt>
                                            <dd className="text-lg font-medium text-gray-900">{formatNumber(inventoryStatus.active_materials)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-yellow-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">⚠️</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Estoque Baixo</dt>
                                            <dd className="text-lg font-medium text-gray-900">{formatNumber(inventoryStatus.low_stock_materials)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-red-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">🚨</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Sem Estoque</dt>
                                            <dd className="text-lg font-medium text-gray-900">{formatNumber(inventoryStatus.out_of_stock_materials)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock Value */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">💰 Valor Total do Estoque</h3>
                        </div>
                        <div className="p-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-green-600">
                                    {formatCurrency(inventoryStatus.total_stock_value)}
                                </div>
                                <p className="text-gray-600 mt-2">Valor total baseado no preço de compra dos materiais</p>
                            </div>
                        </div>
                    </div>

                    {/* Top Materials by Activity */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">🔥 Materiais Mais Movimentados</h3>
                        </div>
                        <div className="p-6">
                            {topMaterialsByActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {topMaterialsByActivity.map((material, index) => (
                                        <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                                    <div className="text-sm text-gray-500">Ref: {material.reference}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {material.transaction_count} transações
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Estoque: {formatNumber(material.current_stock)} {material.unit}
                                                    </div>
                                                </div>
                                                <Link
                                                    href={route('admin.materials.show', material.id)}
                                                    className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                                                >
                                                    Ver
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-gray-400 text-4xl">📊</span>
                                    <p className="text-gray-500 mt-2">Nenhuma movimentação encontrada no período</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stock Value by Supplier */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">🏢 Valor do Estoque por Fornecedor</h3>
                        </div>
                        <div className="p-6">
                            {stockValueBySupplier.length > 0 ? (
                                <div className="space-y-4">
                                    {stockValueBySupplier.map((supplier) => (
                                        <div key={supplier.name} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {supplier.material_count} materiais
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-medium text-gray-900">
                                                    {formatCurrency(supplier.stock_value)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {Math.round((supplier.stock_value / inventoryStatus.total_stock_value) * 100)}% do total
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-gray-400 text-4xl">🏢</span>
                                    <p className="text-gray-500 mt-2">Nenhum fornecedor com estoque encontrado</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleFilter} className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Período</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="flex items-end space-x-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Filtrar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                Os filtros de período afetam apenas os "Materiais Mais Movimentados"
                            </p>
                        </form>
                    </div>

                    {/* Stock Movements Trend */}
                    {stockMovements.length > 0 && (
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">📈 Tendência de Movimentações</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {stockMovements.map((movement) => (
                                        <div key={`${movement.date}-${movement.type}`} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${getMovementTypeColor(movement.type)}`}></div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {movement.date} - {getMovementTypeLabel(movement.type)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {movement.transaction_count} transações
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatNumber(movement.total_quantity)} unidades
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