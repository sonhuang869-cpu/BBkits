<?php

/**
 * Ziggy Configuration
 *
 * BUG-FIX: Only expose necessary routes to frontend.
 * Hides API routes to prevent infrastructure disclosure.
 */

return [
    /*
     * Only include routes matching these patterns.
     * This prevents API routes from being exposed in the frontend JavaScript.
     */
    'only' => [
        'login',
        'logout',
        'register',
        'password.*',
        'verification.*',
        'dashboard',
        'profile.*',
        'sales.*',
        'payments.*',
        'admin.*',
        'finance.*',
        'production.*',
        'manager.*',
        'notifications.*',
        'reports.*',
        'pending-approval',
    ],

    /*
     * Exclude these patterns (API routes expose infrastructure)
     */
    'except' => [
        'api.*',
        'sanctum.*',
        'ignition.*',
        'telescope.*',
        'horizon.*',
    ],

    /*
     * Group routes under a specific key
     */
    'groups' => [],

    /*
     * Skip route model binding checks
     */
    'skip-route-function' => false,
];
