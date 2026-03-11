import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ReorderConfig({ materials, suppliers, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [supplierId, setSupplierId] = useState(filters.supplier_id || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [editedMaterials, setEditedMaterials] = useState({});
    const [autoCalcLoading, setAutoCalcLoading] = useState(false);
    const [autoCalcResults, setAutoCalcResults] = useState(null);

    const { post, processing } = useForm();

    const applyFilters = () => {
        router.get('/admin/purchase-suggestions/reorder-config', {
            search,
            supplier_id: supplierId,
            category_id: categoryId,
        }, { preserveState: true });
    };

    const handleInputChange = (materialId, field, value) => {
        setEditedMaterials(prev => ({
            ...prev,
            [materialId]: {
                ...prev[materialId],
                [field]: value,
            }
        }));
    };

    const saveChanges = () => {
        const updates = Object.entries(editedMaterials).map(([materialId, values]) => ({
            material_id: parseInt(materialId),
            ...values,
        }));

        if (updates.length === 0) {
            alert('Nenhuma alteração para salvar.');
            return;
        }

        router.post('/admin/purchase-suggestions/bulk-update', { updates }, {
            onSuccess: () => {
                setEditedMaterials({});
            },
        });
    };

    const autoCalculate = async () => {
        setAutoCalcLoading(true);
        try {
            const response = await fetch('/admin/purchase-suggestions/auto-calculate?days_history=90&safety_factor=1.5', {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            const data = await response.json();
            setAutoCalcResults(data.suggestions);
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao calcular automaticamente.');
        } finally {
            setAutoCalcLoading(false);
        }
    };

    const applyAutoCalc = (materialId, suggestedMin) => {
        setEditedMaterials(prev => ({
            ...prev,
            [materialId]: {
                ...prev[materialId],
                minimum_stock: suggestedMin,
            }
        }));
    };

    const applyAllAutoCalc = () => {
        if (!autoCalcResults) return;

        const newEdits = {};
        autoCalcResults.forEach(r => {
            newEdits[r.material_id] = {
                ...editedMaterials[r.material_id],
                minimum_stock: r.suggested_minimum,
            };
        });
        setEditedMaterials(prev => ({ ...prev, ...newEdits }));
    };

    const getAutoCalcValue = (materialId) => {
        if (!autoCalcResults) return null;
        const result = autoCalcResults.find(r => r.material_id === materialId);
        return result?.suggested_minimum;
    };

    const hasChanges = Object.keys(editedMaterials).length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Configurar Pontos de Reposição" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Configurar Pontos de Reposição</h1>
                            <p className="text-gray-600 mt-1">Defina os níveis mínimos de estoque para cada material</p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href="/admin/purchase-suggestions"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Voltar
                            </a>
                            <button
                                onClick={autoCalculate}
                                disabled={autoCalcLoading}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {autoCalcLoading ? 'Calculando...' : 'Calcular Automático'}
                            </button>
                            <button
                                onClick={saveChanges}
                                disabled={!hasChanges || processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Salvando...' : `Salvar (${Object.keys(editedMaterials).length})`}
                            </button>
                        </div>
                    </div>

                    {/* Auto-calc results banner */}
                    {autoCalcResults && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-purple-800">Cálculo Automático Disponível</h3>
                                    <p className="text-sm text-purple-600">
                                        Baseado no consumo dos últimos 90 dias com fator de segurança de 1.5x.
                                        {autoCalcResults.length} sugestões disponíveis.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={applyAllAutoCalc}
                                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                                    >
                                        Aplicar Todos
                                    </button>
                                    <button
                                        onClick={() => setAutoCalcResults(null)}
                                        className="px-3 py-1 bg-white text-purple-600 text-sm border border-purple-300 rounded hover:bg-purple-50"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nome ou referência..."
                                    className="w-full border-gray-300 rounded-lg shadow-sm"
                                />
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
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Filtrar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Materials Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Material</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Fornecedor</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Un</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Estoque Atual</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Estoque Mínimo</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Lead Time (dias)</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Múltiplo Compra</th>
                                        {autoCalcResults && (
                                            <th className="px-4 py-3 text-center text-xs font-medium text-purple-600">Sugerido</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {materials.data.map(material => {
                                        const edited = editedMaterials[material.id] || {};
                                        const autoCalc = getAutoCalcValue(material.id);
                                        const isLow = material.current_stock <= (edited.minimum_stock ?? material.minimum_stock ?? 0);

                                        return (
                                            <tr key={material.id} className={isLow ? 'bg-red-50' : ''}>
                                                <td className="px-4 py-2">
                                                    <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                                    <div className="text-xs text-gray-500">{material.reference}</div>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{material.supplier?.name || '-'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500 text-center">{material.unit}</td>
                                                <td className="px-4 py-2 text-sm text-right">
                                                    <span className={isLow ? 'text-red-600 font-medium' : 'text-gray-900'}>
                                                        {material.current_stock?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={edited.minimum_stock ?? material.minimum_stock ?? ''}
                                                        onChange={(e) => handleInputChange(material.id, 'minimum_stock', parseFloat(e.target.value) || 0)}
                                                        className={`w-24 text-center border rounded px-2 py-1 text-sm ${edited.minimum_stock !== undefined ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={edited.lead_time_days ?? material.lead_time_days ?? ''}
                                                        onChange={(e) => handleInputChange(material.id, 'lead_time_days', parseInt(e.target.value) || 0)}
                                                        className={`w-20 text-center border rounded px-2 py-1 text-sm ${edited.lead_time_days !== undefined ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={edited.purchase_multiple ?? material.purchase_multiple ?? 1}
                                                        onChange={(e) => handleInputChange(material.id, 'purchase_multiple', parseInt(e.target.value) || 1)}
                                                        className={`w-20 text-center border rounded px-2 py-1 text-sm ${edited.purchase_multiple !== undefined ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                                    />
                                                </td>
                                                {autoCalcResults && (
                                                    <td className="px-4 py-2 text-center">
                                                        {autoCalc !== null && autoCalc !== undefined ? (
                                                            <button
                                                                onClick={() => applyAutoCalc(material.id, autoCalc)}
                                                                className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                                            >
                                                                {autoCalc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {materials.last_page > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Mostrando {materials.from} - {materials.to} de {materials.total}
                                </div>
                                <div className="flex gap-1">
                                    {materials.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1 text-sm rounded ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
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
