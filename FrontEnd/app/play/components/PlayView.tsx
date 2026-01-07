import React from 'react';
import { Globe, AlertTriangle, Volume2, Settings, Pause, Terminal, Plus, Minus, Crosshair, Send, Lock, Radar } from 'lucide-react';

interface PlayViewProps {
    handleSend: () => void;
}

const PlayView: React.FC<PlayViewProps> = ({ handleSend }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col">
            {/* Header */}
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233348] bg-ui-panel px-6 py-3 z-20 shadow-md">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 flex items-center justify-center bg-primary/20 rounded text-primary">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">AtLast: Protocol Omega</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span>SERVER: ONLINE</span>
                        </div>
                    </div>
                </div>
                <div className="absolute left-1/2 top-3 -translate-x-1/2 flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-1 rounded-full border border-red-500/30">
                        <AlertTriangle size={14} className="text-red-500 animate-pulse" />
                        <span className="text-red-500 text-xs font-bold tracking-widest">DEFCON 1 ACTIVE</span>
                    </div>
                    <div className="text-3xl font-bold tracking-widest font-mono mt-1 text-white tabular-nums">
                        00:59:45
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-[#233348] hover:bg-[#34465d] text-white transition-colors">
                        <Volume2 size={20} />
                    </button>
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-[#233348] hover:bg-[#34465d] text-white transition-colors">
                        <Settings size={20} />
                    </button>
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-primary hover:bg-blue-600 text-white transition-colors ml-2">
                        <Pause size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Aside */}
                <aside className="w-[30%] min-w-[350px] max-w-[500px] flex flex-col border-r border-[#233348] bg-terminal-bg relative z-10 shadow-2xl">
                    <div className="px-5 py-3 border-b border-[#233348] flex justify-between items-center bg-[#0d1219]">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-primary" />
                            <h3 className="text-xs font-bold tracking-widest text-primary uppercase">Decryption Stream // OMEGA-7</h3>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        </div>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 bg-scanlines bg-[length:100%_4px]">
                        <div className="opacity-50 mb-4 text-xs">Login successful. User ID: 994-Alpha.</div>
                        <div className="mb-2">
                            <span className="text-primary font-bold">root@omega:~$</span> initiate_protocol --force
                        </div>
                        <div className="mb-4 text-emerald-500">
                            &gt; Establishing secure connection...<br />
                            &gt; Encrypted packet received.<br />
                            &gt; Brute-forcing SHA-256 signatures...
                        </div>
                        <div className="mb-4 pl-2 border-l-2 border-primary/30">
                            <span className="text-xs uppercase text-slate-500 mb-1 block">Intercepted Transmission</span>
                            <p className="text-white">"Target is located in the Southern Hemisphere. Prepare for immediate extraction upon coordinate verification."</p>
                        </div>
                        <div className="mb-4 text-yellow-500">
                            &gt; WARNING: Trace attempt detected.<br />
                            &gt; Rerouting via proxy: Singapore... Done.<br />
                            &gt; Rerouting via proxy: Helsinki... Done.
                        </div>
                        <div className="mb-2">
                            <span className="text-primary font-bold">root@omega:~$</span> decrypt_target_list
                        </div>
                        <div className="text-emerald-500">
                            &gt; Match found.<br />
                            &gt; Decrypting riddle package...<br />
                            &gt; <span className="text-white">Outputting to Main Visualizer.</span><span className="terminal-cursor"></span>
                        </div>
                    </div>
                    <div className="p-3 border-t border-[#233348] bg-[#0d1219]">
                        <div className="flex items-center gap-2 bg-background-dark border border-[#233348] rounded px-3 py-2">
                            <span className="text-primary text-xs">&gt;</span>
                            <div className="h-4 w-32 bg-primary/20 rounded animate-pulse"></div>
                        </div>
                    </div>
                </aside>

                {/* Section */}
                <section className="flex-1 relative bg-background-dark flex flex-col">
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
                            <div className="flex flex-col gap-2 pointer-events-auto">
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white hover:bg-[#233348] flex items-center justify-center">
                                    <Plus size={24} />
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white hover:bg-[#233348] flex items-center justify-center">
                                    <Minus size={24} />
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white hover:bg-[#233348] flex items-center justify-center mt-2">
                                    <Crosshair size={24} />
                                </button>
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
                        <div className="mt-auto p-8 pb-12 flex justify-center w-full relative z-30">
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
