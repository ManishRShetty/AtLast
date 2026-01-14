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
                'neon-cyan': '#00FFFF',
                'deep-black': '#000000',
                'neon-teal': '#00FFFF',
                'deep-blue': '#0000FF',
            },
            animation: {
                'glitch': 'glitch 1s linear infinite',
                'blink': 'blink 1s step-end infinite',
            },
            keyframes: {
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
            },
        },
        plugins: [],
    }
};
export default config;
