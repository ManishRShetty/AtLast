import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, List, LogOut, Gauge, Globe, ShieldAlert } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';

interface FailViewProps {
    resetGame: () => void;
    cityName?: string;
    score?: number;
}

const FailView: React.FC<FailViewProps> = ({ resetGame, cityName, score = 0 }) => {
    const [difficulty, setDifficulty] = useState('AGENT');
    const [showLeaderboard, setShowLeaderboard] = useState(false);

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
        <div className="bg-deep-black text-white font-display overflow-hidden h-[calc(100vh-60px)] flex flex-col relative w-full">

            {/* Background Layers */}
            <div className="absolute inset-0 z-0 bg-deep-black">
                <div className="absolute inset-0 bg-[url('/atlastbg.webp')] opacity-40 bg-cover bg-center bg-no-repeat grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-black/80"></div>
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.05)_1px,transparent_1px)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
            </div>

            {/* Red Failure Tint & Pulse */}
            <div className="absolute inset-0 pointer-events-none z-[15] shadow-[inset_0_0_150px_rgba(239,68,68,0.3)] animate-pulse-slow"></div>

            <main className="flex-1 flex overflow-hidden relative z-20 items-center justify-center p-6">

                {showLeaderboard ? (
                    <div className="w-full max-w-3xl animate-in zoom-in-95 duration-500 z-50">
                        <div className="bg-black/90 border border-red-500/30 rounded-xl p-6 relative shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                            <Leaderboard />
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => setShowLeaderboard(false)}
                                    className="text-red-500 hover:text-white font-mono text-xs border border-red-500/30 px-6 py-2 rounded hover:bg-red-500/20 transition-colors uppercase tracking-widest"
                                >
                                    Return to Debrief
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-10 max-w-4xl w-full animate-in zoom-in-95 duration-500">

                        {/* Header Section */}
                        <div className="text-center space-y-4 relative">
                            <div className="inline-flex items-center gap-2 bg-red-500/10 px-4 py-1 rounded border border-red-500/50 text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-4 animate-pulse">
                                <ShieldAlert size={14} /> Critical System Failure
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-widest glitch-text drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" data-text="SIGNAL LOST">
                                SIGNAL LOST
                            </h1>

                            <div className="h-1 w-32 bg-red-500 mx-auto rounded-full"></div>

                            <p className="text-red-400 text-xl font-mono tracking-widest uppercase">
                                TARGET CITY WAS: <span className="text-white font-bold border-b border-red-500">{cityName || 'UNKNOWN'}</span>
                            </p>
                        </div>

                        {/* Stats Grid - Skewed */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                            <div className="bg-black/40 border border-red-500/30 p-6 transform skew-x-[-12deg] hover:bg-red-950/20 transition-colors group">
                                <div className="transform skew-x-[12deg] text-center">
                                    <span className="text-red-500/60 text-xs uppercase tracking-widest block mb-1">Final Score</span>
                                    <span className="text-4xl font-bold text-white group-hover:text-red-400 transition-colors">{score.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="bg-black/40 border border-red-500/30 p-6 transform skew-x-[-12deg] hover:bg-red-950/20 transition-colors group">
                                <div className="transform skew-x-[12deg] text-center">
                                    <span className="text-red-500/60 text-xs uppercase tracking-widest block mb-1">Status</span>
                                    <span className="text-4xl font-bold text-white group-hover:text-red-400 transition-colors">KIA</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4 w-full max-w-[400px]">
                            <button
                                onClick={resetGame}
                                className="group w-full h-14 bg-red-600 hover:bg-red-500 text-black font-bold text-lg uppercase tracking-widest transform skew-x-[-12deg] transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[12deg]"></div>
                                <div className="flex items-center justify-center gap-2 transform skew-x-[12deg]">
                                    <RotateCcw size={20} /> RE-INITIALIZE PROTOCOL
                                </div>
                            </button>

                            <div className="flex gap-4">
                                <Link
                                    href="/"
                                    className="flex-1 h-12 flex items-center justify-center bg-black/60 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-500 font-bold text-sm uppercase tracking-widest transform skew-x-[-12deg] transition-all group"
                                >
                                    <span className="transform skew-x-[12deg] flex items-center gap-2">
                                        <LogOut size={16} /> Abort
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setShowLeaderboard(true)}
                                    className="flex-1 h-12 flex items-center justify-center bg-black/60 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-500 font-bold text-sm uppercase tracking-widest transform skew-x-[-12deg] transition-all group"
                                >
                                    <span className="transform skew-x-[12deg] flex items-center gap-2">
                                        <Globe size={16} /> Intl
                                    </span>
                                </button>
                            </div>

                            {/* Difficulty Toggle (Mini) */}
                            <button
                                onClick={cycleDifficulty}
                                className="mt-2 text-[10px] text-slate-500 hover:text-red-400 font-mono tracking-widest uppercase transition-colors"
                            >
                                NEXT DIFFICULTY: <span className="text-white">{difficulty?.replace('_', ' ')}</span>
                            </button>
                        </div>

                    </div>
                )}

            </main>

            <style jsx global>{`
                .glitch-text {
                    text-shadow: 2px 2px 0px #ff0000, -2px -2px 0px #0000ff;
                    animation: glitch 0.5s infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default FailView;