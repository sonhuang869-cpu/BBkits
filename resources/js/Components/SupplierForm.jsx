import { useForm, Link } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function SupplierForm({ supplier = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: supplier?.name || '',
        contact_name: supplier?.contact_name || '',
        email: supplier?.email || '',
        phone: supplier?.phone || '',
        address: supplier?.address || '',
        payment_terms: supplier?.payment_terms || '',
        is_active: supplier?.is_active ?? true,
    });

    const isEditing = !!supplier;

    const handleSubmit = (e) => {
        e.preventDefault();

        const action = isEditing ? 'put' : 'post';
        const route_name = isEditing ? 'admin.suppliers.update' : 'admin.suppliers.store';
        const route_params = isEditing ? [supplier.id] : [];

        const options = {
            onSuccess: () => {
                toast.success(isEditing ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor criado com sucesso!');
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

    return (
        <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Empresa *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Ex: Fornecedor ABC Ltda"
                            required
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Contact Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Contato
                        </label>
                        <input
                            type="text"
                            value={data.contact_name}
                            onChange={e => setData('contact_name', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.contact_name ? 'border-red-500' : ''}`}
                            placeholder="Ex: João Silva"
                        />
                        {errors.contact_name && <p className="mt-1 text-sm text-red-600">{errors.contact_name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="contato@fornecedor.com.br"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.phone ? 'border-red-500' : ''}`}
                            placeholder="(11) 99999-9999"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Payment Terms */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condições de Pagamento
                        </label>
                        <input
                            type="text"
                            value={data.payment_terms}
                            onChange={e => setData('payment_terms', e.target.value)}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.payment_terms ? 'border-red-500' : ''}`}
                            placeholder="Ex: 30/60 dias, À vista com desconto"
                        />
                        {errors.payment_terms && <p className="mt-1 text-sm text-red-600">{errors.payment_terms}</p>}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Endereço
                        </label>
                        <textarea
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            rows={3}
                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.address ? 'border-red-500' : ''}`}
                            placeholder="Endereço completo do fornecedor"
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
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
                        Fornecedor ativo no sistema
                    </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Link
                        href={route('admin.suppliers.index')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {processing ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Fornecedor')}
                    </button>
                </div>
            </form>
        </div>
    );
}