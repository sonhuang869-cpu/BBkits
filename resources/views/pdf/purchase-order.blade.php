<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Pedido de Compra {{ $purchaseOrder->po_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 10px; line-height: 1.4; color: #333; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .header-grid { display: table; width: 100%; }
        .header-left, .header-right { display: table-cell; vertical-align: top; }
        .header-left { width: 60%; }
        .header-right { width: 40%; text-align: right; }
        .company-name { font-size: 20px; font-weight: bold; color: #1e40af; }
        .po-number { font-size: 16px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
        .po-date { font-size: 11px; color: #666; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 12px; font-weight: bold; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px; }
        .info-grid { display: table; width: 100%; }
        .info-col { display: table-cell; width: 50%; vertical-align: top; padding-right: 20px; }
        .info-row { margin-bottom: 5px; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #1e40af; color: white; padding: 8px 6px; text-align: left; font-size: 10px; }
        td { padding: 6px; border-bottom: 1px solid #e5e7eb; font-size: 10px; }
        tr:nth-child(even) { background: #f9fafb; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals { background: #f3f4f6; padding: 15px; border-radius: 5px; }
        .totals-row { display: table; width: 100%; margin-bottom: 5px; }
        .totals-label { display: table-cell; width: 80%; text-align: right; padding-right: 10px; }
        .totals-value { display: table-cell; width: 20%; text-align: right; font-weight: bold; }
        .grand-total { font-size: 14px; color: #1e40af; border-top: 2px solid #1e40af; padding-top: 10px; margin-top: 10px; }
        .status-badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .status-draft { background: #e5e7eb; color: #374151; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-received { background: #d1fae5; color: #065f46; }
        .priority-high { color: #ea580c; }
        .priority-urgent { color: #dc2626; font-weight: bold; }
        .notes { background: #fef9c3; padding: 10px; border-radius: 5px; margin-top: 15px; }
        .notes-title { font-weight: bold; margin-bottom: 5px; }
        .footer { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 10px; }
        .signature-area { margin-top: 40px; display: table; width: 100%; }
        .signature-box { display: table-cell; width: 45%; text-align: center; }
        .signature-line { border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-grid">
            <div class="header-left">
                <div class="company-name">BBKits</div>
                <div style="margin-top: 10px;">
                    <strong>PEDIDO DE COMPRA</strong>
                </div>
            </div>
            <div class="header-right">
                <div class="po-number">{{ $purchaseOrder->po_number }}</div>
                <div class="po-date">Data: {{ $purchaseOrder->order_date?->format('d/m/Y') ?? now()->format('d/m/Y') }}</div>
                <div style="margin-top: 5px;">
                    <span class="status-badge status-{{ $purchaseOrder->status }}">
                        {{ $purchaseOrder->getStatusOptions()[$purchaseOrder->status] ?? $purchaseOrder->status }}
                    </span>
                </div>
                @if($purchaseOrder->priority && $purchaseOrder->priority !== 'normal')
                <div class="priority-{{ $purchaseOrder->priority }}" style="margin-top: 5px;">
                    Prioridade: {{ ucfirst($purchaseOrder->priority) }}
                </div>
                @endif
            </div>
        </div>
    </div>

    <div class="section">
        <div class="info-grid">
            <div class="info-col">
                <div class="section-title">Fornecedor</div>
                <div class="info-row">
                    <span class="info-value" style="font-weight: bold; font-size: 12px;">{{ $purchaseOrder->supplier->name }}</span>
                </div>
                @if($purchaseOrder->supplier->contact_person)
                <div class="info-row">
                    <span class="info-label">Contato:</span>
                    <span class="info-value">{{ $purchaseOrder->supplier->contact_person }}</span>
                </div>
                @endif
                @if($purchaseOrder->supplier->email)
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ $purchaseOrder->supplier->email }}</span>
                </div>
                @endif
                @if($purchaseOrder->supplier->phone)
                <div class="info-row">
                    <span class="info-label">Telefone:</span>
                    <span class="info-value">{{ $purchaseOrder->supplier->phone }}</span>
                </div>
                @endif
            </div>
            <div class="info-col">
                <div class="section-title">Informações</div>
                @if($purchaseOrder->expected_delivery_date)
                <div class="info-row">
                    <span class="info-label">Entrega Prevista:</span>
                    <span class="info-value">{{ $purchaseOrder->expected_delivery_date->format('d/m/Y') }}</span>
                </div>
                @endif
                @if($purchaseOrder->payment_terms)
                <div class="info-row">
                    <span class="info-label">Condições:</span>
                    <span class="info-value">{{ $purchaseOrder->payment_terms }}</span>
                </div>
                @endif
                <div class="info-row">
                    <span class="info-label">Criado por:</span>
                    <span class="info-value">{{ $purchaseOrder->createdBy?->name ?? '-' }}</span>
                </div>
                @if($purchaseOrder->approvedBy)
                <div class="info-row">
                    <span class="info-label">Aprovado por:</span>
                    <span class="info-value">{{ $purchaseOrder->approvedBy->name }} em {{ $purchaseOrder->approved_at->format('d/m/Y') }}</span>
                </div>
                @endif
            </div>
        </div>
    </div>

    @if($purchaseOrder->delivery_address)
    <div class="section">
        <div class="section-title">Endereço de Entrega</div>
        <p>{{ $purchaseOrder->delivery_address }}</p>
    </div>
    @endif

    <div class="section">
        <div class="section-title">Itens do Pedido</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 8%;">#</th>
                    <th style="width: 12%;">Referência</th>
                    <th style="width: 35%;">Material</th>
                    <th class="text-center" style="width: 10%;">Unidade</th>
                    <th class="text-right" style="width: 10%;">Qtd</th>
                    <th class="text-right" style="width: 12%;">Preço Unit.</th>
                    <th class="text-right" style="width: 13%;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($purchaseOrder->line_items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item['material_reference'] ?? '-' }}</td>
                    <td>{{ $item['material_name'] }}</td>
                    <td class="text-center">{{ $item['unit'] ?? '-' }}</td>
                    <td class="text-right">{{ number_format($item['quantity'], 2, ',', '.') }}</td>
                    <td class="text-right">R$ {{ number_format($item['unit_price'], 2, ',', '.') }}</td>
                    <td class="text-right">R$ {{ number_format($item['quantity'] * $item['unit_price'], 2, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                <div class="totals-label">Subtotal:</div>
                <div class="totals-value">R$ {{ number_format($purchaseOrder->total_amount, 2, ',', '.') }}</div>
            </div>
            @if($purchaseOrder->tax_amount > 0)
            <div class="totals-row">
                <div class="totals-label">Impostos:</div>
                <div class="totals-value">R$ {{ number_format($purchaseOrder->tax_amount, 2, ',', '.') }}</div>
            </div>
            @endif
            @if($purchaseOrder->shipping_cost > 0)
            <div class="totals-row">
                <div class="totals-label">Frete:</div>
                <div class="totals-value">R$ {{ number_format($purchaseOrder->shipping_cost, 2, ',', '.') }}</div>
            </div>
            @endif
            <div class="totals-row grand-total">
                <div class="totals-label">TOTAL:</div>
                <div class="totals-value">R$ {{ number_format($purchaseOrder->total_amount + $purchaseOrder->tax_amount + $purchaseOrder->shipping_cost, 2, ',', '.') }}</div>
            </div>
        </div>
    </div>

    @if($purchaseOrder->notes)
    <div class="notes">
        <div class="notes-title">Observações:</div>
        <p>{{ $purchaseOrder->notes }}</p>
    </div>
    @endif

    <div class="signature-area">
        <div class="signature-box">
            <div class="signature-line">Assinatura do Solicitante</div>
        </div>
        <div class="signature-box">
            <div class="signature-line">Assinatura do Aprovador</div>
        </div>
    </div>

    <div class="footer">
        BBKits - Sistema de Gestão | Pedido de Compra {{ $purchaseOrder->po_number }} | Gerado em {{ $generatedAt }}
    </div>
</body>
</html>
