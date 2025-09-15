<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mudança de Estoque: {{ $material->name }}</title>
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
            background: {{ $isIncrease ? '#059669' : '#dc2626' }};
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
        .change-summary {
            background: {{ $isIncrease ? '#f0fdfa' : '#fef2f2' }};
            border-left: 4px solid {{ $isIncrease ? '#059669' : '#dc2626' }};
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .material-card {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .material-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .material-name {
            font-size: 20px;
            font-weight: 600;
            color: #111827;
        }
        .material-ref {
            font-size: 14px;
            color: #6b7280;
        }
        .stock-comparison {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 25px 0;
            padding: 20px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .stock-item {
            text-align: center;
            flex: 1;
        }
        .stock-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .stock-value {
            font-size: 24px;
            font-weight: bold;
            color: #111827;
        }
        .arrow {
            font-size: 30px;
            color: {{ $isIncrease ? '#059669' : '#dc2626' }};
            margin: 0 20px;
        }
        .change-indicator {
            text-align: center;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            background: {{ $isIncrease ? '#f0fdfa' : '#fef2f2' }};
            border: 1px solid {{ $isIncrease ? '#a7f3d0' : '#fca5a5' }};
        }
        .change-value {
            font-size: 20px;
            font-weight: bold;
            color: {{ $isIncrease ? '#059669' : '#dc2626' }};
        }
        .change-percentage {
            font-size: 14px;
            color: #6b7280;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .info-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value {
            font-weight: 600;
            color: #111827;
        }
        .reason-box {
            background: #fffbeb;
            border: 1px solid #fbbf24;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
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
        .alert-banner {
            background: #fbbf24;
            color: #92400e;
            padding: 10px;
            text-align: center;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        @if($isSignificant)
        <div class="alert-banner">
            ⚡ Mudança Significativa Detectada ({{ number_format(abs($changePercentage), 1) }}%)
        </div>
        @endif

        <div class="header">
            <h1>
                📊 {{ $isIncrease ? 'Aumento' : 'Diminuição' }} de Estoque
            </h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">
                {{ now()->format('d/m/Y H:i') }}
            </p>
        </div>

        <div class="content">
            <div class="change-summary">
                <strong>Resumo da Mudança:</strong><br>
                O estoque do material <strong>{{ $material->name }}</strong>
                {{ $isIncrease ? 'aumentou' : 'diminuiu' }} em
                <strong>{{ number_format(abs($change), 3, ',', '.') }} {{ $material->unit }}</strong>
                ({{ $isIncrease ? '+' : '-' }}{{ number_format(abs($changePercentage), 1) }}%).
            </div>

            <div class="material-card">
                <div class="material-header">
                    <div>
                        <div class="material-name">{{ $material->name }}</div>
                        <div class="material-ref">Ref: {{ $material->reference }}</div>
                        @if($material->category)
                            <div class="material-ref">Categoria: {{ $material->category->name }}</div>
                        @endif
                    </div>
                </div>

                <div class="stock-comparison">
                    <div class="stock-item">
                        <div class="stock-label">Estoque Anterior</div>
                        <div class="stock-value">{{ number_format($oldStock, 3, ',', '.') }}</div>
                        <div style="font-size: 12px; color: #6b7280;">{{ $material->unit }}</div>
                    </div>

                    <div class="arrow">
                        {{ $isIncrease ? '→' : '→' }}
                    </div>

                    <div class="stock-item">
                        <div class="stock-label">Estoque Atual</div>
                        <div class="stock-value" style="color: {{ $isIncrease ? '#059669' : '#dc2626' }};">
                            {{ number_format($newStock, 3, ',', '.') }}
                        </div>
                        <div style="font-size: 12px; color: #6b7280;">{{ $material->unit }}</div>
                    </div>
                </div>

                <div class="change-indicator">
                    <div class="change-value">
                        {{ $isIncrease ? '+' : '-' }}{{ number_format(abs($change), 3, ',', '.') }} {{ $material->unit }}
                    </div>
                    <div class="change-percentage">
                        ({{ $isIncrease ? '+' : '-' }}{{ number_format(abs($changePercentage), 1) }}%)
                    </div>
                </div>

                @if($reason)
                <div class="reason-box">
                    <strong>Motivo da Mudança:</strong><br>
                    {{ $reason }}
                </div>
                @endif

                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Estoque Mínimo</div>
                        <div class="info-value">{{ number_format($material->minimum_stock, 3, ',', '.') }} {{ $material->unit }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Status Atual</div>
                        <div class="info-value" style="color:
                            @if($newStock <= 0) #dc2626
                            @elseif($newStock <= $material->minimum_stock) #f59e0b
                            @else #059669
                            @endif">
                            @if($newStock <= 0)
                                🚫 Sem Estoque
                            @elseif($newStock <= $material->minimum_stock)
                                ⚠️ Estoque Baixo
                            @else
                                ✅ Estoque OK
                            @endif
                        </div>
                    </div>
                    @if($material->supplier)
                    <div class="info-item">
                        <div class="info-label">Fornecedor</div>
                        <div class="info-value">{{ $material->supplier->name }}</div>
                    </div>
                    @endif
                    <div class="info-item">
                        <div class="info-label">Preço Unitário</div>
                        <div class="info-value">{{ number_format($material->purchase_price, 2, ',', '.') }}</div>
                    </div>
                </div>

                @if($newStock <= $material->minimum_stock)
                <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 15px; margin-top: 15px;">
                    <strong style="color: #dc2626;">⚠️ Atenção:</strong>
                    O estoque atual está {{ $newStock <= 0 ? 'zerado' : 'abaixo do mínimo recomendado' }}.
                    Considere reabastecer este material.
                </div>
                @endif
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/admin/materials/{{ $material->id }}" class="action-button">
                    Ver Detalhes do Material
                </a>
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