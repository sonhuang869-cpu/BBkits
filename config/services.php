<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Tiny ERP Integration
    |--------------------------------------------------------------------------
    */
    'tiny_erp' => [
        'base_url' => env('TINY_ERP_BASE_URL', 'https://api.tiny.com.br/api2'),
        'token' => env('TINY_ERP_TOKEN'),
        'webhook_secret' => env('TINY_ERP_WEBHOOK_SECRET'), // BUG-D02: For validating incoming webhooks

        // Sender information for shipping labels
        'sender_address' => env('TINY_ERP_SENDER_ADDRESS', 'Rua BBKits, 123'),
        'sender_number' => env('TINY_ERP_SENDER_NUMBER', '123'),
        'sender_complement' => env('TINY_ERP_SENDER_COMPLEMENT', ''),
        'sender_neighborhood' => env('TINY_ERP_SENDER_NEIGHBORHOOD', 'Centro'),
        'sender_city' => env('TINY_ERP_SENDER_CITY', 'São Paulo'),
        'sender_state' => env('TINY_ERP_SENDER_STATE', 'SP'),
        'sender_zipcode' => env('TINY_ERP_SENDER_ZIPCODE', '01000-000'),
        'sender_phone' => env('TINY_ERP_SENDER_PHONE', '(11) 99999-9999'),
        
        // Default settings
        'default_shipping_service' => env('TINY_ERP_SHIPPING_SERVICE', 'correios_pac'),
        'default_package_weight' => env('TINY_ERP_PACKAGE_WEIGHT', 0.2), // kg
        'default_package_length' => env('TINY_ERP_PACKAGE_LENGTH', 20), // cm
        'default_package_width' => env('TINY_ERP_PACKAGE_WIDTH', 15), // cm
        'default_package_height' => env('TINY_ERP_PACKAGE_HEIGHT', 5), // cm
    ],

    /*
    |--------------------------------------------------------------------------
    | WhatsApp/WATI Integration
    |--------------------------------------------------------------------------
    */
    'wati' => [
        'base_url' => env('WATI_BASE_URL', 'https://live-server-113671.wati.io/api/v1'),
        'access_token' => env('WATI_ACCESS_TOKEN'),
        'instance_id' => env('WATI_INSTANCE_ID'),
        'webhook_secret' => env('WATI_WEBHOOK_SECRET'), // BUG-D02: For validating incoming webhooks

        // Message templates
        'templates' => [
            'order_confirmation' => env('WATI_TEMPLATE_ORDER_CONFIRMATION', 'order_confirmation'),
            'payment_approved' => env('WATI_TEMPLATE_PAYMENT_APPROVED', 'payment_approved'),
            'production_started' => env('WATI_TEMPLATE_PRODUCTION_STARTED', 'production_started'),
            'photo_approval' => env('WATI_TEMPLATE_PHOTO_APPROVAL', 'photo_approval'),
            'order_shipped' => env('WATI_TEMPLATE_ORDER_SHIPPED', 'order_shipped'),
            'payment_rejected' => env('WATI_TEMPLATE_PAYMENT_REJECTED', 'payment_rejected'),
            'final_payment_reminder' => env('WATI_TEMPLATE_FINAL_PAYMENT_REMINDER', 'final_payment_reminder'),
        ],
        
        // Messaging settings
        'enabled' => env('WATI_ENABLED', true),
        'fallback_to_text' => env('WATI_FALLBACK_TO_TEXT', true),
        'retry_attempts' => env('WATI_RETRY_ATTEMPTS', 3),
        'timeout_seconds' => env('WATI_TIMEOUT_SECONDS', 30),
    ],

];
