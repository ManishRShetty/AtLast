import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
                display: ['var(--font-rajdhani)', 'sans-serif'],
            },
            colors: {
                glass: {
                    dark: 'rgba(20, 20, 20, 0.65)',
                    light: 'rgba(255, 255, 255, 0.65)',
                },
            },
        },
    },
    plugins: [],
};

export default config;
