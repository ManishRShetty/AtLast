import React, { useState } from 'react';
import { AlertTriangle, Plus, Minus, Crosshair, Send, Lock, Radar } from 'lucide-react';
import TerminalPanel, { LogEntry } from './TerminalPanel';

interface PlayViewProps {
    handleSend: () => void;
    timeRemaining: number;
}

const PlayView: React.FC<PlayViewProps> = ({ handleSend, timeRemaining }) => {
    // Format time as MM:SS (or just SS since it's 60s max usually)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [feedbackActive, setFeedbackActive] = useState<string | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([
        { id: 'sys-1', type: 'system', text: 'SYSTEM INITIALIZED' },
        { id: 'cmd-1', type: 'command', text: 'establish_uplink --secure' },
        { id: 'info-1', type: 'info', text: 'Connecting to secure server...' },
        { id: 'success-1', type: 'success', text: 'Connection established.' },
    ]);

    const handleMapInteraction = (id: string) => {
        setFeedbackActive(id);
        setTimeout(() => setFeedbackActive(null), 2000);
    };

    const renderFeedback = () => (
        <div className="absolute right-full top-0 mr-4 bg-red-500/90 text-white text-xs font-bold px-3 py-2 rounded shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-right-4 z-50">
            You don't have time to play with this.
            <div className="absolute right-[-4px] top-1/2 w-2 h-2 bg-red-500/90 rotate-45 transform -translate-y-1/2"></div>
        </div>
    );



    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col">


            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                <TerminalPanel logs={logs} />

                {/* Section */}
                <section className="flex-1 relative bg-background-dark flex flex-col">
                    {/* Game Status Bar */}
                    <div className="absolute top-8 w-full z-40 flex flex-col items-center pointer-events-none">
                        <div className="flex items-center gap-2 bg-black/40 px-4 py-1 rounded-full border border-red-500/30 backdrop-blur-sm">
                            <AlertTriangle size={14} className="text-red-500 animate-pulse" />
                            <span className="text-red-500 text-xs font-bold tracking-widest">DEFCON 1 ACTIVE</span>
                        </div>
                        <div className="text-4xl font-bold tracking-widest font-mono mt-2 text-white tabular-nums drop-shadow-md text-center">
                            {formatTime(timeRemaining)}
                        </div>
                    </div>
                    <div className="absolute inset-0 z-0 opacity-60">
                        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-transparent to-background-dark z-10 pointer-events-none"></div>
                        <img alt="Dark satellite view of Earth from space showing city lights and continents" className="w-full h-full object-cover grayscale contrast-125 brightness-75" src="/bg-earth.jpg" />
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="px-8 py-6 flex justify-between items-start pointer-events-none">
                            <div className="bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg p-3 pointer-events-auto">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Target Region</div>
                                <div className="text-xl font-bold text-white flex items-center gap-2">
                                    <Radar size={24} className="text-primary" />
                                    LATAM SECTOR 4
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 pointer-events-auto items-end">
                                <div className="relative">
                                    {feedbackActive === 'plus' && renderFeedback()}
                                    <button onClick={() => handleMapInteraction('plus')} className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white hover:bg-[#233348] flex items-center justify-center transition-colors">
                                        <Plus size={24} />
                                    </button>
                                </div>
                                <div className="relative">
                                    {feedbackActive === 'minus' && renderFeedback()}
                                    <button onClick={() => handleMapInteraction('minus')} className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white hover:bg-[#233348] flex items-center justify-center transition-colors">
                                        <Minus size={24} />
                                    </button>
                                </div>
                                <div className="relative mt-2">
                                    {feedbackActive === 'crosshair' && renderFeedback()}
                                    <button onClick={() => handleMapInteraction('crosshair')} className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white hover:bg-[#233348] flex items-center justify-center transition-colors">
                                        <Crosshair size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="bg-black/60 backdrop-blur-md border border-primary/40 rounded-2xl p-8 max-w-2xl text-center shadow-[0_0_40px_rgba(19,109,236,0.15)] relative pointer-events-auto">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock size={18} className="text-primary animate-pulse" />
                                        <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Encrypted Transmission</span>
                                    </div>
                                    <h2 className="text-white text-2xl md:text-3xl font-medium leading-relaxed font-display">
                                        "I stand where the silver river widens. A tango is danced in my streets, and my obelisk watches over the widest avenue. Identify me."
                                    </h2>
                                    <div className="w-12 h-1 bg-primary/30 rounded mt-4"></div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
                            <div className="w-[600px] h-[600px] border border-primary/30 rounded-full flex items-center justify-center relative">
                                <div className="absolute top-0 bottom-0 w-[1px] bg-primary/30"></div>
                                <div className="absolute left-0 right-0 h-[1px] bg-primary/30"></div>
                            </div>
                        </div>
                        <div className="mt-auto p-8 pb-32 flex justify-center w-full relative z-30">
                            <div className="w-full max-w-3xl relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-xl opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
                                <div className="relative flex items-center bg-[#101822] border border-[#233348] rounded-xl shadow-2xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                    <div className="pl-5 pr-3 text-primary/70 flex items-center pointer-events-none select-none border-r border-[#233348] h-full py-4 bg-[#151e29]">
                                        <span className="font-mono text-sm tracking-wider">ANSWER //</span>
                                    </div>
                                    <input autoFocus className="w-full bg-transparent border-none text-white font-mono text-lg py-5 px-4 focus:ring-0 placeholder-slate-600" placeholder="TYPE CITY OR COORDINATES..." spellCheck="false" type="text" />
                                    <div className="pr-2 flex items-center">
                                        <button onClick={handleSend} className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-colors flex items-center gap-2 shadow-lg">
                                            SEND
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 left-0 right-0 text-center">
                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Protocol Omega Verified Input Channel</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10 bg-[url('/carbon-fibre.png')]"></div>
            <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-50"></div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .terminal-cursor {
                    display: inline-block; width: 10px; height: 1.2em; background-color: #136dec;
                    animation: blink 1s step-end infinite; vertical-align: text-bottom;
                }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
};

export default PlayView;
