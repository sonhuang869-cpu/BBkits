<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Acesso Negado</title>
    @vite(['resources/css/app.css'])
</head>
<body class="font-sans antialiased bg-gray-100">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center py-10">
            <h1 class="text-4xl font-bold text-red-600">403 - Acesso Negado</h1>
            <p class="mt-4 text-gray-600">Você não tem permissão para acessar esta página.</p>
            <a href="{{ url()->previous() }}" class="mt-6 inline-block text-blue-600 underline hover:text-blue-800">Voltar</a>
        </div>
    </div>
</body>
</html>
