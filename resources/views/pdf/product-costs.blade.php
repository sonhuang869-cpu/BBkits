<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Custos de Produtos</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 9px; line-height: 1.4; color: #333; }
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #2563eb; }
        .header h1 { font-size: 16px; color: #1e40af; margin-bottom: 5px; }
        .header .subtitle { font-size: 10px; color: #666; }
        .summary { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 5px; padding: 10px; margin-bottom: 15px; }
        .summary-grid { display: table; width: 100%; }
        .summary-item { display: table-cell; text-align: center; padding: 5px; }
        .summary-value { font-size: 14px; font-weight: bold; color: #1e40af; }
        .summary-label { font-size: 8px; color: #666; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1e40af; color: white; padding: 6px 4px; text-align: left; font-size: 8px; }
        td { padding: 5px 4px; border-bottom: 1px solid #e5e7eb; font-size: 8px; }
        tr:nth-child(even) { background: #f9fafb; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .margin-critical { background: #fef2f2; color: #dc2626; }
        .margin-low { background: #fef9c3; color: #ca8a04; }
        .margin-normal { background: #f0fdf4; color: #16a34a; }
        .margin-good { background: #dcfce7; color: #15803d; }
        .badge { padding: 2px 6px; border-radius: 3px; font-size: 7px; font-weight: bold; }
        .footer { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 8px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Relatório de Custos de Produtos</h1>
        <div class="subtitle">
            Gerado em {{ $generatedAt }} por {{ $generatedBy }}
            @if($filterStatus)
            | Filtro: {{ ucfirst($filterStatus) }}
            @endif
        </div>
    </div>

    <div class="summary">
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-value">{{ $totals['total_products'] }}</div>
                <div class="summary-label">Produtos</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">R$ {{ number_format($totals['avg_material_cost'], 2, ',', '.') }}</div>
                <div class="summary-label">Custo Médio</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">{{ number_format($totals['avg_margin'], 1) }}%</div>
                <div class="summary-label">Margem Média</div>
            </div>
            <div class="summary-item">
                <div class="summary-value" style="color: #dc2626;">{{ $totals['low_margin_count'] }}</div>
                <div class="summary-label">Margem Baixa</div>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 30%;">Produto</th>
                <th class="text-right" style="width: 12%;">Preço Venda</th>
                <th class="text-right" style="width: 12%;">Custo Mat.</th>
                <th class="text-right" style="width: 12%;">Lucro Bruto</th>
                <th class="text-center" style="width: 10%;">Margem %</th>
                <th class="text-center" style="width: 10%;">Markup %</th>
                <th class="text-center" style="width: 8%;">Materiais</th>
                <th class="text-center" style="width: 6%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
            <tr class="{{ $product['margin_status'] === 'critical' ? 'margin-critical' : ($product['margin_status'] === 'low' ? 'margin-low' : '') }}">
                <td>
                    <strong>{{ $product['product_name'] }}</strong>
                    @if($product['product_sku'] !== '-')
                    <br><span style="color: #666;">{{ $product['product_sku'] }}</span>
                    @endif
                </td>
                <td class="text-right">R$ {{ number_format($product['selling_price'], 2, ',', '.') }}</td>
                <td class="text-right">R$ {{ number_format($product['material_cost'], 2, ',', '.') }}</td>
                <td class="text-right">R$ {{ number_format($product['gross_profit'], 2, ',', '.') }}</td>
                <td class="text-center"><strong>{{ number_format($product['gross_margin_percent'], 1) }}%</strong></td>
                <td class="text-center">{{ number_format($product['markup_percent'], 1) }}%</td>
                <td class="text-center">{{ $product['materials_count'] }}</td>
                <td class="text-center">
                    <span class="badge margin-{{ $product['margin_status'] }}">
                        {{ strtoupper($product['margin_status']) }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        BBKits - Relatório de Custos | Página {PAGE_NUM} de {PAGE_COUNT}
    </div>
</body>
</html>
