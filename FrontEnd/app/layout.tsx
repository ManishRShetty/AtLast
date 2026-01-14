import type { Metadata } from 'next';
import { Inter, Fira_Code, Rajdhani } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import SecurityLayer from '../components/SecurityLayer';
import { AuthProvider } from '../context/AuthContext';
import SoundEffects from '../components/SoundEffects';

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

const rajdhani = Rajdhani({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-rajdhani',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Operation AtLast',
    description: 'A cyberpunk-style global intelligence game powered by Gemini AI',
    icons: {
        icon: '/SVG/logoicon.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${firaCode.variable} ${rajdhani.variable} font-sans antialiased bg-black`}>
                <AuthProvider>
                    <SoundEffects />
                    <SecurityLayer />
                    <Navbar />
                    <div className="pt-[60px] min-h-screen">
                        {children}
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
