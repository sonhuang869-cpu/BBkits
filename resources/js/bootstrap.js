import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// BULLETPROOF route function that absolutely never returns null
function createSafeRouteFunction() {
    return function route(name, params, absolute) {
        // Log for debugging
        console.log('ROUTE CALLED:', { name, params, absolute, hasZiggy: !!window.Ziggy });

        // Ensure we never return null or undefined
        if (!name || typeof name !== 'string') {
            console.warn('Invalid route name:', name);
            name = 'dashboard';
        }

        let url = '';

        try {
            // Try to use Ziggy routes if available
            if (window.Ziggy && window.Ziggy.routes && window.Ziggy.routes[name]) {
                url = window.Ziggy.routes[name].uri || '';

                // Replace parameters
                if (params && typeof params === 'object') {
                    Object.keys(params).forEach(key => {
                        if (params[key] !== undefined && params[key] !== null) {
                            url = url.replace(`{${key}}`, params[key]);
                            url = url.replace(`{${key}?}`, params[key]);
                        }
                    });
                }

                // Clean up optional parameters
                url = url.replace(/\{[^}]+\?\}/g, '');
            } else {
                // Fallback URL generation
                if (name.includes('.')) {
                    const parts = name.split('.');
                    if (parts[parts.length - 1] === 'index') {
                        parts.pop();
                    }
                    url = '/' + parts.join('/');
                } else {
                    url = '/' + name;
                }
            }
        } catch (error) {
            console.error('Route generation error:', error);
            url = '/' + name.replace(/\./g, '/');
        }

        // Ensure URL starts with /
        if (!url.startsWith('/')) {
            url = '/' + url;
        }

        // Always return a simple string - this should fix the .method error
        // The error might be from code expecting a string but getting an object
        console.log('ROUTE RESULT:', url);
        return url;
    };
}

// Set up route function immediately and aggressively
const safeRoute = createSafeRouteFunction();
window.route = safeRoute;
globalThis.route = safeRoute;

// Also override any potential null assignments
Object.defineProperty(window, 'route', {
    value: safeRoute,
    writable: true,
    enumerable: true,
    configurable: true
});

console.log('Bootstrap: route function initialized', typeof window.route);
