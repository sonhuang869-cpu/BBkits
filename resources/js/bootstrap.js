import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Ensure route function is always available as a fallback
if (typeof window.route === 'undefined') {
    window.route = function(name, params = {}, absolute = false) {
        // Emergency fallback that never returns null
        const url = name ? ('/' + name.replace(/\./g, '/')) : '/';
        return {
            url: url,
            method: 'GET',
            methods: ['GET', 'HEAD'],
            toString: () => url,
            valueOf: () => url,
            [Symbol.toPrimitive]: () => url
        };
    };
}
