import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ purchaseOrder, statuses }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getStatusBadge = (status) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-800',
            sent: 'bg-blue-100 text-blue-800',
            acknowledged: 'bg-yellow-100 text-yellow-800',
            partially_received: 'bg-orange-100 text-orange-800',
            received: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status] || styles.draft}`}>
                {statuses[status] || status}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        if (!priority || priority === 'normal') return null;
        const styles = {
            low: 'bg-gray-100 text-gray-600',
            high: 'bg-orange-100 text-orange-700',
            urgent: 'bg-red-100 text-red-700',
        };
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[priority]}`}>
                {priority.toUpperCase()}
            </span>
        );
    };

    const approve = () => {
        if (confirm('Aprovar e enviar este pedido?')) {
            router.post(`/admin/purchase-orders/${purchaseOrder.id}/approve`);
        }
    };

    const updateStatus = (newStatus) => {
        router.put(`/admin/purchase-orders/${purchaseOrder.id}/status`, { status: newStatus });
    };

    const exportPdf = () => {
        window.location.href = `/admin/purchase-orders/${purchaseOrder.id}/export-pdf`;
    };

    const deletePO = () => {
        if (confirm('Excluir este pedido de compra?')) {
            router.delete(`/admin/purchase-orders/${purchaseOrder.id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Pedido ${purchaseOrder.po_number}`} />

            <div className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{purchaseOrder.po_number}</h1>
                                {getStatusBadge(purchaseOrder.status)}
                                {getPriorityBadge(purchaseOrder.priority)}
                            </div>
                            <p className="text-gray-600 mt-1">
                                Criado em {formatDate(purchaseOrder.created_at)} por {purchaseOrder.created_by?.name || '-'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/admin/purchase-orders" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                Voltar
                            </Link>
                            <button onClick={exportPdf} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Exportar PDF
                            </button>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Supplier Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-medium mb-4">Fornecedor</h2>
                            <div className="space-y-2">
                                <p className="font-medium text-lg">{purchaseOrder.supplier?.name || '-'}</p>
                                {purchaseOrder.supplier?.contact_person && (
                                    <p className="text-sm text-gray-600">Contato: {purchaseOrder.supplier.contact_person}</p>
                                )}
                                {purchaseOrder.supplier?.email && (
                                    <p className="text-sm text-gray-600">Email: {purchaseOrder.supplier.email}</p>
                                )}
                                {purchaseOrder.supplier?.phone && (
                                    <p className="text-sm text-gray-600">Telefone: {purchaseOrder.supplier.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-medium mb-4">Informações</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Data do Pedido:</span>
                                    <span>{formatDate(purchaseOrder.order_date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Entrega Prevista:</span>
                                    <span>{formatDate(purchaseOrder.expected_delivery_date)}</span>
                                </div>
                                {purchaseOrder.actual_delivery_date && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Entrega Real:</span>
                                        <span>{formatDate(purchaseOrder.actual_delivery_date)}</span>
                                    </div>
                                )}
                                {purchaseOrder.payment_terms && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Condições:</span>
                                        <span>{purchaseOrder.payment_terms}</span>
                                    </div>
                                )}
                                {purchaseOrder.approved_by && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Aprovado por:</span>
                                        <span>{purchaseOrder.approved_by.name} em {formatDate(purchaseOrder.approved_at)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-medium">Itens do Pedido</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Referência</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Material</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Unidade</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Quantidade</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Preço Unit.</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(purchaseOrder.line_items || []).map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-3 text-sm">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{item.material_reference || '-'}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{item.material_name}</td>
                                            <td className="px-4 py-3 text-sm text-center">{item.unit || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-right">{item.quantity?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unit_price)}</td>
                                            <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(item.quantity * item.unit_price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="p-6 bg-gray-50">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span>{formatCurrency(purchaseOrder.total_amount)}</span>
                                    </div>
                                    {purchaseOrder.tax_amount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Impostos:</span>
                                            <span>{formatCurrency(purchaseOrder.tax_amount)}</span>
                                        </div>
                                    )}
                                    {purchaseOrder.shipping_cost > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Frete:</span>
                                            <span>{formatCurrency(purchaseOrder.shipping_cost)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-blue-600">
                                            {formatCurrency(
                                                (purchaseOrder.total_amount || 0) +
                                                (purchaseOrder.tax_amount || 0) +
                                                (purchaseOrder.shipping_cost || 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {purchaseOrder.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <h3 className="font-medium mb-2">Observações</h3>
                            <p className="text-sm">{purchaseOrder.notes}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium mb-4">Ações</h2>
                        <div className="flex flex-wrap gap-3">
                            {purchaseOrder.status === 'draft' && (
                                <>
                                    <button
                                        onClick={approve}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Aprovar e Enviar
                                    </button>
                                    <Link
                                        href={`/admin/purchase-orders/${purchaseOrder.id}/edit`}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={deletePO}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Excluir
                                    </button>
                                </>
                            )}

                            {purchaseOrder.status === 'sent' && (
                                <button
                                    onClick={() => updateStatus('acknowledged')}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                >
                                    Marcar como Confirmado
                                </button>
                            )}

                            {['sent', 'acknowledged', 'partially_received'].includes(purchaseOrder.status) && (
                                <>
                                    <button
                                        onClick={() => updateStatus('received')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Marcar como Recebido
                                    </button>
                                    <button
                                        onClick={() => updateStatus('cancelled')}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Cancelar Pedido
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
