import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function StockMovements({ transactions, summaryStats, dailyMovements, movementsByType, materials, filters }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [materialId, setMaterialId] = useState(filters.material_id || '');
    const [type, setType] = useState(filters.type || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.reports.stock-movements'), {
            date_from: dateFrom,
            date_to: dateTo,
            material_id: materialId,
            type,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setMaterialId('');
        setType('');
        router.get(route('admin.reports.stock-movements'));
    };

    const formatQuantity = (quantity, unit) => {
        return Number(Math.abs(quantity)).toLocaleString('pt-BR', { minimumFractionDigits: 3 }) + ' ' + unit;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeLabel = (type) => {
        const types = {
            purchase: 'Compra',
            consumption: 'Consumo',
            adjustment: 'Ajuste',
            return: 'Devolução',
            transfer: 'Transferência'
        };
        return types[type] || type;
    };

    const getTypeColor = (type) => {
        const colors = {
            purchase: 'bg-green-100 text-green-800',
            consumption: 'bg-red-100 text-red-800',
            adjustment: 'bg-blue-100 text-blue-800',
            return: 'bg-yellow-100 text-yellow-800',
            transfer: 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getQuantityColor = (quantity) => {
        return quantity > 0 ? 'text-green-600' : 'text-red-600';
    };

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
                        <h2 className="text-xl font-semibold text-gray-900 mt-2">Movimentações de Estoque</h2>
                        <p className="mt-1 text-sm text-gray-600">Histórico detalhado de todas as movimentações</p>
                    </div>
                </div>
            }
        >
            <Head title="Movimentações de Estoque" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📊</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total de Transações</dt>
                                            <dd className="text-lg font-medium text-gray-900">{summaryStats.total_transactions}</dd>
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
                                            <span className="text-white text-sm font-medium">↗️</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Entradas</dt>
                                            <dd className="text-lg font-medium text-gray-900">{Number(summaryStats.total_positive_movements).toLocaleString('pt-BR')}</dd>
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
                                            <span className="text-white text-sm font-medium">↘️</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Saídas</dt>
                                            <dd className="text-lg font-medium text-gray-900">{Number(summaryStats.total_negative_movements).toLocaleString('pt-BR')}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-purple-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">⚖️</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Saldo Líquido</dt>
                                            <dd className={`text-lg font-medium ${summaryStats.net_movement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {Number(summaryStats.net_movement).toLocaleString('pt-BR')}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Movement Types Chart */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Movimentações por Tipo</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {movementsByType.map((movement) => (
                                    <div key={movement.type} className="text-center p-4 rounded-lg border">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getTypeColor(movement.type)}`}>
                                            {getTypeLabel(movement.type)}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{movement.count}</div>
                                        <div className="text-sm text-gray-500">
                                            {Number(movement.total_quantity).toLocaleString('pt-BR')} unidades
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            Média: {Number(movement.avg_quantity).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleFilter} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                    <select
                                        value={materialId}
                                        onChange={(e) => setMaterialId(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todos os materiais</option>
                                        {materials.map(material => (
                                            <option key={material.id} value={material.id}>
                                                {material.name} ({material.reference})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todos os tipos</option>
                                        <option value="purchase">Compra</option>
                                        <option value="consumption">Consumo</option>
                                        <option value="adjustment">Ajuste</option>
                                        <option value="return">Devolução</option>
                                        <option value="transfer">Transferência</option>
                                    </select>
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
                        </form>
                    </div>

                    {/* Transactions List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {transactions.data.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data/Hora
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Material
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantidade
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuário
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Observações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.data.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(transaction.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {transaction.material?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Ref: {transaction.material?.reference}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                                    {getTypeLabel(transaction.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${getQuantityColor(transaction.quantity)}`}>
                                                    {transaction.quantity > 0 ? '+' : ''}{formatQuantity(transaction.quantity, transaction.material?.unit || '')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {transaction.user?.name || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                                    {transaction.notes || '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <span className="text-gray-400 text-6xl">📋</span>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma movimentação encontrada</h3>
                                <p className="mt-2 text-gray-500">Não há registros de movimentação para os filtros selecionados.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {transactions.links && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {transactions.from} a {transactions.to} de {transactions.total} resultados
                                    </div>
                                    <div className="flex space-x-1">
                                        {transactions.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } border border-gray-300 rounded`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}