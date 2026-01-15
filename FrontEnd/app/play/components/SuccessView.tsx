import React, { useState } from 'react';
import { CheckCircle, Crosshair, Globe, Shield } from 'lucide-react';
import TerminalPanel, { LogEntry } from './TerminalPanel';
import Leaderboard from '@/components/Leaderboard';

interface SuccessViewProps {
    resetGame: () => void;
    score: number;
}

const SuccessView: React.FC<SuccessViewProps> = ({ resetGame, score }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Mock logs for the static terminal
    const logs: LogEntry[] = [
        { id: '1', type: 'system', text: 'Target confirm... LOCKED' },
        { id: '2', type: 'success', text: 'Decryption complete.' },
        { id: '3', type: 'success', text: 'GEOLOCATION CONFIRMED.' },
        { id: '4', type: 'info', text: 'Uploading success packet...' },
        { id: '5', type: 'success', text: 'Reward allocated to Agent.' },
        { id: '6', type: 'system', text: 'Standing by for next assignment.' }
    ];

    return (
        <div className="bg-deep-black text-white font-display overflow-hidden h-[calc(100vh-60px)] flex flex-col relative w-full">

            {/* Background Layers */}
            <div className="absolute inset-0 z-0 bg-deep-black">
                <div className="absolute inset-0 bg-[url('/atlastbg.webp')] opacity-40 bg-cover bg-center bg-no-repeat"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.03)_1px,transparent_1px)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
            </div>

            {/* Green Success Tint */}
            <div className="absolute inset-0 pointer-events-none z-[15] shadow-[inset_0_0_150px_rgba(16,185,129,0.2)]"></div>

            <main className="flex-1 flex overflow-hidden relative z-20">
                {/* Left: Terminal Panel */}
                <div className="w-[350px] hidden md:flex flex-col border-r border-emerald-900/30 bg-black/80 backdrop-blur-md">
                    <TerminalPanel logs={logs} />
                </div>

                {/* Right: Success Content */}
                <section className="flex-1 relative flex flex-col items-center justify-center p-6">

                    {/* Status Badge */}
                    <div className="absolute top-12 flex items-center gap-2 bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span className="text-emerald-500 text-xs font-bold tracking-widest">MISSION SUCCESSFUL</span>
                    </div>

                    {showLeaderboard ? (
                        <div className="w-full max-w-3xl animate-in zoom-in-95 duration-500 z-50">
                            <div className="bg-black/90 border border-emerald-500/30 rounded-xl p-6 relative">
                                <Leaderboard />
                                <button
                                    onClick={() => setShowLeaderboard(false)}
                                    className="absolute top-4 right-4 text-emerald-500 hover:text-white font-mono text-xs border border-emerald-500/30 px-3 py-1 rounded hover:bg-emerald-500/20 transition-colors"
                                >
                                    CLOSE INTEL
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center gap-8 animate-in zoom-in-95 duration-500">

                            {/* Main Banner - Skewed */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="bg-black/80 border-y-2 border-emerald-500/50 backdrop-blur-md transform skew-x-[-12deg] p-1">
                                    <div className="bg-emerald-950/30 px-16 py-8 border border-emerald-500/20 transform skew-x-[0deg]"> {/* Counter-skew content if needed, here just keeping container shape */}
                                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.6)] transform skew-x-[12deg]">
                                            TARGET <span className="text-emerald-500">NEUTRALIZED</span>
                                        </h1>
                                    </div>
                                </div>
                            </div>

                            {/* Rewards */}
                            <div className="flex gap-4">
                                <div className="bg-black/60 border border-emerald-500/30 px-8 py-4 rounded-lg flex items-center gap-4 transform -skew-x-6">
                                    <div className="bg-emerald-500/20 p-2 rounded-full transform skew-x-6">
                                        <Shield size={24} className="text-emerald-400" />
                                    </div>
                                    <div className="flex flex-col items-start transform skew-x-6">
                                        <span className="text-emerald-500/70 text-[10px] tracking-widest font-bold uppercase">Mission Score</span>
                                        <span className="text-2xl font-bold text-white leading-none">+{score} XP</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowLeaderboard(true)}
                                    className="bg-black/60 border border-slate-700 hover:border-emerald-500/50 px-6 py-4 rounded-lg flex items-center gap-3 transform -skew-x-6 transition-colors group"
                                >
                                    <div className="transform skew-x-6">
                                        <Globe size={20} className="text-slate-400 group-hover:text-emerald-400" />
                                    </div>
                                    <span className="text-slate-400 group-hover:text-white text-xs font-bold tracking-widest uppercase transform skew-x-6">Global Intel</span>
                                </button>
                            </div>

                            {/* Next Target Button */}
                            <button
                                onClick={resetGame}
                                className="mt-8 group relative w-72 h-16 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xl uppercase tracking-widest transform -skew-x-12 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                                <div className="flex items-center justify-center gap-3 transform skew-x-12">
                                    <span>NEXT TARGET</span>
                                    <Crosshair className="group-hover:rotate-90 transition-transform" />
                                </div>
                            </button>

                        </div>
                    )}

                </section>
            </main>
        </div>
    );
};

export default SuccessView;
