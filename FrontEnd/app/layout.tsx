import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const firaCode = Fira_Code({
    subsets: ['latin'],
    variable: '--font-fira-code',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'NetRunner Command Center',
    description: 'A cyberpunk-style global intelligence game powered by Gemini AI',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    );
}
