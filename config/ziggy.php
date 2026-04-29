<?php

/**
 * Ziggy Configuration
 *
 * BUG-FIX: Only expose necessary routes to frontend.
 * Hides API routes to prevent infrastructure disclosure.
 */

return [
    /*
     * Exclude API routes from being exposed in JavaScript
     */
    'except' => [
        'api.*',
        'sanctum.*',
        'ignition.*',
        'telescope.*',
        'horizon.*',
        'debugbar.*',
    ],
];
