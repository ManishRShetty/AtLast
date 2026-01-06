'use client';

import React from 'react';
import Link from 'next/link';

const TargetNeutralizedPage = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col">
            {/* Header */}
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233348] bg-ui-panel px-6 py-3 z-20 shadow-md">
                <div className="flex items-center gap-4 text-white">
                    <div className="size-8 flex items-center justify-center bg-primary/20 rounded text-primary">
                        <span className="material-symbols-outlined text-2xl">globe_asia</span>
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
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-1 rounded-full border border-emerald-500/30">
                        <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                        <span className="text-emerald-500 text-xs font-bold tracking-widest">THREAT RESOLVED</span>
                    </div>
                    <div className="relative">
                        <div className="text-3xl font-bold tracking-widest font-mono mt-1 text-emerald-400 tabular-nums drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                            01:00:55
                        </div>
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400 font-bold text-sm animate-pulse">
                            <span>+10s</span>
                            <span className="material-symbols-outlined text-sm">history</span>
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
                    <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 w-9 bg-primary hover:bg-blue-600 text-white transition-colors ml-2">
                        <span className="material-symbols-outlined text-[20px]">pause</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Aside */}
                <aside className="w-[30%] min-w-[350px] max-w-[500px] flex flex-col border-r border-[#233348] bg-terminal-bg relative z-10 shadow-2xl">
                    <div className="px-5 py-3 border-b border-[#233348] flex justify-between items-center bg-[#0d1219]">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">terminal</span>
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
                            &gt; Rerouting via proxy: Singapor... Done.<br />
                            &gt; Rerouting via proxy: Helsinki... Done.
                        </div>
                        <div className="mb-2">
                            <span className="text-primary font-bold">root@omega:~$</span> decrypt_target_list
                        </div>
                        <div className="text-emerald-500 mb-2">
                            &gt; 3 Potential matches found.<br />
                            &gt; Analyzing topography...<br />
                            &gt; <span className="text-white">Displaying options on main HUD.</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-primary font-bold">root@omega:~$</span> lock_target --opt-c --confirm
                        </div>
                        <div className="text-emerald-400 font-bold animate-pulse">
                            &gt; GEOLOCATION CONFIRMED.<br />
                            &gt; TARGET NEUTRALIZED SUCCESSFULLY.<br />
                            &gt; REWARD ALLOCATED.<span className="terminal-cursor"></span>
                        </div>
                    </div>
                    <div className="p-3 border-t border-[#233348] bg-[#0d1219]">
                        <div className="flex items-center gap-2 bg-background-dark border border-emerald-900/50 rounded px-3 py-2 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            <span className="text-emerald-500 text-xs">&gt;</span>
                            <span className="text-emerald-500 text-xs">Awaiting next directive...</span>
                        </div>
                    </div>
                </aside>

                {/* Section */}
                <section className="flex-1 relative bg-background-dark flex flex-col overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-80">
                        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 via-transparent to-background-dark z-10 pointer-events-none"></div>
                        <img alt="Dark satellite view of Earth from space showing city lights and continents" className="w-full h-full object-cover grayscale contrast-125 brightness-75 scale-[2] origin-[35%_75%] transition-transform duration-[2000ms] ease-out" src="/bg-earth.jpg" />
                    </div>
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                        <div className="relative flex flex-col items-center animate-[bounce_1s_infinite]">
                            <div className="bg-emerald-600/90 backdrop-blur-md border-y-4 border-emerald-400 text-white shadow-[0_0_60px_rgba(16,185,129,0.6)] transform -skew-x-12">
                                <div className="px-20 py-6 transform skew-x-12">
                                    <h1 className="text-6xl font-black tracking-[0.2em] drop-shadow-lg">NEUTRALIZED</h1>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-2 bg-black/60 backdrop-blur border border-emerald-500/50 rounded-full px-6 py-2">
                                <span className="material-symbols-outlined text-emerald-400 text-xl">military_tech</span>
                                <span className="text-emerald-400 font-mono text-xl font-bold tracking-widest">+5000 XP</span>
                            </div>
                        </div>
                        <Link href="/play" className="pointer-events-auto mt-16 group relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-[#0B1016] transition-all duration-300 transform -skew-x-12 shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_rgba(16,185,129,0.8)] hover:scale-105 active:scale-95 ring-2 ring-emerald-300 ring-offset-2 ring-offset-black/50">
                            <div className="absolute inset-0 bg-[url('/carbon-fibre.png')] opacity-10"></div>
                            <div className="px-12 py-5 transform skew-x-12 flex items-center gap-4">
                                <span className="material-symbols-outlined text-3xl">my_location</span>
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] opacity-70 leading-none mb-1">COORDINATES ACQUIRED</span>
                                    <span className="font-black tracking-[0.15em] text-xl uppercase leading-none">GO TO NEXT TARGET</span>
                                </div>
                                <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform ml-2">arrow_forward</span>
                            </div>
                        </Link>
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="px-8 py-6 flex justify-between items-start">
                            <div className="bg-background-dark/80 backdrop-blur-md border border-emerald-500/30 rounded-lg p-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <div className="text-xs text-emerald-500/70 uppercase tracking-wider mb-1">Status</div>
                                <div className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-emerald-500">verified</span>
                                    TARGET SECURED
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 opacity-50 pointer-events-none">
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <span className="material-symbols-outlined">remove</span>
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center mt-2">
                                    <span className="material-symbols-outlined">my_location</span>
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
                        <div className="mt-auto p-8 pb-10 flex justify-center w-full">
                            <div className="flex gap-4 w-full max-w-4xl">
                                <button className="group relative flex-1 bg-ui-panel/40 backdrop-blur-sm border border-[#233348]/50 rounded-xl p-4 text-left grayscale opacity-50 cursor-not-allowed">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-[#233348] text-white text-[10px] font-bold px-2 py-0.5 rounded">OPT-A</div>
                                        <span className="material-symbols-outlined text-slate-500 text-sm">lock</span>
                                    </div>
                                    <h4 className="text-white text-lg font-bold mb-1">Lima, Peru</h4>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-mono text-slate-400">12.0464° S, 77.0428° W</p>
                                    </div>
                                </button>
                                <button className="group relative flex-1 bg-ui-panel/40 backdrop-blur-sm border border-[#233348]/50 rounded-xl p-4 text-left grayscale opacity-50 cursor-not-allowed">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-[#233348] text-white text-[10px] font-bold px-2 py-0.5 rounded">OPT-B</div>
                                        <span className="material-symbols-outlined text-slate-500 text-sm">lock</span>
                                    </div>
                                    <h4 className="text-white text-lg font-bold mb-1">Santiago, Chile</h4>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-mono text-slate-400">33.4489° S, 70.6693° W</p>
                                    </div>
                                </button>
                                <button className="group relative flex-1 bg-emerald-900/30 backdrop-blur-md border-2 border-emerald-500 rounded-xl p-4 text-left ring-4 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">CORRECT</div>
                                        <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                                    </div>
                                    <h4 className="text-white text-lg font-bold mb-1">Buenos Aires, AR</h4>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-mono text-emerald-300/70">34.6037° S, 58.3816° W</p>
                                        <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                                            MATCH CONFIRMED <span className="material-symbols-outlined text-[14px]">done_all</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-b-sm"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10 bg-[url('/carbon-fibre.png')]"></div>
            <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent z-50"></div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .terminal-cursor {
                    display: inline-block;
                    width: 10px;
                    height: 1.2em;
                    background-color: #136dec;
                    animation: blink 1s step-end infinite;
                    vertical-align: text-bottom;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-pulse-slow {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default TargetNeutralizedPage;
