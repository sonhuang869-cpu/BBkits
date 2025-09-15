import { useForm, Link } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function MaterialForm({ material = null, suppliers = [] }) {
    const { data, setData, post, put, processing, errors } = useForm({
        reference: material?.reference || '',
        name: material?.name || '',
        unit: material?.unit || 'm',
        purchase_price: material?.purchase_price || '',
        supplier_id: material?.supplier_id || '',
        secondary_supplier_id: material?.secondary_supplier_id || '',
        lead_time_days: material?.lead_time_days || 0,
        current_stock: material?.current_stock || 0,
        minimum_stock: material?.minimum_stock || 0,
        purchase_multiple: material?.purchase_multiple || 1,
        weight_per_unit: material?.weight_per_unit || '',
        is_active: material?.is_active ?? true,
    });

    const isEditing = !!material;

    const handleSubmit = (e) => {
        e.preventDefault();

        const action = isEditing ? 'put' : 'post';
        const route_name = isEditing ? 'admin.materials.update' : 'admin.materials.store';
        const route_params = isEditing ? [material.id] : [];

        const options = {
            onSuccess: () => {
                toast.success(isEditing ? 'Material atualizado com sucesso!' : 'Material criado com sucesso!');
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            }
        };

        if (action === 'post') {
            post(route(route_name), options);
        } else {
            put(route(route_name, route_params), options);
        }
    };

    const units = [
        { value: 'm', label: 'Metro (m)' },
        { value: 'cm', label: 'Centímetro (cm)' },
        { value: 'g', label: 'Grama (g)' },
        { value: 'kg', label: 'Quilograma (kg)' },
        { value: 'unit', label: 'Unidade' },
        { value: 'pair', label: 'Par' },
        { value: 'roll', label: 'Rolo' },
    ];

    return (
        <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reference */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Referência *
                        </label>
                        <input
                            type="text"
                            value={data.reference}
                            onChange={e => setData('reference', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.reference ? 'border-red-500' : ''}`}
                            placeholder="Ex: CR20, RS25, OF32"
                            required
                        />
                        {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Material *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Ex: Laminado Sintético, Gorgorão 3cm"
                            required
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unidade de Medida *
                        </label>
                        <select
                            value={data.unit}
                            onChange={e => setData('unit', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.unit ? 'border-red-500' : ''}`}
                            required
                        >
                            {units.map(unit => (
                                <option key={unit.value} value={unit.value}>{unit.label}</option>
                            ))}
                        </select>
                        {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
                    </div>

                    {/* Purchase Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço de Compra (R$) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.purchase_price}
                            onChange={e => setData('purchase_price', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.purchase_price ? 'border-red-500' : ''}`}
                            placeholder="0.00"
                            required
                        />
                        {errors.purchase_price && <p className="mt-1 text-sm text-red-600">{errors.purchase_price}</p>}
                    </div>

                    {/* Supplier */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fornecedor Principal
                        </label>
                        <select
                            value={data.supplier_id}
                            onChange={e => setData('supplier_id', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.supplier_id ? 'border-red-500' : ''}`}
                        >
                            <option value="">Selecione um fornecedor</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                            ))}
                        </select>
                        {errors.supplier_id && <p className="mt-1 text-sm text-red-600">{errors.supplier_id}</p>}
                    </div>

                    {/* Secondary Supplier */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fornecedor Secundário
                        </label>
                        <select
                            value={data.secondary_supplier_id}
                            onChange={e => setData('secondary_supplier_id', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.secondary_supplier_id ? 'border-red-500' : ''}`}
                        >
                            <option value="">Selecione um fornecedor</option>
                            {suppliers.filter(s => s.id != data.supplier_id).map(supplier => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                            ))}
                        </select>
                        {errors.secondary_supplier_id && <p className="mt-1 text-sm text-red-600">{errors.secondary_supplier_id}</p>}
                    </div>

                    {/* Lead Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prazo de Entrega (dias) *
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.lead_time_days}
                            onChange={e => setData('lead_time_days', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.lead_time_days ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.lead_time_days && <p className="mt-1 text-sm text-red-600">{errors.lead_time_days}</p>}
                    </div>

                    {/* Purchase Multiple */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Múltiplo de Compra *
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={data.purchase_multiple}
                            onChange={e => setData('purchase_multiple', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.purchase_multiple ? 'border-red-500' : ''}`}
                            placeholder="Ex: 100 (para pacotes de 100 unidades)"
                            required
                        />
                        {errors.purchase_multiple && <p className="mt-1 text-sm text-red-600">{errors.purchase_multiple}</p>}
                    </div>

                    {/* Current Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estoque Atual *
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={data.current_stock}
                            onChange={e => setData('current_stock', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.current_stock ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.current_stock && <p className="mt-1 text-sm text-red-600">{errors.current_stock}</p>}
                    </div>

                    {/* Minimum Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estoque Mínimo *
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={data.minimum_stock}
                            onChange={e => setData('minimum_stock', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.minimum_stock ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.minimum_stock && <p className="mt-1 text-sm text-red-600">{errors.minimum_stock}</p>}
                    </div>

                    {/* Weight per Unit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Peso/Volume por Unidade
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={data.weight_per_unit}
                            onChange={e => setData('weight_per_unit', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.weight_per_unit ? 'border-red-500' : ''}`}
                            placeholder="Opcional"
                        />
                        {errors.weight_per_unit && <p className="mt-1 text-sm text-red-600">{errors.weight_per_unit}</p>}
                    </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={data.is_active}
                        onChange={e => setData('is_active', e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                        Material ativo no sistema
                    </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Link
                        href={route('admin.materials.index')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {processing ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Material')}
                    </button>
                </div>
            </form>
        </div>
    );
}