import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ supplier }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{supplier.name}</h2>
                        <p className="mt-1 text-sm text-gray-600">Informações do fornecedor</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={route('admin.suppliers.edit', supplier.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Editar Fornecedor
                        </Link>
                        <Link
                            href={route('admin.suppliers.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Fornecedor - ${supplier.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Informações do Fornecedor</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalhes completos sobre o fornecedor.</p>
                        </div>

                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Nome da Empresa</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {supplier.name}
                                    </dd>
                                </div>

                                {supplier.contact_name && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Nome do Contato</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {supplier.contact_name}
                                        </dd>
                                    </div>
                                )}

                                {supplier.email && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <a href={`mailto:${supplier.email}`} className="text-purple-600 hover:text-purple-900">
                                                {supplier.email}
                                            </a>
                                        </dd>
                                    </div>
                                )}

                                {supplier.phone && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <a href={`tel:${supplier.phone}`} className="text-purple-600 hover:text-purple-900">
                                                {supplier.phone}
                                            </a>
                                        </dd>
                                    </div>
                                )}

                                {supplier.address && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {supplier.address}
                                        </dd>
                                    </div>
                                )}

                                {supplier.payment_terms && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Condições de Pagamento</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {supplier.payment_terms}
                                        </dd>
                                    </div>
                                )}

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            supplier.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {supplier.is_active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {new Date(supplier.created_at).toLocaleDateString('pt-BR')}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Última atualização</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {new Date(supplier.updated_at).toLocaleDateString('pt-BR')}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Materials Section */}
                    {supplier.materials && supplier.materials.length > 0 && (
                        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Materiais Fornecidos</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Lista de materiais fornecidos por este fornecedor.
                                </p>
                            </div>

                            <div className="border-t border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Material
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estoque
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Preço
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {supplier.materials.map((material) => (
                                            <tr key={material.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                                        <div className="text-sm text-gray-500">Ref: {material.reference}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {Number(material.current_stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 })} {material.unit}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    R$ {Number(material.purchase_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.materials.show', material.id)}
                                                        className="text-purple-600 hover:text-purple-900"
                                                    >
                                                        Ver Material
                                                    </Link>
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
        </AuthenticatedLayout>
    );
}