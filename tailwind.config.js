/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'display': ['Orbitron', 'sans-serif'],
                'main': ['Rajdhani', 'sans-serif'],
                'mono': ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                'cyan': {
                    DEFAULT: '#00f0ff',
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#00f0ff', // Primary neon-cyan
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                    950: '#083344',
                },
            }
        },
    },
    plugins: [],
}
