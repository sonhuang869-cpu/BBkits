import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ transaction }) {
    const formatQuantity = (quantity, unit) => {
        const sign = quantity >= 0 ? '+' : '';
        return sign + Number(quantity).toLocaleString('pt-BR', { minimumFractionDigits: 3 }) + ' ' + unit;
    };

    const formatPrice = (price) => {
        return 'R$ ' + Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    const getTransactionBadge = () => {
        const badges = {
            purchase: { text: 'Compra', color: 'bg-green-100 text-green-800' },
            consumption: { text: 'Consumo', color: 'bg-red-100 text-red-800' },
            adjustment: { text: 'Ajuste Manual', color: 'bg-blue-100 text-blue-800' },
            return: { text: 'Devolução', color: 'bg-yellow-100 text-yellow-800' }
        };
        return badges[transaction.type] || { text: 'Desconhecido', color: 'bg-gray-100 text-gray-800' };
    };

    const badge = getTransactionBadge();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Transação #{transaction.id}</h2>
                        <p className="mt-1 text-sm text-gray-600">Detalhes da movimentação de estoque</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/admin/materials/${transaction.material.id}`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Ver Material
                        </Link>
                        <Link
                            href="/admin/inventory"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Transação #${transaction.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Informações da Transação</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                                    {badge.text}
                                </span>
                            </div>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Registro completo da movimentação de estoque.
                            </p>
                        </div>

                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">ID da Transação</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                                        #{transaction.id}
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Data e Hora</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {new Date(transaction.created_at).toLocaleString('pt-BR')}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Material</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div>
                                            <div className="font-medium">{transaction.material.name}</div>
                                            <div className="text-gray-500">Ref: {transaction.material.reference}</div>
                                        </div>
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Tipo de Transação</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                                            {badge.text}
                                        </span>
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Quantidade</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={`font-semibold text-lg ${transaction.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatQuantity(transaction.quantity, transaction.material.unit)}
                                        </span>
                                    </dd>
                                </div>

                                {transaction.unit_cost && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Custo Unitário</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                            {formatPrice(transaction.unit_cost)}
                                        </dd>
                                    </div>
                                )}

                                {transaction.unit_cost && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Valor Total</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                            {formatPrice(Math.abs(transaction.quantity) * transaction.unit_cost)}
                                        </dd>
                                    </div>
                                )}

                                {transaction.reference && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Referência</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {transaction.reference}
                                        </dd>
                                    </div>
                                )}

                                {transaction.notes && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Observações</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {transaction.notes}
                                        </dd>
                                    </div>
                                )}

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Usuário Responsável</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {transaction.user ? (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-medium text-white">
                                                        {transaction.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{transaction.user.name}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">Sistema</span>
                                        )}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Data de Atualização</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {new Date(transaction.updated_at).toLocaleString('pt-BR')}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Material Information Card */}
                    <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Informações do Material</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Estado atual do material após esta transação.</p>
                        </div>

                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Nome do Material</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {transaction.material.name}
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Referência</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                                        {transaction.material.reference}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Estoque Atual</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                        {Number(transaction.material.current_stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 })} {transaction.material.unit}
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Estoque Mínimo</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {Number(transaction.material.minimum_stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 })} {transaction.material.unit}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Unidade de Medida</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {transaction.material.unit}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}