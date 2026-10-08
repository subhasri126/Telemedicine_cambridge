/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#F0F9FF',
                    100: '#E0F2FE',
                    200: '#BAE6FD',
                    300: '#7DD3FC',
                    400: '#38BDF8',
                    500: '#0284C7', // Medical Blue Primary
                    600: '#0369A1',
                    700: '#075985',
                    800: '#0C4A6E',
                    900: '#0F172A', // Deep Navy
                },
                teal: {
                    50: '#F0FDFA',
                    100: '#CCFBF1',
                    500: '#14B8A6',
                    600: '#0D9488', // Deep Teal
                    700: '#0F766E',
                },
                emergency: {
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    500: '#EF4444',
                    600: '#DC2626', // Emergency Red
                    700: '#B91C1C',
                },
                medical: {
                    bg: '#F8FAFC',
                    card: '#FFFFFF',
                    navy: '#0F172A',
                    blue: '#0284C7',
                    teal: '#0D9488',
                    green: '#16A34A',
                    cyan: '#E0F2FE',
                    amber: '#D97706',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'medical': '0 4px 20px -2px rgba(2, 132, 199, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
                'medical-lg': '0 12px 30px -4px rgba(2, 132, 199, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
                'emergency': '0 0 20px rgba(220, 38, 38, 0.35)',
            },
            animation: {
                'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            }
        },
    },
    plugins: [],
}
