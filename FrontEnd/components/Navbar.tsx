'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Cpu } from 'lucide-react';

import Image from 'next/image';

const Navbar = () => {
    const pathname = usePathname();
    const isLoginPage = pathname === '/' || pathname === '/login'; // Adjust based on actual login route if different

    if (isLoginPage) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-[#233348]/50 bg-[#111822]/80 backdrop-blur-md px-6 py-3 w-full font-display">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative size-8 transition-transform group-hover:scale-105">
                        <Image
                            src="/SVG/logoiconwhite.svg"
                            alt="AtLast Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-white text-lg font-bold tracking-widest uppercase group-hover:text-white/80 transition-colors">
                        AtLast: Protocol Omega
                    </h2>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                {/* System Status Indicators - Purely visual for "Interconnected" feel */}
                <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-[#92a9c9]/70">
                    <div className="flex items-center gap-1.5">
                        <Cpu size={12} className="text-primary" />
                        <span>SYS_OP: NORMAL</span>
                    </div>
                    <div className="h-3 w-px bg-[#233348]"></div>
                    <div className="flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span>NET: SECURE</span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end leading-none">
                        <span className="text-[10px] text-[#92a9c9] font-mono uppercase tracking-wider">Operator</span>
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Unidentified</span>
                    </div>
                    <div className="size-8 rounded bg-[#233348] flex items-center justify-center border border-[#324867] hover:bg-[#2c405a] cursor-pointer transition-colors group">
                        <Settings size={14} className="text-primary group-hover:animate-spin-slow" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
