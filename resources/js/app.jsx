import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

// Import Ziggy for routing
import { Ziggy } from './ziggy';

// ULTRA-DEFENSIVE route helper that can NEVER EVER return null or undefined
function route(name, params = {}, absolute = false) {
    // Triple-layer safety net - this function can NEVER fail
    try {
        // Layer 1: Input validation
        if (!name || typeof name !== 'string') {
            console.warn('Invalid route name provided:', name);
            return createRouteObject('/dashboard', ['GET', 'HEAD']);
        }

        let url = '';

        try {
            // Layer 2: Route resolution
            const routeData = (window.Ziggy && window.Ziggy.routes && window.Ziggy.routes[name]) ||
                             (Ziggy && Ziggy.routes && Ziggy.routes[name]);

            if (routeData && routeData.uri) {
                url = routeData.uri;

                // Parameter replacement with safety
                if (params && typeof params === 'object') {
                    Object.keys(params).forEach(key => {
                        try {
                            const value = params[key];
                            if (value !== undefined && value !== null && value !== '') {
                                url = url.replace(`{${key}}`, String(value));
                                url = url.replace(`{${key}?}`, String(value));
                            }
                        } catch (e) {
                            console.warn('Parameter replacement error for key:', key, e);
                        }
                    });
                }

                // Clean up optional parameters
                url = url.replace(/\{[^}]+\?\}/g, '');

                // Ensure leading slash
                if (!url.startsWith('/')) {
                    url = '/' + url;
                }

                // Handle absolute URLs
                if (absolute) {
                    try {
                        const baseUrl = (window.Ziggy && window.Ziggy.url) || (Ziggy && Ziggy.url) || '';
                        if (baseUrl) {
                            url = baseUrl.replace(/\/$/, '') + url;
                        }
                    } catch (e) {
                        console.warn('Base URL handling error:', e);
                    }
                }

                // Return with route methods
                const methods = (routeData.methods && Array.isArray(routeData.methods)) ? routeData.methods : ['GET', 'HEAD'];
                return createRouteObject(url, methods);
            } else {
                // Fallback route generation
                console.warn('Route not found in Ziggy, using fallback for:', name);
                if (name.includes('.')) {
                    const parts = name.split('.');
                    if (parts[parts.length - 1] === 'index') {
                        parts.pop();
                    }
                    url = '/' + parts.join('/');
                } else {
                    url = `/${name}`;
                }
            }
        } catch (error) {
            // Layer 3: Error recovery
            console.error('Route resolution error:', error, 'for route:', name);
            url = '/' + String(name).replace(/\./g, '/');
        }

        // Final validation and fallback
        if (!url || typeof url !== 'string' || url.length === 0) {
            console.error('Route function generated invalid URL:', url, 'for:', name);
            url = '/dashboard';
        }

        return createRouteObject(url, ['GET', 'HEAD']);

    } catch (error) {
        // Ultimate safety net - this should NEVER be reached
        console.error('CRITICAL: Route function completely failed:', error, 'for route:', name);
        return createRouteObject('/dashboard', ['GET', 'HEAD']);
    }
}

// ULTRA-DEFENSIVE helper function to create route objects that can NEVER be null
function createRouteObject(url, methods = ['GET', 'HEAD']) {
    try {
        // Ensure url is always a valid string
        const safeUrl = (url && typeof url === 'string') ? url : '/dashboard';

        // Ensure methods is always a valid array
        const safeMethods = (methods && Array.isArray(methods) && methods.length > 0) ? methods : ['GET', 'HEAD'];

        const routeObj = {
            url: safeUrl,
            method: safeMethods[0] || 'GET', // ALWAYS have a method property
            methods: safeMethods,
            toString: function() { return safeUrl; },
            valueOf: function() { return safeUrl; }
        };

        // Add Symbol.toPrimitive for string coercion
        routeObj[Symbol.toPrimitive] = function(hint) {
            return safeUrl;
        };

        // Additional safety: ensure method property is never null/undefined
        Object.defineProperty(routeObj, 'method', {
            get: function() {
                return safeMethods[0] || 'GET';
            },
            enumerable: true,
            configurable: false
        });

        return routeObj;
    } catch (error) {
        // Emergency fallback object
        console.error('CRITICAL: createRouteObject failed:', error);
        return {
            url: '/dashboard',
            method: 'GET',
            methods: ['GET', 'HEAD'],
            toString: function() { return '/dashboard'; },
            valueOf: function() { return '/dashboard'; }
        };
    }
}

// Make route function available globally immediately
window.route = route;

// Also ensure it's available in global scope for modules
globalThis.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Set up Ziggy for routes
        if (props.initialPage && props.initialPage.props.ziggy) {
            window.Ziggy = props.initialPage.props.ziggy;
        } else if (Ziggy) {
            window.Ziggy = Ziggy;
        }

        // Debug: log available routes in development
        if (process.env.NODE_ENV === 'development' && window.Ziggy) {
            console.log('Ziggy routes loaded:', Object.keys(window.Ziggy.routes || {}));
        }

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#fff',
                            color: '#374151',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </>
        );
    },
    progress: {
        color: '#ec4899',
    },
});
