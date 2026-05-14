<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Página Não Encontrada</title>
    <style nonce="{{ \Illuminate\Support\Facades\Vite::cspNonce() }}">
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container { text-align: center; padding: 2.5rem; }
        h1 { font-size: 2.25rem; font-weight: bold; color: #4b5563; margin-bottom: 1rem; }
        p { color: #6b7280; margin-bottom: 1.5rem; }
        a { color: #2563eb; text-decoration: underline; }
        a:hover { color: #1d4ed8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 - Página Não Encontrada</h1>
        <p>O recurso solicitado não foi encontrado.</p>
        <a href="{{ url('/') }}">Voltar para o início</a>
    </div>
</body>
</html>
