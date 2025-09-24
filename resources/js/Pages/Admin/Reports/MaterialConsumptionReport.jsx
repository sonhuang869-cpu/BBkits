import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    TrendingDown,
    Package,
    Users,
    DollarSign,
    Calendar,
    BarChart3,
    Download,
    Filter,
    RotateCcw,
    Activity
} from 'lucide-react';

export default function MaterialConsumptionReport({
    overallStats,
    topMaterialsByQuantity,
    topMaterialsByValue,
    consumptionTrends,
    consumptionByUser,
    averageConsumptionRates,
    costAnalysis,
    recentTransactions,
    materials,
    users,
    filters
}) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [materialId, setMaterialId] = useState(filters.material_id || '');
    const [userId, setUserId] = useState(filters.user_id || '');
    const [groupBy, setGroupBy] = useState(filters.group_by || 'day');
    const [showFilters, setShowFilters] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const applyFilters = () => {
        router.get(route('admin.reports.material-consumption'), {
            date_from: dateFrom,
            date_to: dateTo,
            material_id: materialId,
            user_id: userId,
            group_by: groupBy
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setMaterialId('');
        setUserId('');
        setGroupBy('day');
        router.get(route('admin.reports.material-consumption'));
    };

    const formatCurrency = (value) => {
        return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    const formatQuantity = (quantity, unit = '') => {
        return Number(quantity).toLocaleString('pt-BR', {
            minimumFractionDigits: 3
        }) + (unit ? ' ' + unit : '');
    };

    const formatPercentage = (value) => {
        return (value * 100).toFixed(1) + '%';
    };

    const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Relatório de Consumo de Materiais
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Análise detalhada do consumo de materiais por período
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </button>
                        <button
                            onClick={applyFilters}
                            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Atualizar
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Relatório de Consumo de Materiais" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Data Inicial
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Data Final
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Material
                                    </label>
                                    <select
                                        value={materialId}
                                        onChange={(e) => setMaterialId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Todos os Materiais</option>
                                        {materials.map(material => (
                                            <option key={material.id} value={material.id}>
                                                {material.reference} - {material.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Usuário
                                    </label>
                                    <select
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Todos os Usuários</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Agrupamento
                                    </label>
                                    <select
                                        value={groupBy}
                                        onChange={(e) => setGroupBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="day">Por Dia</option>
                                        <option value="week">Por Semana</option>
                                        <option value="month">Por Mês</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Limpar
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Overall Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Consumido (Quantidade)"
                            value={formatQuantity(overallStats.total_quantity_consumed)}
                            subtitle={`${overallStats.total_transactions} transações`}
                            icon={Package}
                            color="blue"
                        />
                        <StatCard
                            title="Valor Total Consumido"
                            value={formatCurrency(overallStats.total_value_consumed)}
                            subtitle={`Média diária: ${formatCurrency(overallStats.daily_average_value)}`}
                            icon={DollarSign}
                            color="green"
                        />
                        <StatCard
                            title="Materiais Únicos"
                            value={overallStats.unique_materials_consumed}
                            subtitle={`${overallStats.unique_users} usuários diferentes`}
                            icon={TrendingDown}
                            color="purple"
                        />
                        <StatCard
                            title="Média por Transação"
                            value={formatQuantity(overallStats.average_transaction_quantity)}
                            subtitle={`${overallStats.days_in_period} dias no período`}
                            icon={Activity}
                            color="orange"
                        />
                    </div>

                    {/* Tabs Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-6">
                                {[
                                    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
                                    { id: 'materials', name: 'Por Material', icon: Package },
                                    { id: 'users', name: 'Por Usuário', icon: Users },
                                    { id: 'trends', name: 'Tendências', icon: TrendingDown },
                                    { id: 'recent', name: 'Transações Recentes', icon: Calendar },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                            ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <tab.icon className="w-4 h-4 mr-2" />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Top Materials by Quantity */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Materiais Mais Consumidos (Quantidade)
                                            </h3>
                                            <div className="space-y-3">
                                                {topMaterialsByQuantity.slice(0, 5).map((material, index) => (
                                                    <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center">
                                                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                                                {index + 1}
                                                            </span>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{material.reference}</p>
                                                                <p className="text-sm text-gray-600">{material.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-gray-900">
                                                                {formatQuantity(material.total_consumed, material.unit)}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {formatCurrency(material.total_value)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Top Materials by Value */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Materiais Mais Consumidos (Valor)
                                            </h3>
                                            <div className="space-y-3">
                                                {topMaterialsByValue.slice(0, 5).map((material, index) => (
                                                    <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center">
                                                            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                                                {index + 1}
                                                            </span>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{material.reference}</p>
                                                                <p className="text-sm text-gray-600">{material.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-gray-900">
                                                                {formatCurrency(material.total_value)}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {formatQuantity(material.total_consumed, material.unit)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cost Analysis */}
                                    {costAnalysis.cost_by_category?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Consumo por Categoria
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {costAnalysis.cost_by_category.map((category) => (
                                                    <div key={category.category_name || 'Sem Categoria'} className="bg-white border rounded-lg p-4">
                                                        <h4 className="font-medium text-gray-900">{category.category_name || 'Sem Categoria'}</h4>
                                                        <p className="text-2xl font-bold text-blue-600 mt-2">
                                                            {formatCurrency(category.total_cost)}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {category.material_count} materiais • {formatQuantity(category.total_quantity)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Materials Tab */}
                            {activeTab === 'materials' && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Análise Detalhada por Material
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Material
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Consumo Total
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Média Diária
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Frequência
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Transações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {averageConsumptionRates.map((material) => (
                                                    <tr key={material.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {material.reference}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {material.name}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatQuantity(material.total_consumed, material.unit)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatQuantity(material.daily_average, material.unit)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatPercentage(material.consumption_frequency)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {material.transaction_count}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Consumo por Usuário
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {consumptionByUser.map((user) => (
                                            <div key={user.id} className="bg-white border rounded-lg p-4">
                                                <div className="flex items-center mb-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                        <Users className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Valor Total:</span>
                                                        <span className="text-sm font-medium">{formatCurrency(user.total_value)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Transações:</span>
                                                        <span className="text-sm font-medium">{user.transaction_count}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Materiais Únicos:</span>
                                                        <span className="text-sm font-medium">{user.unique_materials}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trends Tab */}
                            {activeTab === 'trends' && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Tendências de Consumo
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="text-left py-2 px-4 font-medium text-gray-700">Período</th>
                                                        <th className="text-left py-2 px-4 font-medium text-gray-700">Quantidade</th>
                                                        <th className="text-left py-2 px-4 font-medium text-gray-700">Valor</th>
                                                        <th className="text-left py-2 px-4 font-medium text-gray-700">Transações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {consumptionTrends.map((trend, index) => (
                                                        <tr key={index} className="border-t border-gray-200">
                                                            <td className="py-2 px-4">{trend.period}</td>
                                                            <td className="py-2 px-4">{formatQuantity(trend.total_quantity)}</td>
                                                            <td className="py-2 px-4">{formatCurrency(trend.total_value)}</td>
                                                            <td className="py-2 px-4">{trend.transaction_count}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recent Transactions Tab */}
                            {activeTab === 'recent' && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Transações Recentes de Consumo
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Data
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Material
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Quantidade
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Usuário
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Referência
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {recentTransactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {transaction.material?.reference}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {transaction.material?.name}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <span className="text-red-600">
                                                                {formatQuantity(Math.abs(transaction.quantity), transaction.material?.unit)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {transaction.user?.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {transaction.reference || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}