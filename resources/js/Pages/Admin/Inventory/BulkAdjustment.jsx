import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function BulkAdjustment({ materials }) {
    const { data, setData, post, processing, errors } = useForm({
        reference: '',
        adjustments: []
    });

    const [selectedMaterials, setSelectedMaterials] = useState([]);

    const addMaterial = (materialId) => {
        const material = materials.find(m => m.id == materialId);
        if (!material || selectedMaterials.some(m => m.id == materialId)) return;

        const newMaterial = {
            id: material.id,
            name: material.name,
            reference: material.reference,
            unit: material.unit,
            current_stock: material.current_stock,
            quantity: '',
            type: 'adjustment',
            notes: '',
            unit_cost: ''
        };

        setSelectedMaterials([...selectedMaterials, newMaterial]);
    };

    const removeMaterial = (materialId) => {
        setSelectedMaterials(selectedMaterials.filter(m => m.id !== materialId));
    };

    const updateMaterial = (materialId, field, value) => {
        setSelectedMaterials(selectedMaterials.map(m =>
            m.id === materialId ? { ...m, [field]: value } : m
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validAdjustments = selectedMaterials
            .filter(m => m.quantity && m.quantity !== '0')
            .map(m => ({
                material_id: m.id,
                quantity: parseFloat(m.quantity),
                type: m.type,
                notes: m.notes,
                unit_cost: m.unit_cost ? parseFloat(m.unit_cost) : null
            }));

        if (validAdjustments.length === 0) {
            toast.error('Adicione pelo menos um material com quantidade válida');
            return;
        }

        setData('adjustments', validAdjustments);

        post(route('admin.inventory.bulk.process'), {
            data: {
                reference: data.reference,
                adjustments: validAdjustments
            },
            onSuccess: () => {
                toast.success('Ajustes processados com sucesso!');
                setSelectedMaterials([]);
                setData('reference', '');
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            }
        });
    };

    const formatStock = (stock, unit) => {
        return Number(stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 }) + ' ' + unit;
    };

    const getPreviewQuantity = (material) => {
        if (!material.quantity) return null;
        const quantity = parseFloat(material.quantity);
        if (isNaN(quantity)) return null;

        let adjustedQuantity = quantity;
        if (material.type === 'consumption' && quantity > 0) {
            adjustedQuantity = -quantity;
        }

        const newStock = material.current_stock + adjustedQuantity;
        const sign = adjustedQuantity >= 0 ? '+' : '';

        return {
            change: sign + adjustedQuantity.toLocaleString('pt-BR', { minimumFractionDigits: 3 }),
            newStock: newStock.toLocaleString('pt-BR', { minimumFractionDigits: 3 }),
            isValid: material.type !== 'consumption' || Math.abs(adjustedQuantity) <= material.current_stock
        };
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Ajuste de Estoque em Lote</h2>
                    <p className="mt-1 text-sm text-gray-600">Processe múltiplos ajustes de estoque simultaneamente</p>
                </div>
            }
        >
            <Head title="Ajuste de Estoque em Lote" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Reference */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Referência Global (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={data.reference}
                                    onChange={e => setData('reference', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Ex: Inventário 2025-01, NF 12345"
                                />
                                <p className="mt-1 text-sm text-gray-500">Esta referência será aplicada a todos os ajustes</p>
                            </div>

                            {/* Material Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adicionar Material
                                </label>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addMaterial(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Selecione um material para adicionar</option>
                                    {materials
                                        .filter(material => !selectedMaterials.some(m => m.id === material.id))
                                        .map(material => (
                                            <option key={material.id} value={material.id}>
                                                {material.reference} - {material.name} (Estoque: {formatStock(material.current_stock, material.unit)})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Selected Materials */}
                            {selectedMaterials.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Materiais Selecionados ({selectedMaterials.length})
                                    </h3>

                                    <div className="space-y-4">
                                        {selectedMaterials.map((material) => {
                                            const preview = getPreviewQuantity(material);
                                            return (
                                                <div key={material.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                                        {/* Material Info */}
                                                        <div className="lg:col-span-3">
                                                            <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                                            <div className="text-sm text-gray-500">Ref: {material.reference}</div>
                                                            <div className="text-sm text-gray-500">
                                                                Estoque: {formatStock(material.current_stock, material.unit)}
                                                            </div>
                                                        </div>

                                                        {/* Type */}
                                                        <div className="lg:col-span-2">
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                                                            <select
                                                                value={material.type}
                                                                onChange={(e) => updateMaterial(material.id, 'type', e.target.value)}
                                                                className="w-full text-sm rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                            >
                                                                <option value="purchase">Compra</option>
                                                                <option value="consumption">Consumo</option>
                                                                <option value="adjustment">Ajuste</option>
                                                                <option value="return">Devolução</option>
                                                            </select>
                                                        </div>

                                                        {/* Quantity */}
                                                        <div className="lg:col-span-2">
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade</label>
                                                            <input
                                                                type="number"
                                                                step="0.001"
                                                                value={material.quantity}
                                                                onChange={(e) => updateMaterial(material.id, 'quantity', e.target.value)}
                                                                className={`w-full text-sm rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${
                                                                    preview && !preview.isValid ? 'border-red-500' : ''
                                                                }`}
                                                                placeholder="0.000"
                                                            />
                                                            {preview && !preview.isValid && (
                                                                <p className="text-xs text-red-600 mt-1">Estoque insuficiente</p>
                                                            )}
                                                        </div>

                                                        {/* Unit Cost */}
                                                        {material.type === 'purchase' && (
                                                            <div className="lg:col-span-1">
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">R$</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={material.unit_cost}
                                                                    onChange={(e) => updateMaterial(material.id, 'unit_cost', e.target.value)}
                                                                    className="w-full text-sm rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Notes */}
                                                        <div className={material.type === 'purchase' ? 'lg:col-span-2' : 'lg:col-span-3'}>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
                                                            <input
                                                                type="text"
                                                                value={material.notes}
                                                                onChange={(e) => updateMaterial(material.id, 'notes', e.target.value)}
                                                                className="w-full text-sm rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                                placeholder="Observações..."
                                                            />
                                                        </div>

                                                        {/* Preview & Actions */}
                                                        <div className="lg:col-span-2 flex items-center justify-between">
                                                            {preview && (
                                                                <div className="text-xs">
                                                                    <div className={`font-medium ${preview.isValid ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {preview.change} {material.unit}
                                                                    </div>
                                                                    <div className="text-gray-500">
                                                                        → {preview.newStock} {material.unit}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMaterial(material.id)}
                                                                className="text-red-600 hover:text-red-800 text-sm"
                                                            >
                                                                Remover
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            {selectedMaterials.length > 0 && (
                                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resumo</h4>
                                    <div className="text-sm text-gray-600">
                                        <p>{selectedMaterials.length} materiais selecionados</p>
                                        <p>{selectedMaterials.filter(m => m.quantity && m.quantity !== '0').length} com ajustes válidos</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <Link
                                    href={route('admin.inventory.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || selectedMaterials.length === 0}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Processando...' : 'Processar Ajustes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}