import React from 'react';
import { AlertTriangle, XCircle, Volume2, Settings, RotateCcw, Terminal, ShieldAlert, Radar, Plus, Minus } from 'lucide-react';

interface IncorrectViewProps {
    resetGame: () => void;
}

const IncorrectView: React.FC<IncorrectViewProps> = ({ resetGame }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col relative">
            {/* Effects */}
            <div className="absolute inset-0 pointer-events-none z-[60] shadow-[inset_0_0_150px_rgba(220,38,38,0.3)] border-4 border-red-500/50 animate-pulse"></div>
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10 bg-[url('/carbon-fibre.png')]"></div>
            <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-500/80 to-transparent z-50 animate-pulse"></div>

            {/* Header */}
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-red-500/30 bg-ui-panel px-6 py-3 z-20 shadow-[0_4px_20px_rgba(220,38,38,0.2)]">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 flex items-center justify-center bg-red-500/20 rounded text-red-500 animate-pulse">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] text-red-500">SYSTEM ALERT</h2>
                        <div className="flex items-center gap-2 text-xs text-red-500/80">
                            <span className="inline-block size-2 rounded-full bg-red-500 animate-ping"></span>
                            <span>SERVER: COMPROMISED</span>
                        </div>
                    </div>
                </div>
                <div className="absolute left-1/2 top-3 -translate-x-1/2 flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-red-500/10 px-4 py-1 rounded-full border border-red-500">
                        <XCircle size={14} className="text-red-500 animate-pulse-fast" />
                        <span className="text-red-500 text-xs font-bold tracking-widest">BREACH DETECTED</span>
                    </div>
                    <div className="relative mt-1">
                        <div className="text-3xl font-bold tracking-widest font-mono text-red-500 tabular-nums drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                            00:59:35
                        </div>
                        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                            <span className="text-red-500 font-bold text-xl font-mono">-10s</span>
                            <span className="text-[10px] text-red-500 uppercase tracking-wider bg-black/60 px-1 rounded">Penalty</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-[#233348] hover:bg-[#34465d] text-white transition-colors">
                        <Volume2 size={20} />
                    </button>
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-[#233348] hover:bg-[#34465d] text-white transition-colors">
                        <Settings size={20} />
                    </button>
                    <button onClick={resetGame} className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-red-500 hover:bg-red-600 text-white transition-colors ml-2 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                        <RotateCcw size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Aside */}
                <aside className="w-[30%] min-w-[350px] max-w-[500px] flex flex-col border-r border-red-500/30 bg-terminal-bg relative z-10 shadow-2xl">
                    <div className="px-5 py-3 border-b border-red-500/30 flex justify-between items-center bg-[#1a0505]">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-red-500" />
                            <h3 className="text-xs font-bold tracking-widest text-red-500 uppercase">System Log // ERROR</h3>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-red-500/30"></div>
                        </div>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 bg-scanlines bg-[length:100%_4px]">
                        <div className="opacity-50 mb-4 text-xs">Login successful. User ID: 994-Alpha.</div>
                        <div className="mb-2">
                            <span className="text-primary font-bold">root@omega:~$</span> initiate_protocol --force
                        </div>
                        <div className="mb-4 text-emerald-500 opacity-50">
                            &gt; Establishing secure connection...<br />
                            &gt; Encrypted packet received.<br />
                            &gt; Brute-forcing SHA-256 signatures...
                        </div>
                        <div className="mb-4 pl-2 border-l-2 border-red-500/50 opacity-60">
                            <span className="text-xs uppercase text-red-500 mb-1 block">Intercepted Transmission</span>
                            <p className="text-slate-400">"Target is located in the Southern Hemisphere. Prepare for immediate extraction upon coordinate verification."</p>
                        </div>
                        <div className="mb-2">
                            <span className="text-primary font-bold">root@omega:~$</span> decrypt_target_list
                        </div>
                        <div className="text-emerald-500 mb-4 opacity-50">
                            &gt; 3 Potential matches found.<br />
                            &gt; Displaying options on main HUD.
                        </div>
                        <div className="mb-2">
                            <span className="text-primary font-bold">root@omega:~$</span> verify_target --id="OPT-C"
                        </div>
                        <div className="text-red-500 font-bold mt-2">
                            &gt; VERIFYING HASH... FAILED.<br />
                            &gt; CRITICAL ERROR: TARGET MISMATCH DETECTED.<br />
                            &gt; GEOLOCATION SIGNATURE DOES NOT MATCH DECRYPTED STREAM.<br />
                            &gt; INITIATING PENALTY PROTOCOL...<br />
                            &gt; <span className="bg-red-500 text-black px-1">PENALTY APPLIED: -10 SECONDS</span><br />
                            &gt; SYSTEM LOCKDOWN IMMINENT.<span className="terminal-cursor"></span>
                        </div>
                    </div>
                    <div className="p-3 border-t border-red-500/30 bg-[#1a0505]">
                        <div className="flex items-center gap-2 bg-background-dark border border-red-500/50 rounded px-3 py-2">
                            <span className="text-red-500 text-xs">&gt;</span>
                            <div className="h-4 w-32 bg-red-500/20 rounded animate-pulse"></div>
                        </div>
                    </div>
                </aside>

                {/* Section */}
                <section className="flex-1 relative bg-background-dark flex flex-col overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 via-red-500/10 to-red-500/30 z-10 pointer-events-none mix-blend-overlay"></div>
                        {/* <div className="absolute inset-0 bg-danger-pattern z-10 opacity-10 pointer-events-none"></div> */}
                        {/* Simplified danger pattern for now */}
                        <img alt="Dark satellite view of Earth from space showing city lights and continents" className="w-full h-full object-cover grayscale contrast-125 brightness-50" src="/bg-earth.jpg" />
                    </div>
                    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                        <div className="relative bg-black/90 border border-red-500 p-10 rounded-lg text-center shadow-[0_0_100px_rgba(239,68,68,0.4)] backdrop-blur-xl max-w-lg w-full transform scale-100">
                            <div className="absolute inset-x-0 top-2 h-[1px] bg-red-500/50"></div>
                            <div className="absolute inset-x-0 bottom-2 h-[1px] bg-red-500/50"></div>
                            <ShieldAlert size={72} className="text-red-500 mb-4 animate-pulse mx-auto" />
                            <h1 className="text-5xl font-bold font-mono text-red-500 mb-2 tracking-tighter glitch-text">ERROR</h1>
                            <h2 className="text-2xl font-bold text-white tracking-[0.2em] mb-4">TARGET MISMATCH</h2>
                            <div className="bg-red-500/20 border border-red-500/50 p-2 text-red-200 font-mono text-sm inline-block rounded mb-4">
                                ERR_CODE: GEO_INVALID_0x99
                            </div>
                            <p className="text-slate-400 text-sm uppercase tracking-widest">Protocol Omega Failed. Resetting Coords.</p>
                            <button onClick={resetGame} className="mt-6 pointer-events-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-widest transition-colors">
                                Try Again
                            </button>
                        </div>
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col pointer-events-none">
                        <div className="px-8 py-6 flex justify-between items-start opacity-50 grayscale">
                            <div className="bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg p-3">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Target Region</div>
                                <div className="text-xl font-bold text-white flex items-center gap-2">
                                    <Radar size={24} className="text-slate-500" />
                                    LATAM SECTOR 4
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <Plus size={24} />
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <Minus size={24} />
                                </button>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <style jsx global>{`
                .terminal-cursor {
                    display: inline-block; width: 10px; height: 1.2em; background-color: #ef4444; animation: blink 0.5s step-end infinite; vertical-align: text-bottom;
                }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                .animate-pulse-fast { animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .glitch-text { text-shadow: 2px 0 #ef4444, -2px 0 #136dec; }
            `}</style>
        </div>
    );
};

export default IncorrectView;
