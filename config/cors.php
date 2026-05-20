<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | SECURITY FIX: Configure specific allowed origins instead of wildcards.
    | Using '*' for allowed_origins is a critical security vulnerability.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // SECURITY: Only allow specific trusted origins
    // Add your production domain(s) here
    'allowed_origins' => array_filter([
        env('APP_URL'),
        env('FRONTEND_URL'),
        // Add additional trusted origins via environment variable
        // e.g., CORS_ALLOWED_ORIGINS=https://app.example.com,https://admin.example.com
        ...explode(',', env('CORS_ALLOWED_ORIGINS', '')),
    ]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Authorization',
        'X-API-Key',
        'X-CSRF-TOKEN',
        'Accept',
        'Origin',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
