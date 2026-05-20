<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration settings for the BBkits API endpoints including
    | authentication, rate limiting, and integration settings.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | API Version
    |--------------------------------------------------------------------------
    */
    'version' => '1.0.0',

    /*
    |--------------------------------------------------------------------------
    | API Keys
    |--------------------------------------------------------------------------
    |
    | Valid API keys for external system integration. These keys should be
    | kept secure and rotated regularly.
    |
    */
    // SECURITY FIX: Removed hardcoded default API keys
    // API keys MUST be configured via environment variables - no fallback defaults
    // Having default keys allows attackers to authenticate if env vars are not set
    'keys' => array_filter([
        env('API_KEY_ERP'),
        env('API_KEY_WAREHOUSE'),
        env('API_KEY_MOBILE'),
    ]),

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limits for different API endpoints and user types.
    |
    */
    'rate_limits' => [
        'standard' => [
            'max_attempts' => 100,
            'decay_minutes' => 1,
        ],
        'integration' => [
            'max_attempts' => 1000,
            'decay_minutes' => 1,
        ],
        'bulk' => [
            'max_attempts' => 10,
            'decay_minutes' => 1,
        ],
        'webhook' => [
            'max_attempts' => 5000,
            'decay_minutes' => 1,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */
    'auth' => [
        'token_expiry' => 60 * 24, // 24 hours in minutes
        'refresh_token_expiry' => 60 * 24 * 30, // 30 days in minutes
        'require_api_key_for_integration' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | API Response Format
    |--------------------------------------------------------------------------
    */
    'response' => [
        'include_debug_info' => env('APP_DEBUG', false),
        'default_per_page' => 15,
        'max_per_page' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Integration Settings
    |--------------------------------------------------------------------------
    */
    'integration' => [
        'allowed_external_systems' => [
            'erp_system',
            'warehouse_management',
            'mobile_app',
            'analytics_platform',
        ],
        'webhook_verification' => [
            'enabled' => true,
            // SECURITY FIX: Removed hardcoded default webhook secret
            // Webhook secret MUST be configured via environment variable
            'secret' => env('WEBHOOK_SECRET'),
        ],
        'sync_batch_size' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Validation Rules
    |--------------------------------------------------------------------------
    */
    'validation' => [
        'external_id_format' => '/^[a-zA-Z0-9_-]{1,50}$/',
        'reference_format' => '/^[a-zA-Z0-9_-]{1,100}$/',
        'max_bulk_operations' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    */
    'logging' => [
        'log_all_requests' => env('API_LOG_REQUESTS', false),
        'log_rate_limit_hits' => true,
        'log_authentication_failures' => true,
        'log_integration_calls' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Security
    |--------------------------------------------------------------------------
    */
    'security' => [
        'require_https' => env('API_REQUIRE_HTTPS', false),
        'cors_enabled' => true,
        'allowed_origins' => [
            'http://localhost:3000',
            'https://app.bbkits.com',
            'https://admin.bbkits.com',
        ],
        'ip_whitelist' => [
            // Add trusted IP addresses for integration endpoints
        ],
    ],
];