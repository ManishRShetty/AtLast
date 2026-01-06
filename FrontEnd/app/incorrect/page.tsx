'use client';

import React from 'react';
const IncorrectGuessPage = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col relative">
            {/* Effects */}
            <div className="absolute inset-0 pointer-events-none z-[60] shadow-[inset_0_0_150px_rgba(220,38,38,0.3)] border-4 border-danger/50 animate-pulse"></div>
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10 bg-[url('/carbon-fibre.png')]"></div>
            <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-danger/80 to-transparent z-50 animate-pulse"></div>

            {/* Header */}
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-danger/30 bg-ui-panel px-6 py-3 z-20 shadow-[0_4px_20px_rgba(220,38,38,0.2)]">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 flex items-center justify-center bg-danger/20 rounded text-danger animate-pulse">
                        <span className="material-symbols-outlined text-2xl">warning</span>
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] text-danger">SYSTEM ALERT</h2>
                        <div className="flex items-center gap-2 text-xs text-danger/80">
                            <span className="inline-block size-2 rounded-full bg-danger animate-ping"></span>
                            <span>SERVER: COMPROMISED</span>
                        </div>
                    </div>
                </div>
                <div className="absolute left-1/2 top-3 -translate-x-1/2 flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-danger/10 px-4 py-1 rounded-full border border-danger">
                        <span className="material-symbols-outlined text-danger text-sm animate-pulse-fast">error</span>
                        <span className="text-danger text-xs font-bold tracking-widest">BREACH DETECTED</span>
                    </div>
                    <div className="relative mt-1">
                        <div className="text-3xl font-bold tracking-widest font-mono text-danger tabular-nums drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                            00:59:35
                        </div>
                        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                            <span className="text-danger font-bold text-xl font-mono">-10s</span>
                            <span className="text-[10px] text-danger uppercase tracking-wider bg-black/60 px-1 rounded">Penalty</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-[#233348] hover:bg-[#34465d] text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">volume_up</span>
                    </button>
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-[#233348] hover:bg-[#34465d] text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                    </button>
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-danger hover:bg-red-600 text-white transition-colors ml-2 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                        <span className="material-symbols-outlined text-[20px]">stop</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Aside */}
                <aside className="w-[30%] min-w-[350px] max-w-[500px] flex flex-col border-r border-danger/30 bg-terminal-bg relative z-10 shadow-2xl">
                    <div className="px-5 py-3 border-b border-danger/30 flex justify-between items-center bg-[#1a0505]">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-danger text-sm">terminal</span>
                            <h3 className="text-xs font-bold tracking-widest text-danger uppercase">System Log // ERROR</h3>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-danger animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-danger/50"></div>
                            <div className="w-2 h-2 rounded-full bg-danger/30"></div>
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
                        <div className="mb-4 pl-2 border-l-2 border-danger/50 opacity-60">
                            <span className="text-xs uppercase text-danger mb-1 block">Intercepted Transmission</span>
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
                        <div className="text-danger font-bold mt-2">
                            &gt; VERIFYING HASH... FAILED.<br />
                            &gt; CRITICAL ERROR: TARGET MISMATCH DETECTED.<br />
                            &gt; GEOLOCATION SIGNATURE DOES NOT MATCH DECRYPTED STREAM.<br />
                            &gt; INITIATING PENALTY PROTOCOL...<br />
                            &gt; <span className="bg-danger text-black px-1">PENALTY APPLIED: -10 SECONDS</span><br />
                            &gt; SYSTEM LOCKDOWN IMMINENT.<span className="terminal-cursor"></span>
                        </div>
                    </div>
                    <div className="p-3 border-t border-danger/30 bg-[#1a0505]">
                        <div className="flex items-center gap-2 bg-background-dark border border-danger/50 rounded px-3 py-2">
                            <span className="text-danger text-xs">&gt;</span>
                            <div className="h-4 w-32 bg-danger/20 rounded animate-pulse"></div>
                        </div>
                    </div>
                </aside>

                {/* Section */}
                <section className="flex-1 relative bg-background-dark flex flex-col overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-danger/20 via-danger/10 to-danger/30 z-10 pointer-events-none mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-danger-pattern z-10 opacity-10 pointer-events-none"></div>
                        <img alt="Dark satellite view of Earth from space showing city lights and continents" className="w-full h-full object-cover grayscale contrast-125 brightness-50" src="/bg-earth.jpg" />
                    </div>
                    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                        <div className="relative bg-black/90 border border-danger p-10 rounded-lg text-center shadow-[0_0_100px_rgba(239,68,68,0.4)] backdrop-blur-xl max-w-lg w-full transform scale-100">
                            <div className="absolute inset-x-0 top-2 h-[1px] bg-danger/50"></div>
                            <div className="absolute inset-x-0 bottom-2 h-[1px] bg-danger/50"></div>
                            <span className="material-symbols-outlined text-7xl text-danger mb-4 animate-pulse-fast">gpp_bad</span>
                            <h1 className="text-5xl font-bold font-mono text-danger mb-2 tracking-tighter glitch-text">ERROR</h1>
                            <h2 className="text-2xl font-bold text-white tracking-[0.2em] mb-4">TARGET MISMATCH</h2>
                            <div className="bg-danger/20 border border-danger/50 p-2 text-danger-200 font-mono text-sm inline-block rounded mb-4">
                                ERR_CODE: GEO_INVALID_0x99
                            </div>
                            <p className="text-slate-400 text-sm uppercase tracking-widest">Protocol Omega Failed. Resetting Coords.</p>
                        </div>
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col pointer-events-none">
                        <div className="px-8 py-6 flex justify-between items-start opacity-50 grayscale">
                            <div className="bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg p-3">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Target Region</div>
                                <div className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-500">radar</span>
                                    LATAM SECTOR 4
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify.center">
                                    <span className="material-symbols-outlined">remove</span>
                                </button>
                            </div>
                        </div>
                        <div className="mt-auto p-8 pb-10 flex justify-center w-full pointer-events-auto">
                            <div className="flex gap-4 w-full max-w-4xl">
                                <button className="group relative flex-1 bg-ui-panel/40 backdrop-blur-sm border border-[#233348] rounded-xl p-4 text-left opacity-50 cursor-not-allowed">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-[#233348] text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">OPT-A</div>
                                        <span className="material-symbols-outlined text-slate-600 text-sm">lock</span>
                                    </div>
                                    <h4 className="text-slate-400 text-lg font-bold mb-1">Lima, Peru</h4>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-mono text-slate-600">12.0464° S, 77.0428° W</p>
                                    </div>
                                </button>
                                <button className="group relative flex-1 bg-ui-panel/40 backdrop-blur-sm border border-[#233348] rounded-xl p-4 text-left opacity-50 cursor-not-allowed">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-[#233348] text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">OPT-B</div>
                                        <span className="material-symbols-outlined text-slate-600 text-sm">lock</span>
                                    </div>
                                    <h4 className="text-slate-400 text-lg font-bold mb-1">Santiago, Chile</h4>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-mono text-slate-600">33.4489° S, 70.6693° W</p>
                                    </div>
                                </button>
                                <button className="group relative flex-1 bg-red-950/80 backdrop-blur-md border-2 border-danger rounded-xl p-4 text-left shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">ERROR</div>
                                        <span className="material-symbols-outlined text-danger text-sm">close</span>
                                    </div>
                                    <h4 className="text-white text-lg font-bold mb-1">Buenos Aires, AR</h4>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-mono text-red-300">34.6037° S, 58.3816° W</p>
                                        <div className="text-danger text-xs font-bold flex items-center gap-1">
                                            ACCESS DENIED <span className="material-symbols-outlined text-[14px]">block</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 bg-danger rounded-b-xl w-full"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .terminal-cursor {
                    display: inline-block;
                    width: 10px;
                    height: 1.2em;
                    background-color: #ef4444;
                    animation: blink 0.5s step-end infinite;
                    vertical-align: text-bottom;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-pulse-fast {
                    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .glitch-text {
                    text-shadow: 2px 0 #ef4444, -2px 0 #136dec;
                }
            `}</style>
        </div>
    );
};

export default IncorrectGuessPage;
