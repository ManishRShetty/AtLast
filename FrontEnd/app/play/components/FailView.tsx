import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, List, LogOut } from 'lucide-react';

interface FailViewProps {
    resetGame: () => void;
}

const FailView: React.FC<FailViewProps> = ({ resetGame }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden h-screen flex flex-col items-center justify-center p-4 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 opacity-20 bg-noise pointer-events-none" style={{ backgroundImage: "url('/noise.png')" }}></div>
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('/bg-map.jpg')" }}></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent"></div>
            {/* Decorative Scanlines */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[size:100%_4px] bg-scanline opacity-10"></div>

            {/* Main Content Wrapper */}
            <div className="relative z-20 flex flex-col items-center w-full max-w-[800px] gap-8">
                {/* Warning Badge */}
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-xs font-bold tracking-[0.2em] animate-pulse">
                    <AlertTriangle size={14} />
                    <span>CONNECTION TERMINATED</span>
                </div>

                {/* Hero Text Section */}
                <div className="text-center space-y-2">
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none glitch-text select-none" data-text="SIGNAL LOST">
                        SIGNAL LOST
                    </h1>
                    <p className="text-red-500 text-xl md:text-2xl font-bold tracking-[0.2em] uppercase opacity-90 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        TARGET: CITY DETONATED
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[#111822]/80 backdrop-blur-sm border border-[#324867] rounded-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                    <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-[#324867]/50 relative">
                        <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Final Score</div>
                        <div className="text-4xl font-bold text-primary drop-shadow-[0_0_15px_rgba(19,109,236,0.4)]">14,250</div>
                        <div className="text-[#556987] text-[10px] mt-1">NEW PERSONAL BEST</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-[#324867]/50">
                        <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Time Elapsed</div>
                        <div className="text-3xl font-bold text-white tracking-wider">08:45</div>
                        <div className="text-[#556987] text-[10px] mt-1">LIMIT EXCEEDED</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Locations Secured</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white">12</span>
                            <span className="text-xl text-[#556987] font-medium">/ 20</span>
                        </div>
                        <div className="text-red-500/70 text-[10px] mt-1 font-bold">INCOMPLETE</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col w-full max-w-[480px] gap-4">
                    <button onClick={resetGame} className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(19,109,236,0.3)] hover:shadow-[0_0_30px_rgba(19,109,236,0.5)] border border-primary/50">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <RotateCcw className="mr-2 text-white/90" size={20} />
                        <span className="text-white text-lg font-bold uppercase tracking-wider">Re-Initialize Protocol</span>
                    </button>
                    <div className="flex gap-4">
                        <button className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#233348] hover:bg-[#2c405a] border border-[#324867] text-[#92a9c9] hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">
                            <List className="mr-2" size={16} />
                            <span>Mission Log</span>
                        </button>
                        <Link href="/handoff" className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#233348] hover:bg-red-900/20 border border-[#324867] hover:border-red-500/50 text-[#92a9c9] hover:text-red-500 transition-all text-sm font-bold uppercase tracking-wide">
                            <LogOut className="mr-2" size={16} />
                            <span>Abort</span>
                        </Link>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="pt-8 text-center opacity-60">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#324867] to-transparent mx-auto mb-4"></div>
                    <p className="text-[#556987] text-xs font-mono tracking-[0.2em] uppercase">
                        System Halted // Terminal ID: OMEGA-9 // ERROR_CODE: 0x4B2
                    </p>
                </div>
            </div>

            <style jsx global>{`
                .bg-noise { background-image: url(/noise.png); }
                .glitch-text { position: relative; }
                .glitch-text::before, .glitch-text::after {
                    content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                }
                .glitch-text::before {
                    left: 2px; text-shadow: -1px 0 #ff00c1; clip: rect(44px, 450px, 56px, 0); animation: glitch-anim 5s infinite linear alternate-reverse;
                }
                .glitch-text::after {
                    left: -2px; text-shadow: -1px 0 #00fff9; clip: rect(44px, 450px, 56px, 0); animation: glitch-anim2 5s infinite linear alternate-reverse;
                }
                @keyframes glitch-anim {
                    0% { clip: rect(44px, 9999px, 56px, 0); } 100% { clip: rect(36px, 9999px, 68px, 0); }
                }
                @keyframes glitch-anim2 {
                    0% { clip: rect(12px, 9999px, 94px, 0); } 100% { clip: rect(32px, 9999px, 50px, 0); }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default FailView;
