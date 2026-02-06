/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {
            fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    500: '#0071e3',
                    600: '#005bb5',
                    700: '#004487',
                    800: '#1d1d1f',
                    900: '#0a0a0b',
                },
                surface: {
                    50: '#f5f5f7',
                    100: '#e8e8ed',
                    200: '#d2d2d7',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'pop': 'pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
            },
            keyframes: {
                fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
                slideUp: { from: { transform: 'translateY(15px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
                pop: { '0%': { transform: 'scale(0.5)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
            }
        },
    },
    plugins: [],
}
