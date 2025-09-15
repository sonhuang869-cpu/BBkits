<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $isOutOfStock ? 'Materiais Sem Estoque' : 'Alerta de Estoque Baixo' }}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: {{ $isOutOfStock ? '#dc2626' : '#f59e0b' }};
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
        }
        .alert-summary {
            background: {{ $isOutOfStock ? '#fef2f2' : '#fffbeb' }};
            border-left: 4px solid {{ $isOutOfStock ? '#dc2626' : '#f59e0b' }};
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            text-align: center;
        }
        .stat {
            flex: 1;
        }
        .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: {{ $isOutOfStock ? '#dc2626' : '#f59e0b' }};
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
        .materials-list {
            background: #f9fafb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .material-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .material-item:last-child {
            border-bottom: none;
        }
        .material-info {
            flex: 1;
        }
        .material-name {
            font-weight: 600;
            color: #111827;
        }
        .material-ref {
            font-size: 12px;
            color: #6b7280;
        }
        .stock-info {
            text-align: right;
        }
        .current-stock {
            font-weight: 600;
            color: {{ $isOutOfStock ? '#dc2626' : '#f59e0b' }};
        }
        .minimum-stock {
            font-size: 12px;
            color: #6b7280;
        }
        .severity-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .critical { background: #fecaca; color: #991b1b; }
        .low { background: #fed7aa; color: #9a3412; }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .action-button {
            display: inline-block;
            background: #7c3aed;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                {{ $isOutOfStock ? '🚨 Materiais Sem Estoque' : '⚠️ Alerta de Estoque Baixo' }}
            </h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">
                {{ now()->format('d/m/Y H:i') }}
            </p>
        </div>

        <div class="content">
            <div class="alert-summary">
                <strong>Resumo do Alerta:</strong><br>
                @if($isOutOfStock)
                    {{ $totalCount }} materiais estão completamente sem estoque e precisam de reposição urgente.
                @else
                    {{ $totalCount }} materiais estão com estoque abaixo do nível mínimo recomendado.
                @endif
            </div>

            <div class="stats">
                @if(!$isOutOfStock && $criticalCount > 0)
                <div class="stat">
                    <div class="stat-number" style="color: #dc2626;">{{ $criticalCount }}</div>
                    <div class="stat-label">Sem Estoque</div>
                </div>
                @endif
                <div class="stat">
                    <div class="stat-number">{{ $lowCount }}</div>
                    <div class="stat-label">Estoque Baixo</div>
                </div>
                <div class="stat">
                    <div class="stat-number">{{ $totalCount }}</div>
                    <div class="stat-label">Total</div>
                </div>
            </div>

            <h3>Materiais Afetados:</h3>
            <div class="materials-list">
                @foreach($materials->take(10) as $material)
                <div class="material-item">
                    <div class="material-info">
                        <div class="material-name">{{ $material->name }}</div>
                        <div class="material-ref">Ref: {{ $material->reference }}</div>
                        @if($material->category)
                            <div class="material-ref">Categoria: {{ $material->category->name }}</div>
                        @endif
                        @if($material->supplier)
                            <div class="material-ref">Fornecedor: {{ $material->supplier->name }}</div>
                        @endif
                    </div>
                    <div class="stock-info">
                        <div class="current-stock">
                            {{ number_format($material->current_stock, 3, ',', '.') }} {{ $material->unit }}
                        </div>
                        <div class="minimum-stock">
                            Mín: {{ number_format($material->minimum_stock, 3, ',', '.') }} {{ $material->unit }}
                        </div>
                        @if($material->current_stock <= 0)
                            <span class="severity-badge critical">Crítico</span>
                        @else
                            <span class="severity-badge low">Baixo</span>
                        @endif
                    </div>
                </div>
                @endforeach

                @if($materials->count() > 10)
                <div style="text-align: center; padding: 15px 0; color: #6b7280;">
                    ... e mais {{ $materials->count() - 10 }} materiais
                </div>
                @endif
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/admin/reports/low-stock-alerts" class="action-button">
                    Ver Relatório Completo
                </a>
            </div>

            <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <strong>💡 Recomendações:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Verifique os fornecedores dos materiais críticos</li>
                    <li>Confirme os tempos de entrega atuais</li>
                    <li>Considere aumentar os estoques mínimos para materiais de alta rotatividade</li>
                    <li>Agende as compras necessárias o quanto antes</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>
                Este é um alerta automático do sistema de gestão de materiais.<br>
                <strong>{{ config('app.name') }}</strong> | {{ now()->format('d/m/Y H:i') }}
            </p>
        </div>
    </div>
</body>
</html>