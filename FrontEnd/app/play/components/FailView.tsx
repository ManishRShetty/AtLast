import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, List, LogOut, Gauge } from 'lucide-react';

interface FailViewProps {
    resetGame: () => void;
    cityName?: string;
    score?: number;
}

const FailView: React.FC<FailViewProps> = ({ resetGame, cityName, score = 0 }) => {
    const [difficulty, setDifficulty] = useState('AGENT');

    useEffect(() => {
        const stored = localStorage.getItem('atlast_difficulty');
        if (stored) setDifficulty(stored);
    }, []);

    const cycleDifficulty = () => {
        const levels = ['INDIA_EASY', 'INDIA_HARD', 'GLOBAL_EASY', 'GLOBAL_HARD'];
        const currentIndex = levels.indexOf(difficulty);
        const nextIndex = (currentIndex + 1) % levels.length;
        const nextLevel = levels[nextIndex];

        setDifficulty(nextLevel);
        localStorage.setItem('atlast_difficulty', nextLevel);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-display">
            {/* Backdrop with Blur */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-500">
                <div className="absolute inset-0 z-0 opacity-20 bg-noise pointer-events-none" style={{ backgroundImage: "url('/noise.png')" }}></div>
                <div className="absolute inset-0 z-10 pointer-events-none bg-[size:100%_4px] bg-scanline opacity-10"></div>
                {/* Additional modal backdrop effects */}
                <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl p-4 animate-in zoom-in-95 duration-500 flex flex-col items-center gap-8">

                {/* Warning Badge */}
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-xs font-bold tracking-[0.2em] animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <AlertTriangle size={14} />
                    <span>CONNECTION TERMINATED</span>
                </div>

                {/* Hero Text Section */}
                <div className="text-center space-y-2">
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none glitch-text select-none drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" data-text="SIGNAL LOST">
                        SIGNAL LOST
                    </h1>
                    <p className="text-red-500 text-xl md:text-2xl font-bold tracking-[0.2em] uppercase opacity-90 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        TARGET: CITY DETONATED
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="w-full max-w-[800px] grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[#111822]/95 backdrop-blur-xl border border-[#324867] rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden group ring-1 ring-red-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>

                    {/* Score */}
                    <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-[#324867]/50 relative">
                        <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Final Score</div>
                        <div className="text-4xl font-bold text-slate-200 drop-shadow-md">{score.toLocaleString()}</div>
                        <div className="text-[#556987] text-[10px] mt-1">NEW PERSONAL BEST</div>
                    </div>

                    {/* Time */}
                    <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-[#324867]/50">
                        <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Time Elapsed</div>
                        <div className="text-3xl font-bold text-red-500 tracking-wider">00:00</div>
                        <div className="text-red-500/70 text-[10px] mt-1 font-bold animate-pulse">LIMIT EXCEEDED</div>
                    </div>

                    {/* Locations */}
                    {/* Missed Target */}
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Missed Target</div>
                        <div className="text-2xl font-bold text-white tracking-wider text-center break-words w-full px-2 drop-shadow-md">
                            {cityName ? cityName.toUpperCase() : 'UNKNOWN'}
                        </div>
                        <div className="text-red-500/70 text-[10px] mt-1 font-bold">REGION COMPROMISED</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col w-full max-w-[480px] gap-4 relative z-20">
                    <button onClick={resetGame} className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(19,109,236,0.3)] hover:shadow-[0_0_30px_rgba(19,109,236,0.5)] border border-primary/50">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <RotateCcw className="mr-2 text-white/90" size={20} />
                        <span className="text-white text-lg font-bold uppercase tracking-wider">Re-Initialize Protocol</span>
                    </button>

                    {/* Difficulty Toggle */}
                    <button
                        onClick={cycleDifficulty}
                        className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-[#1a2332]/50 hover:bg-[#233348] border border-[#324867] hover:border-primary/50 transition-all duration-300 group"
                    >
                        <Gauge className={`mr-2 transition-colors ${difficulty.includes('HARD') ? 'text-red-500' : difficulty.includes('INDIA') ? 'text-emerald-500' : 'text-blue-500'}`} size={18} />
                        <span className="text-[#92a9c9] text-sm font-bold uppercase tracking-wide mr-2">Difficulty:</span>
                        <span className={`text-sm font-bold uppercase tracking-widest ${difficulty.includes('HARD') ? 'text-red-400' : difficulty.includes('INDIA') ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {difficulty.replace('_', ' // ')}
                        </span>
                    </button>
                    <div className="flex gap-4">
                        <button className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#233348] hover:bg-[#2c405a] border border-[#324867] text-[#92a9c9] hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">
                            <List className="mr-2" size={16} />
                            <span>Mission Log</span>
                        </button>
                        <Link href="/" className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#233348] hover:bg-red-900/20 border border-[#324867] hover:border-red-500/50 text-[#92a9c9] hover:text-red-500 transition-all text-sm font-bold uppercase tracking-wide">
                            <LogOut className="mr-2" size={16} />
                            <span>Abort</span>
                        </Link>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="text-center opacity-60">
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