<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Corte</title>
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
            padding: 20px 0;
            border-bottom: 2px solid #6b21a8;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
            color: #6b21a8;
            margin-bottom: 5px;
        }

        .header .subtitle {
            font-size: 12px;
            color: #666;
        }

        .meta-info {
            display: table;
            width: 100%;
            margin-bottom: 20px;
            font-size: 9px;
        }

        .meta-info .left {
            display: table-cell;
            width: 50%;
        }

        .meta-info .right {
            display: table-cell;
            width: 50%;
            text-align: right;
        }

        .summary {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f3f4f6;
            border-radius: 5px;
        }

        .summary h2 {
            font-size: 14px;
            color: #374151;
            margin-bottom: 10px;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 5px;
        }

        .summary-grid {
            display: table;
            width: 100%;
        }

        .summary-item {
            display: table-cell;
            width: 25%;
            text-align: center;
            padding: 10px;
        }

        .summary-item .label {
            font-size: 9px;
            color: #6b7280;
            text-transform: uppercase;
        }

        .summary-item .value {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
        }

        .category-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .category-header {
            background-color: #6b21a8;
            color: white;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        table th {
            background-color: #f9fafb;
            padding: 8px 10px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
            color: #374151;
            text-transform: uppercase;
            border: 1px solid #e5e7eb;
        }

        table td {
            padding: 8px 10px;
            border: 1px solid #e5e7eb;
            font-size: 10px;
        }

        table tr:nth-child(even) {
            background-color: #f9fafb;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .font-bold {
            font-weight: bold;
        }

        .text-red {
            color: #dc2626;
        }

        .text-green {
            color: #16a34a;
        }

        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
        }

        .status-ok {
            background-color: #dcfce7;
            color: #166534;
        }

        .status-warning {
            background-color: #fef3c7;
            color: #92400e;
        }

        .status-danger {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .orders-section {
            margin-top: 30px;
            page-break-before: always;
        }

        .orders-section h2 {
            font-size: 14px;
            color: #374151;
            margin-bottom: 15px;
            border-bottom: 2px solid #6b21a8;
            padding-bottom: 5px;
        }

        .order-card {
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            margin-bottom: 10px;
            page-break-inside: avoid;
        }

        .order-card-header {
            background-color: #f3f4f6;
            padding: 8px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-weight: bold;
        }

        .order-card-body {
            padding: 10px 12px;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
            padding: 10px;
            border-top: 1px solid #e5e7eb;
        }

        .page-break {
            page-break-before: always;
        }

        .checkbox {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid #6b7280;
            border-radius: 3px;
            vertical-align: middle;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>LISTA DE CORTE</h1>
        <div class="subtitle">BBKits - Sistema de Gestao de Producao</div>
    </div>

    <!-- Meta Info -->
    <div class="meta-info">
        <div class="left">
            <strong>Gerado em:</strong> {{ $generatedAt }}<br>
            <strong>Gerado por:</strong> {{ $generatedBy }}
        </div>
        <div class="right">
            <strong>Total de Pedidos:</strong> {{ $cuttingList['summary']['total_orders'] ?? 0 }}<br>
            <strong>Total de Materiais:</strong> {{ $cuttingList['summary']['total_materials'] ?? 0 }}
        </div>
    </div>

    <!-- Summary -->
    <div class="summary">
        <h2>Resumo</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="label">Pedidos</div>
                <div class="value">{{ $cuttingList['summary']['total_orders'] ?? 0 }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Materiais</div>
                <div class="value">{{ $cuttingList['summary']['total_materials'] ?? 0 }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Produtos</div>
                <div class="value">{{ $cuttingList['summary']['unique_products'] ?? 0 }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Estoque Insuficiente</div>
                <div class="value text-red">{{ $cuttingList['summary']['materials_with_insufficient_stock'] ?? 0 }}</div>
            </div>
        </div>
    </div>

    <!-- Materials by Category -->
    @if($groupedMaterials)
        @foreach($groupedMaterials as $category)
            <div class="category-section">
                <div class="category-header">
                    {{ $category['category_name'] }} ({{ $category['total_items'] }} itens)
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 30px;"></th>
                            <th>Material</th>
                            <th>Referencia</th>
                            <th class="text-right">Qtd Necessaria</th>
                            <th class="text-right">Estoque Atual</th>
                            <th class="text-center">Status</th>
                            <th class="text-center">Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($category['materials'] as $material)
                            @php
                                $insufficient = $material['total_quantity'] > $material['current_stock'];
                                $low = !$insufficient && ($material['total_quantity'] > $material['current_stock'] * 0.8);
                            @endphp
                            <tr>
                                <td><span class="checkbox"></span></td>
                                <td class="font-bold">{{ $material['material_name'] }}</td>
                                <td>{{ $material['material_reference'] ?? '-' }}</td>
                                <td class="text-right font-bold">{{ number_format($material['total_quantity'], 3, ',', '.') }} {{ $material['unit'] }}</td>
                                <td class="text-right {{ $insufficient ? 'text-red' : '' }}">{{ number_format($material['current_stock'], 3, ',', '.') }} {{ $material['unit'] }}</td>
                                <td class="text-center">
                                    @if($insufficient)
                                        <span class="status-badge status-danger">INSUFICIENTE</span>
                                    @elseif($low)
                                        <span class="status-badge status-warning">BAIXO</span>
                                    @else
                                        <span class="status-badge status-ok">OK</span>
                                    @endif
                                </td>
                                <td class="text-center">{{ $material['order_count'] }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endforeach
    @else
        <!-- All Materials (ungrouped) -->
        <table>
            <thead>
                <tr>
                    <th style="width: 30px;"></th>
                    <th>Material</th>
                    <th>Categoria</th>
                    <th class="text-right">Qtd Necessaria</th>
                    <th class="text-right">Estoque Atual</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Pedidos</th>
                </tr>
            </thead>
            <tbody>
                @foreach($cuttingList['materials'] as $material)
                    @php
                        $insufficient = $material['total_quantity'] > $material['current_stock'];
                    @endphp
                    <tr>
                        <td><span class="checkbox"></span></td>
                        <td class="font-bold">{{ $material['material_name'] }}</td>
                        <td>{{ $material['material_category'] }}</td>
                        <td class="text-right font-bold">{{ number_format($material['total_quantity'], 3, ',', '.') }} {{ $material['unit'] }}</td>
                        <td class="text-right {{ $insufficient ? 'text-red' : '' }}">{{ number_format($material['current_stock'], 3, ',', '.') }} {{ $material['unit'] }}</td>
                        <td class="text-center">
                            @if($insufficient)
                                <span class="status-badge status-danger">INSUFICIENTE</span>
                            @else
                                <span class="status-badge status-ok">OK</span>
                            @endif
                        </td>
                        <td class="text-center">{{ $material['order_count'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <!-- Order Details -->
    @if(!empty($cuttingList['order_details']))
        <div class="orders-section">
            <h2>Detalhes dos Pedidos</h2>
            @foreach($cuttingList['order_details'] as $order)
                <div class="order-card">
                    <div class="order-card-header">
                        Pedido #{{ $order['sale_id'] }} - {{ $order['client_name'] }} ({{ $order['created_at'] }})
                    </div>
                    <div class="order-card-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th class="text-center">Qtd</th>
                                    <th class="text-center">Tamanho</th>
                                    <th class="text-center">Cor</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($order['products'] as $product)
                                    <tr>
                                        <td>{{ $product['product_name'] }}</td>
                                        <td class="text-center">{{ $product['quantity'] }}</td>
                                        <td class="text-center">{{ $product['size'] ?? '-' }}</td>
                                        <td class="text-center">{{ $product['color'] ?? '-' }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @endforeach
        </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        BBKits - Lista de Corte | Gerado em {{ $generatedAt }} | Pagina {PAGE_NUM} de {PAGE_COUNT}
    </div>
</body>
</html>
