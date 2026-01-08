import React from 'react';
import { CheckCircle, ShieldAlert, Crosshair, Send, Plus, Minus } from 'lucide-react';
import TerminalPanel from './TerminalPanel';

interface SuccessViewProps {
    resetGame: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ resetGame }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-[calc(100vh-60px)] flex flex-col relative animate-in fade-in duration-500">
            {/* Green Glow Effects */}
            <div className="absolute inset-0 pointer-events-none z-[60] shadow-[inset_0_0_150px_rgba(16,185,129,0.3)] border-4 border-emerald-500/50 animate-pulse"></div>

            {/* Status Overlay */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center z-40 pointer-events-none">
                <div className="flex items-center gap-2 bg-black/40 px-4 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-emerald-500 text-xs font-bold tracking-widest">THREAT RESOLVED</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Aside */}
                <TerminalPanel logs={[
                    { id: '1', type: 'system', text: 'Login successful. User ID: 994-Alpha.' },
                    { id: '2', type: 'command', text: 'initiate_protocol --force' },
                    { id: '3', type: 'info', text: 'Establishing secure connection...' },
                    { id: 'success1', type: 'command', text: 'lock_target --opt-c --confirm' },
                    { id: 'success2', type: 'success', text: 'GEOLOCATION CONFIRMED.' },
                    { id: 'success3', type: 'success', text: 'TARGET NEUTRALIZED SUCCESSFULLY.' },
                    { id: 'success4', type: 'success', text: 'REWARD ALLOCATED.' }
                ]} />

                {/* Section */}
                <section className="flex-1 relative bg-background-dark flex flex-col overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-80">
                        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 via-transparent to-background-dark z-10 pointer-events-none"></div>
                        <img alt="Dark satellite view of Earth from space showing city lights and continents" className="w-full h-full object-cover grayscale contrast-125 brightness-75 scale-[2] origin-[35%_75%] transition-transform duration-[2000ms] ease-out" src="/bg-earth.jpg" />
                    </div>
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-16 pointer-events-none">
                        <div className="relative flex flex-col items-center">
                            <div className="bg-emerald-600/90 backdrop-blur-md border-y-4 border-emerald-400 text-white shadow-[0_0_60px_rgba(16,185,129,0.6)] transform -skew-x-12">
                                <div className="px-20 py-6 transform skew-x-12">
                                    <h1 className="text-6xl font-black tracking-[0.2em] drop-shadow-lg animate-glitch">NEUTRALIZED</h1>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-2 bg-black/60 backdrop-blur border border-emerald-500/50 rounded-full px-6 py-2">
                                <ShieldAlert className="text-emerald-400 text-xl" />
                                <span className="text-emerald-400 font-mono text-xl font-bold tracking-widest">+5000 XP</span>
                            </div>
                        </div>
                        <button onClick={resetGame} className="pointer-events-auto mt-16 group relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-[#0B1016] transition-all duration-300 transform -skew-x-12 shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 ring-2 ring-emerald-300 ring-offset-2 ring-offset-black/50">
                            <div className="absolute inset-0 bg-[url('/carbon-fibre.png')] opacity-10"></div>
                            <div className="px-12 py-5 transform skew-x-12 flex items-center gap-4">
                                <Crosshair className="text-3xl" />
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] opacity-70 leading-none mb-1">COORDINATES ACQUIRED</span>
                                    <span className="font-black tracking-[0.15em] text-xl uppercase leading-none">GO TO NEXT TARGET</span>
                                </div>
                                <Send className="text-3xl group-hover:translate-x-2 transition-transform ml-2" />
                            </div>
                        </button>
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="px-8 py-6 flex justify-between items-start">
                            <div className="bg-background-dark/80 backdrop-blur-md border border-emerald-500/30 rounded-lg p-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <div className="text-xs text-emerald-500/70 uppercase tracking-wider mb-1">Status</div>
                                <div className="text-xl font-bold text-white flex items-center gap-2">
                                    <CheckCircle className="text-emerald-500" />
                                    TARGET SECURED
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 opacity-50 pointer-events-none">
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <Plus size={24} />
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <Minus size={24} />
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center mt-2">
                                    <Crosshair size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                            <div className="w-[400px] h-[400px] border border-primary/30 rounded-full flex items-center justify-center relative">
                                <div className="absolute top-0 bottom-0 w-[1px] bg-primary/30"></div>
                                <div className="absolute left-0 right-0 h-[1px] bg-primary/30"></div>
                                <div className="w-4 h-4 border border-primary"></div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            {/* Footer */}
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10 bg-[url('/carbon-fibre.png')]"></div>
            <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent z-50 animate-pulse"></div>

            <style jsx global>{`
                @keyframes glitch-skew {
                    0% { transform: skew(0deg); }
                    20% { transform: skew(-2deg); }
                    40% { transform: skew(2deg); }
                    60% { transform: skew(-1deg); }
                    80% { transform: skew(1deg); }
                    100% { transform: skew(0deg); }
                }
                @keyframes glitch-anim {
                    0% { 
                        text-shadow: 2px 2px #10b981, -2px -2px #34d399;
                        transform: translate(0);
                    }
                    25% { 
                        text-shadow: -2px 2px #10b981, 2px -2px #34d399;
                        transform: translate(-1px, 1px);
                    }
                    50% { 
                        text-shadow: 2px -2px #10b981, -2px 2px #34d399;
                        transform: translate(1px, -1px);
                    }
                    75% { 
                        text-shadow: -2px -2px #10b981, 2px 2px #34d399;
                        transform: translate(-1px, -1px);
                    }
                    100% { 
                        text-shadow: 2px 2px #10b981, -2px -2px #34d399;
                        transform: translate(0);
                    }
                }
                .animate-glitch {
                    animation: glitch-anim 2s cubic-bezier(.25, .46, .45, .94) both infinite;
                }
            `}</style>
        </div>
    );
};

export default SuccessView;
