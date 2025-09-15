import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function Create({ materials, selectedMaterial }) {
    const { data, setData, post, processing, errors } = useForm({
        material_id: selectedMaterial?.id || '',
        quantity: '',
        type: 'adjustment',
        reference: '',
        notes: '',
        unit_cost: '',
    });

    const [currentMaterial, setCurrentMaterial] = useState(selectedMaterial);

    const handleMaterialChange = (materialId) => {
        const material = materials.find(m => m.id == materialId);
        setCurrentMaterial(material);
        setData('material_id', materialId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('admin.inventory.store'), {
            onSuccess: () => {
                toast.success('Transação criada com sucesso!');
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            }
        });
    };

    const getQuantityHelperText = () => {
        if (!data.type || !currentMaterial) return '';

        switch (data.type) {
            case 'purchase':
                return 'Informe a quantidade adquirida (valor positivo)';
            case 'consumption':
                return `Informe a quantidade consumida (máximo: ${currentMaterial.current_stock} ${currentMaterial.unit})`;
            case 'adjustment':
                return 'Informe o ajuste: positivo para adicionar, negativo para remover';
            case 'return':
                return 'Informe a quantidade devolvida (valor positivo)';
            default:
                return '';
        }
    };

    const formatStock = (stock, unit) => {
        return Number(stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 }) + ' ' + unit;
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Nova Transação de Estoque</h2>
                    <p className="mt-1 text-sm text-gray-600">Registre movimentações de estoque com histórico completo</p>
                </div>
            }
        >
            <Head title="Nova Transação de Estoque" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            {/* Material Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Material *
                                </label>
                                <select
                                    value={data.material_id}
                                    onChange={e => handleMaterialChange(e.target.value)}
                                    className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.material_id ? 'border-red-500' : ''}`}
                                    required
                                >
                                    <option value="">Selecione um material</option>
                                    {materials.map(material => (
                                        <option key={material.id} value={material.id}>
                                            {material.reference} - {material.name} (Estoque: {formatStock(material.current_stock, material.unit)})
                                        </option>
                                    ))}
                                </select>
                                {errors.material_id && <p className="mt-1 text-sm text-red-600">{errors.material_id}</p>}
                            </div>

                            {/* Current Stock Display */}
                            {currentMaterial && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Estoque Atual</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Material:</span>
                                            <span className="ml-2 font-medium">{currentMaterial.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Estoque:</span>
                                            <span className="ml-2 font-medium">{formatStock(currentMaterial.current_stock, currentMaterial.unit)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Unidade:</span>
                                            <span className="ml-2 font-medium">{currentMaterial.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Transaction Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Transação *
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.type ? 'border-red-500' : ''}`}
                                        required
                                    >
                                        <option value="purchase">Compra</option>
                                        <option value="consumption">Consumo</option>
                                        <option value="adjustment">Ajuste Manual</option>
                                        <option value="return">Devolução</option>
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantidade *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={data.quantity}
                                        onChange={e => setData('quantity', e.target.value)}
                                        className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.quantity ? 'border-red-500' : ''}`}
                                        placeholder="0.000"
                                        required
                                    />
                                    {getQuantityHelperText() && (
                                        <p className="mt-1 text-xs text-gray-600">{getQuantityHelperText()}</p>
                                    )}
                                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                                </div>
                            </div>

                            {/* Reference */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Referência
                                </label>
                                <input
                                    type="text"
                                    value={data.reference}
                                    onChange={e => setData('reference', e.target.value)}
                                    className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.reference ? 'border-red-500' : ''}`}
                                    placeholder="Ex: NF 12345, Pedido #567, Ajuste Inventário"
                                />
                                {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
                            </div>

                            {/* Unit Cost (for purchases) */}
                            {data.type === 'purchase' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Custo Unitário (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.unit_cost}
                                        onChange={e => setData('unit_cost', e.target.value)}
                                        className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.unit_cost ? 'border-red-500' : ''}`}
                                        placeholder="0.00"
                                    />
                                    {errors.unit_cost && <p className="mt-1 text-sm text-red-600">{errors.unit_cost}</p>}
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Observações
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    rows={3}
                                    className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.notes ? 'border-red-500' : ''}`}
                                    placeholder="Detalhes adicionais sobre a transação..."
                                />
                                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                            </div>

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
                                    disabled={processing}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Salvando...' : 'Criar Transação'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}