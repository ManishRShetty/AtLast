import React, { useState } from 'react';
import { AlertTriangle, Plus, Minus, Crosshair, Send, Lock, Radar, ShieldAlert } from 'lucide-react';
import TerminalPanel, { LogEntry } from './TerminalPanel';
import HandoffModal from './HandoffModal';

interface PlayViewProps {
    handleSend: (command: string) => boolean;
    timeRemaining: number;
    isGameStarted: boolean;
    onStartGame: () => void;
}

const PlayView: React.FC<PlayViewProps> = ({ handleSend, timeRemaining, isGameStarted, onStartGame }) => {
    // Format time as MM:SS (or just SS since it's 60s max usually)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [feedbackActive, setFeedbackActive] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isError, setIsError] = useState(false);
    const [showTryAgain, setShowTryAgain] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([
        { id: 'sys-1', type: 'system', text: 'SYSTEM INITIALIZED' },
        { id: 'cmd-1', type: 'command', text: 'establish_uplink --secure' },
        { id: 'info-1', type: 'info', text: 'Connecting to secure server...' },
        { id: 'success-1', type: 'success', text: 'Connection established.' },
    ]);

    const onSend = () => {
        if (!inputValue.trim()) return;

        const cmd = inputValue.trim();
        // Add command log
        const newLogs: LogEntry[] = [...logs, {
            id: `cmd-${Date.now()}`,
            type: 'command',
            text: cmd
        }];

        const isCorrect = handleSend(cmd);

        if (!isCorrect) {
            setIsError(true);
            setShowTryAgain(true);

            // Play Error Sound
            const errorAudio = new Audio('/audio/error.mp3');
            errorAudio.volume = 0.5;
            errorAudio.play().catch(() => { /* Ignore autoplay errors */ });

            setTimeout(() => {
                setIsError(false);
                setShowTryAgain(false);
            }, 1000); // 1s duration for effect
            newLogs.push({
                id: `err-${Date.now()}`,
                type: 'error',
                text: 'ACCESS DENIED: Invalid location coordinates.'
            });
            newLogs.push({
                id: `warn-${Date.now()}`,
                type: 'warning',
                text: 'PENALTY APPLIED: -10 SECONDS'
            });
        }

        setLogs(newLogs);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSend();
        }
    };

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
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-[calc(100vh-60px)] flex flex-col relative">

            {!isGameStarted && <HandoffModal onStart={onStartGame} />}

            <div className={`flex-1 flex flex-col overflow-hidden relative transition-all duration-500 ${!isGameStarted ? 'blur-md scale-[0.98] opacity-50 pointer-events-none' : ''}`}>

                {/* Main Content */}
                <main className="flex-1 flex overflow-hidden relative">
                    <TerminalPanel logs={logs} />

                    {/* Section */}
                    <section className="flex-1 relative bg-background-dark flex flex-col">
                        {/* Game Status Bar */}
                        <div className="absolute top-12 w-full z-40 flex flex-col items-center pointer-events-none">
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
                                <div className="bg-[#0B1016]/90 backdrop-blur-xl border border-primary/50 rounded-lg p-10 max-w-2xl text-center shadow-[0_0_50px_rgba(19,109,236,0.2)] relative pointer-events-auto ring-1 ring-primary/20">
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

                                    {/* Corner Accents */}
                                    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>

                                    <div className="flex flex-col items-center gap-4 relative z-10">
                                        <div className="flex items-center gap-3 mb-4 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/30">
                                            <Lock size={16} className="text-primary animate-pulse" />
                                            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Encrypted Transmission</span>
                                        </div>
                                        <h2 className="text-white text-2xl md:text-3xl font-medium leading-relaxed font-display drop-shadow-lg tracking-wide">
                                            "I stand where the silver river widens. A tango is danced in my streets, and my obelisk watches over the widest avenue. Identify me."
                                        </h2>
                                        <div className="w-16 h-1 bg-primary/40 rounded mt-6"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
                                <div className="w-[600px] h-[600px] border border-primary/30 rounded-full flex items-center justify-center relative">
                                    <div className="absolute top-0 bottom-0 w-[1px] bg-primary/30"></div>
                                    <div className="absolute left-0 right-0 h-[1px] bg-primary/30"></div>
                                </div>
                            </div>
                            <div className="mt-auto p-8 pb-12 flex justify-center w-full relative z-30">
                                <div className="w-full max-w-3xl relative group">
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur-md"></div>

                                    <div className="relative flex items-center bg-[#0B1016]/95 border border-[#233348] rounded-xl shadow-2xl overflow-hidden transition-all backdrop-blur-xl">
                                        {/* Decoration Lines */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

                                        {/* Sidebar Label */}
                                        <div className="pl-6 pr-4 text-primary flex items-center pointer-events-none select-none h-full  shrink-0">
                                            <span className="font-mono text-sm tracking-widest font-bold drop-shadow-[0_0_5px_rgba(19,109,236,0.5)] whitespace-nowrap">ANSWER //</span>
                                        </div>

                                        <div className="w-[1px] h-8 bg-[#233348]"></div>

                                        <input
                                            autoFocus
                                            className="w-full bg-transparent border-none outline-none text-white font-mono text-xl py-6 px-6 focus:ring-0 focus:outline-none focus:border-none placeholder-slate-600 tracking-wider"
                                            placeholder="TYPE CITY OR COORDINATES..."
                                            spellCheck="false"
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />

                                        <div className="pr-3 pl-2 flex items-center">
                                            <button
                                                onClick={onSend}
                                                disabled={!inputValue.trim()}
                                                className={`
                                                relative overflow-hidden px-8 py-3 rounded-lg font-bold text-sm tracking-widest flex items-center gap-2 transition-all duration-300
                                                ${inputValue.trim()
                                                        ? 'bg-primary hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(19,109,236,0.4)] hover:shadow-[0_0_30px_rgba(19,109,236,0.6)] translate-y-0 opacity-100'
                                                        : 'bg-[#1a2332] text-slate-500 cursor-not-allowed shadow-none opacity-80'
                                                    }
                                            `}
                                            >
                                                <span className="relative z-10">SEND</span>
                                                <Send size={14} className={`relative z-10 transition-transform ${inputValue.trim() ? 'group-hover:translate-x-1' : ''}`} />

                                                {/* Button Glint */}
                                                {inputValue.trim() && (
                                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-8 left-0 right-0 text-center flex justify-center gap-4">
                                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"></span>
                                            Protocol Omega Verified Input Channel
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Error Effects Overlay - Moved inside section for correct centering */}
                        <div className={`absolute inset-0 pointer-events-none z-[60] transition-opacity duration-300 ${isError ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(220,38,38,0.5)] border-4 border-red-500/80 animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-500/80 to-transparent animate-pulse"></div>
                        </div>

                        {/* Try Again Message Overlay - Moved inside section for correct centering */}
                        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-[70] transition-all duration-1000 transform ${showTryAgain ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <div className="bg-black/80 border border-red-500 px-8 py-4 rounded-lg flex flex-col items-center shadow-[0_0_50px_rgba(220,38,38,0.5)] backdrop-blur-md">
                                <ShieldAlert size={48} className="text-red-500 mb-2 animate-pulse" />
                                <h2 className="text-3xl font-bold text-red-500 tracking-widest font-mono glitch-text">ACCESS DENIED</h2>
                                <p className="text-white/80 text-sm tracking-[0.2em] mt-1">PENALTY APPLIED. TRY AGAIN.</p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Global Footer (Carbon Fibre) */}
                <div className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-1000 ${isGameStarted ? 'opacity-0' : 'opacity-100 bg-black'}`}></div>
                <div className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-300 ${isError ? 'bg-red-500/10' : 'opacity-0'}`}></div>
                <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10 bg-[url('/carbon-fibre.png')]"></div>
                <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-50"></div>
            </div>

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
