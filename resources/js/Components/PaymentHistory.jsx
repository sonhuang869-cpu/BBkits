import React, { useState } from 'react';
import { Calendar, CreditCard, Check, Clock, X, Eye, Trash2, RotateCcw } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

export default function PaymentHistory({ sale, payments, onAddPayment, paymentSummary }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        rejection_reason: '',
    });

    // BUG-15: Separate form for refund
    const refundForm = useForm({
        refund_date: new Date().toISOString().split('T')[0],
        refund_method: 'pix',
        refund_notes: '',
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800', icon: Clock },
            'approved': { label: 'Aprovado', class: 'bg-green-100 text-green-800', icon: Check },
            'rejected': { label: 'Rejeitado', class: 'bg-red-100 text-red-800', icon: X },
            'refunded': { label: 'Estornado', class: 'bg-purple-100 text-purple-800', icon: RotateCcw },
        };
        return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800', icon: Clock };
    };

    // BUG-15: Check if sale needs refund (cancelled/rejected with approved payments)
    const saleNeedsRefund = ['recusado', 'cancelado'].includes(sale.status);

    // BUG-15: Handle refund
    const handleRefund = (payment) => {
        setSelectedPayment(payment);
        setShowRefundModal(true);
    };

    const submitRefund = (e) => {
        e.preventDefault();
        refundForm.put(`/payments/${selectedPayment.id}/refund`, {
            onSuccess: () => {
                refundForm.reset();
                setShowRefundModal(false);
                setSelectedPayment(null);
            }
        });
    };

    const handleApprove = (payment) => {
        put(`/payments/${payment.id}/approve`);
    };

    const handleReject = (payment) => {
        setSelectedPayment(payment);
        setShowRejectModal(true);
    };

    const submitRejection = (e) => {
        e.preventDefault();
        put(`/payments/${selectedPayment.id}/reject`, {
            onSuccess: () => {
                reset();
                setShowRejectModal(false);
                setSelectedPayment(null);
            }
        });
    };

    const handleDelete = (payment) => {
        if (confirm('Tem certeza que deseja excluir este pagamento?')) {
            router.delete(`/payments/${payment.id}`);
        }
    };

    // Use paymentSummary values from backend (already calculated correctly with shipping)
    const totalAmount = paymentSummary ? paymentSummary.total_amount : (sale.total_amount + (sale.shipping_amount || 0));
    const totalPaid = paymentSummary ? paymentSummary.paid_amount : payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalPending = paymentSummary ? paymentSummary.pending_amount : payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const remaining = paymentSummary ? paymentSummary.remaining_amount : Math.max(0, totalAmount - totalPaid);
    const progress = paymentSummary ? paymentSummary.progress : ((totalPaid / totalAmount) * 100);

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Histórico de Pagamentos</h3>
                        <p className="text-sm text-gray-600">Cliente: {sale.client_name}</p>
                    </div>
                    <button
                        onClick={onAddPayment}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Adicionar Pagamento
                    </button>
                </div>
            </div>

            {/* Payment Progress */}
            <div className="p-6 border-b bg-gray-50">
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progresso do Pagamento</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-600">Total com Frete</p>
                        <p className="text-lg font-bold text-gray-800">
                            R$ {totalAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Produtos: R$ {sale.total_amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500">
                            Frete: R$ {(sale.shipping_amount || 0)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Pago</p>
                        <p className="text-lg font-bold text-green-600">
                            R$ {totalPaid?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : 0}% do total
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Pendente</p>
                        <p className="text-lg font-bold text-yellow-600">
                            R$ {totalPending?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Aguardando aprovação
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Restante</p>
                        <p className="text-lg font-bold text-red-600">
                            R$ {remaining?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {remaining > 0 ? 'A pagar' : 'Quitado'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payments List */}
            <div className="p-6">
                {payments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Nenhum pagamento registrado ainda.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment) => {
                            const statusInfo = getStatusBadge(payment.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <StatusIcon className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium text-gray-800">
                                                        R$ {parseFloat(payment.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                    <span>
                                                        <Calendar className="w-4 h-4 inline mr-1" />
                                                        {new Date(payment.payment_date).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span>
                                                        <CreditCard className="w-4 h-4 inline mr-1" />
                                                        {payment.payment_method}
                                                    </span>
                                                </div>
                                                {payment.notes && (
                                                    <p className="text-sm text-gray-500 mt-1">{payment.notes}</p>
                                                )}
                                                {payment.rejection_reason && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        <strong>Motivo da rejeição:</strong> {payment.rejection_reason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {payment.receipt_path && (
                                                <a
                                                    href={`/storage/${payment.receipt_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver comprovante"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            )}
                                            
                                            {payment.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(payment)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Aprovar"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(payment)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Rejeitar"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            
                                            {payment.status === 'pending' && (
                                                <button
                                                    onClick={() => handleDelete(payment)}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* BUG-15: Refund button for approved payments on cancelled/rejected sales */}
                                            {payment.status === 'approved' && saleNeedsRefund && (
                                                <button
                                                    onClick={() => handleRefund(payment)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Estornar pagamento"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Show refund info for refunded payments */}
                                            {payment.status === 'refunded' && payment.refund_date && (
                                                <span className="text-xs text-purple-600">
                                                    Estornado em {new Date(payment.refund_date).toLocaleDateString('pt-BR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* BUG-15: Refund alert for cancelled/rejected sales */}
                {saleNeedsRefund && payments.some(p => p.status === 'approved') && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-800">
                            <RotateCcw className="w-5 h-5" />
                            <span className="font-medium">Atenção: Esta venda foi {sale.status === 'recusado' ? 'recusada' : 'cancelada'}</span>
                        </div>
                        <p className="text-sm text-purple-700 mt-1">
                            Existem pagamentos aprovados que podem precisar de estorno.
                            Use o botão <RotateCcw className="w-3 h-3 inline" /> para registrar o estorno de cada pagamento.
                        </p>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Rejeitar Pagamento</h3>
                            <form onSubmit={submitRejection}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo da rejeição *
                                    </label>
                                    <textarea
                                        value={data.rejection_reason}
                                        onChange={(e) => setData('rejection_reason', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows="3"
                                        placeholder="Explique o motivo da rejeição..."
                                        required
                                    />
                                    {errors.rejection_reason && (
                                        <p className="text-red-500 text-sm mt-1">{errors.rejection_reason}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectModal(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Rejeitando...' : 'Rejeitar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* BUG-15: Refund Modal */}
            {showRefundModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <RotateCcw className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Registrar Estorno</h3>
                                    <p className="text-sm text-gray-600">
                                        Valor: R$ {parseFloat(selectedPayment.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submitRefund}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data do Estorno *
                                        </label>
                                        <input
                                            type="date"
                                            value={refundForm.data.refund_date}
                                            onChange={(e) => refundForm.setData('refund_date', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Método do Estorno *
                                        </label>
                                        <select
                                            value={refundForm.data.refund_method}
                                            onChange={(e) => refundForm.setData('refund_method', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            required
                                        >
                                            <option value="pix">PIX</option>
                                            <option value="transferencia">Transferência Bancária</option>
                                            <option value="dinheiro">Dinheiro</option>
                                            <option value="credito_loja">Crédito na Loja</option>
                                            <option value="outro">Outro</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Observações
                                        </label>
                                        <textarea
                                            value={refundForm.data.refund_notes}
                                            onChange={(e) => refundForm.setData('refund_notes', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            rows="3"
                                            placeholder="Informações adicionais sobre o estorno..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowRefundModal(false);
                                            setSelectedPayment(null);
                                            refundForm.reset();
                                        }}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={refundForm.processing}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                    >
                                        {refundForm.processing ? 'Processando...' : 'Confirmar Estorno'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}