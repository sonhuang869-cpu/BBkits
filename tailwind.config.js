import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Navy & Soft Gold Theme
                navy: {
                    50: '#EEF2F6',
                    100: '#D5DEE8',
                    200: '#A8BDCF',
                    300: '#7A9AB5',
                    400: '#4D789C',
                    500: '#2D5A82',
                    600: '#1E3A5F',  // Primary
                    700: '#152C4A',
                    800: '#0D1E35',
                    900: '#061020',
                },
                gold: {
                    50: '#FBF7F2',
                    100: '#F5ECE0',
                    200: '#EBD9C1',
                    300: '#E1C6A2',
                    400: '#D4A574',  // Accent
                    500: '#C4915A',
                    600: '#B8956A',
                    700: '#9A7A54',
                    800: '#7C5F3E',
                    900: '#5E4428',
                },
            },
        },
    },

    plugins: [forms],
};
