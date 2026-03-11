<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Custo do Produto - {{ $product->name }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 10px; line-height: 1.4; color: #333; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { font-size: 18px; color: #1e40af; }
        .header .subtitle { font-size: 11px; color: #666; margin-top: 5px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 12px; font-weight: bold; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px; }
        .cost-summary { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 5px; padding: 15px; margin-bottom: 20px; }
        .cost-grid { display: table; width: 100%; }
        .cost-item { display: table-cell; text-align: center; padding: 10px; }
        .cost-value { font-size: 18px; font-weight: bold; }
        .cost-label { font-size: 9px; color: #666; margin-top: 3px; }
        .cost-green { color: #16a34a; }
        .cost-blue { color: #1e40af; }
        .cost-red { color: #dc2626; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #e5e7eb; padding: 6px; text-align: left; font-size: 9px; }
        td { padding: 5px 6px; border-bottom: 1px solid #e5e7eb; font-size: 9px; }
        .text-right { text-align: right; }
        .category-header { background: #1e40af; color: white; padding: 8px; font-weight: bold; margin-top: 15px; }
        .category-total { background: #f3f4f6; font-weight: bold; }
        .pie-section { margin-top: 20px; }
        .pie-item { display: inline-block; margin-right: 15px; margin-bottom: 5px; }
        .pie-color { display: inline-block; width: 12px; height: 12px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }
        .footer { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 8px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $product->name }}</h1>
        <div class="subtitle">Análise de Custo de Produção | Gerado em {{ $generatedAt }}</div>
    </div>

    @if($costData['success'])
    <div class="cost-summary">
        <div class="cost-grid">
            <div class="cost-item">
                <div class="cost-value cost-blue">R$ {{ number_format($costData['selling_price'], 2, ',', '.') }}</div>
                <div class="cost-label">Preço de Venda</div>
            </div>
            <div class="cost-item">
                <div class="cost-value cost-red">R$ {{ number_format($costData['material_cost'], 2, ',', '.') }}</div>
                <div class="cost-label">Custo de Materiais</div>
            </div>
            <div class="cost-item">
                <div class="cost-value cost-green">R$ {{ number_format($costData['gross_profit'], 2, ',', '.') }}</div>
                <div class="cost-label">Lucro Bruto</div>
            </div>
            <div class="cost-item">
                <div class="cost-value cost-green">{{ number_format($costData['gross_margin_percent'], 1) }}%</div>
                <div class="cost-label">Margem Bruta</div>
            </div>
            <div class="cost-item">
                <div class="cost-value">{{ number_format($costData['markup_percent'], 1) }}%</div>
                <div class="cost-label">Markup</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Materiais Utilizados ({{ $costData['materials_count'] }} itens)</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 15%;">Referência</th>
                    <th style="width: 35%;">Material</th>
                    <th class="text-right" style="width: 12%;">Quantidade</th>
                    <th style="width: 8%;">Unidade</th>
                    <th class="text-right" style="width: 15%;">Custo Unit.</th>
                    <th class="text-right" style="width: 15%;">Custo Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($costData['materials'] as $material)
                <tr>
                    <td>{{ $material['material_reference'] ?? '-' }}</td>
                    <td>{{ $material['material_name'] }}</td>
                    <td class="text-right">{{ number_format($material['quantity'], 3, ',', '.') }}</td>
                    <td>{{ $material['unit'] }}</td>
                    <td class="text-right">R$ {{ number_format($material['unit_cost'], 2, ',', '.') }}</td>
                    <td class="text-right"><strong>R$ {{ number_format($material['total_cost'], 2, ',', '.') }}</strong></td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr class="category-total">
                    <td colspan="5" class="text-right">TOTAL:</td>
                    <td class="text-right"><strong>R$ {{ number_format($costData['material_cost'], 2, ',', '.') }}</strong></td>
                </tr>
            </tfoot>
        </table>
    </div>

    @if($categoryBreakdown['success'] && !empty($categoryBreakdown['categories']))
    <div class="section">
        <div class="section-title">Distribuição por Categoria</div>
        @foreach($categoryBreakdown['categories'] as $category)
        <div class="category-header">
            {{ $category['category'] }} - R$ {{ number_format($category['total_cost'], 2, ',', '.') }} ({{ $category['percentage'] }}%)
        </div>
        <table>
            <tbody>
                @foreach($category['materials'] as $material)
                <tr>
                    <td style="width: 50%;">{{ $material['material_name'] }}</td>
                    <td class="text-right" style="width: 25%;">{{ number_format($material['quantity'], 3, ',', '.') }} {{ $material['unit'] }}</td>
                    <td class="text-right" style="width: 25%;">R$ {{ number_format($material['total_cost'], 2, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endforeach
    </div>
    @endif

    @else
    <div style="background: #fef2f2; padding: 20px; border-radius: 5px; text-align: center;">
        <p style="color: #dc2626; font-weight: bold;">{{ $costData['error'] ?? 'Erro ao calcular custo' }}</p>
    </div>
    @endif

    <div class="footer">
        BBKits - Análise de Custo | {{ $product->name }}
    </div>
</body>
</html>
