<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Sugestões de Compra</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2563eb;
        }
        .header h1 {
            font-size: 18px;
            color: #1e40af;
            margin-bottom: 5px;
        }
        .header .subtitle {
            font-size: 11px;
            color: #666;
        }
        .summary {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 15px;
        }
        .summary-grid {
            display: table;
            width: 100%;
        }
        .summary-item {
            display: table-cell;
            text-align: center;
            padding: 5px;
        }
        .summary-value {
            font-size: 16px;
            font-weight: bold;
            color: #1e40af;
        }
        .summary-label {
            font-size: 9px;
            color: #666;
        }
        .supplier-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .supplier-header {
            background: #1e40af;
            color: white;
            padding: 8px 10px;
            font-size: 12px;
            font-weight: bold;
            border-radius: 5px 5px 0 0;
        }
        .supplier-header .total {
            float: right;
            font-size: 11px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th {
            background: #e5e7eb;
            padding: 6px 4px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
            border-bottom: 1px solid #d1d5db;
        }
        td {
            padding: 5px 4px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 9px;
        }
        tr:nth-child(even) {
            background: #f9fafb;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .priority-critical {
            background: #fef2f2;
            color: #dc2626;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }
        .priority-low {
            background: #fef9c3;
            color: #ca8a04;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }
        .footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
            color: #999;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
        .checkbox {
            width: 12px;
            height: 12px;
            border: 1px solid #999;
            display: inline-block;
        }
        .supplier-subtotal {
            background: #f3f4f6;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Sugestões de Compra</h1>
        <div class="subtitle">
            Gerado em {{ $generatedAt }} por {{ $generatedBy }}
        </div>
    </div>

    <div class="summary">
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-value">{{ $summary['total_items'] }}</div>
                <div class="summary-label">Itens a Comprar</div>
            </div>
            <div class="summary-item">
                <div class="summary-value" style="color: #dc2626;">{{ $summary['critical_items'] }}</div>
                <div class="summary-label">Críticos</div>
            </div>
            <div class="summary-item">
                <div class="summary-value" style="color: #ca8a04;">{{ $summary['low_items'] }}</div>
                <div class="summary-label">Baixos</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">{{ $summary['suppliers_involved'] }}</div>
                <div class="summary-label">Fornecedores</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">R$ {{ number_format($summary['total_estimated_cost'], 2, ',', '.') }}</div>
                <div class="summary-label">Custo Estimado</div>
            </div>
        </div>
    </div>

    @foreach($bySupplier as $supplier)
    <div class="supplier-section">
        <div class="supplier-header">
            {{ $supplier['supplier_name'] }}
            <span class="total">{{ $supplier['total_items'] }} itens | R$ {{ number_format($supplier['total_cost'], 2, ',', '.') }}</span>
        </div>
        <table>
            <thead>
                <tr>
                    <th style="width: 20px;"></th>
                    <th>Referência</th>
                    <th>Material</th>
                    <th class="text-center">Unidade</th>
                    <th class="text-right">Estoque</th>
                    <th class="text-right">Mínimo</th>
                    <th class="text-right">Sugerido</th>
                    <th class="text-right">Preço Unit.</th>
                    <th class="text-right">Total</th>
                    <th class="text-center">Prioridade</th>
                </tr>
            </thead>
            <tbody>
                @foreach($supplier['materials'] as $material)
                <tr>
                    <td><span class="checkbox"></span></td>
                    <td>{{ $material['material_reference'] }}</td>
                    <td>{{ $material['material_name'] }}</td>
                    <td class="text-center">{{ $material['unit'] }}</td>
                    <td class="text-right">{{ number_format($material['available_stock'], 2, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($material['minimum_stock'], 2, ',', '.') }}</td>
                    <td class="text-right"><strong>{{ number_format($material['suggested_quantity'], 2, ',', '.') }}</strong></td>
                    <td class="text-right">R$ {{ number_format($material['purchase_price'], 2, ',', '.') }}</td>
                    <td class="text-right">R$ {{ number_format($material['estimated_cost'], 2, ',', '.') }}</td>
                    <td class="text-center">
                        <span class="priority-{{ $material['priority'] }}">
                            {{ $material['priority'] === 'critical' ? 'CRÍTICO' : 'BAIXO' }}
                        </span>
                    </td>
                </tr>
                @endforeach
                <tr class="supplier-subtotal">
                    <td colspan="8" class="text-right">Subtotal {{ $supplier['supplier_name'] }}:</td>
                    <td class="text-right">R$ {{ number_format($supplier['total_cost'], 2, ',', '.') }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
    @endforeach

    <div class="footer">
        BBKits - Sistema de Gestão | Sugestões de Compra | Página {PAGE_NUM} de {PAGE_COUNT}
    </div>
</body>
</html>
