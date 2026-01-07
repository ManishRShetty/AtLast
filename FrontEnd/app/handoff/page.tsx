'use client';

import React from 'react';
import Link from 'next/link';
import { AudioWaveform, LocateFixed, TriangleAlert, Power } from 'lucide-react';

const HandoffPage = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary selection:text-white">
            {/* Effects */}
            <div className="scanline"></div>
            <div className="absolute inset-0 grid-bg pointer-events-none z-0"></div>
            <div className="relative z-10 flex flex-col h-full grow">
                {/* Header */}
                {/* <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233348] bg-[#111822]/90 backdrop-blur-sm px-6 lg:px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-4 text-white">
                        <div className="size-6 text-primary animate-pulse">
                            <svg className="size-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-white text-lg font-bold leading-tight tracking-wider">ATLAST: PROTOCOL OMEGA</h2>
                            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em]">Secure Connection Established</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-surface-dark border border-[#233348]">
                            <span className="material-symbols-outlined text-green-500 text-[16px]">encrypted</span>
                            <span className="text-xs text-gray-300 font-mono">TLS 1.3 ENCRYPTED</span>
                        </div>
                        <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-alert/20 border border-alert/50 text-red-400 text-sm font-bold leading-normal tracking-[0.05em] animate-pulse">
                            <span className="material-symbols-outlined text-[18px] mr-2">warning</span>
                            <span>DEFCON 1</span>
                        </button>
                        <div className="hidden md:flex gap-2">
                            <button className="flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#233348] text-white hover:bg-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">signal_cellular_alt</span>
                            </button>
                            <button className="flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#233348] text-white hover:bg-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">wifi_tethering</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-[#233348]">
                            <div className="size-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-sm">person</span>
                            </div>
                            <div className="hidden lg:block text-right">
                                <p className="text-xs text-white font-bold">OPERATOR_7</p>
                                <p className="text-[10px] text-primary">CLEARANCE: ALPHA</p>
                            </div>
                        </div>
                    </div>
                </header> */}

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 relative">
                    {/* Side Panels */}
                    <div className="hidden xl:flex flex-col absolute left-10 top-1/2 -translate-y-1/2 w-64 gap-4 pointer-events-none opacity-60">
                        <div className="border border-[#233348] bg-surface-dark/50 p-4 rounded-lg">
                            <h3 className="text-xs text-gray-400 mb-2 font-mono uppercase border-b border-gray-700 pb-1">System Log</h3>
                            <div className="font-mono text-[10px] text-primary/80 flex flex-col gap-1 h-32 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent z-10"></div>
                                <p>&gt; Handshake initiated...</p>
                                <p>&gt; Identifying remote host...</p>
                                <p>&gt; [SUCCESS] 192.168.0.1</p>
                                <p>&gt; Decrypting packet 44XA-9...</p>
                                <p>&gt; Override command received.</p>
                                <p>&gt; Battle mode protocols loaded.</p>
                                <p>&gt; Waiting for user confirmation...</p>
                            </div>
                        </div>
                        <div className="border border-[#233348] bg-surface-dark/50 p-4 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#136dec_2px,#136dec_4px)]"></div>
                            </div>
                            <AudioWaveform className="text-primary animate-pulse size-9" />
                        </div>
                    </div>
                    <div className="hidden xl:flex flex-col absolute right-10 top-1/2 -translate-y-1/2 w-64 gap-4 pointer-events-none opacity-60">
                        <div className="border border-[#233348] bg-surface-dark/50 rounded-lg overflow-hidden h-48 relative">
                            <img alt="Abstract dark topographic map visualization" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" src="/topo-map.png" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <LocateFixed className="text-red-500 size-9 animate-ping opacity-75 absolute" />
                                <LocateFixed className="text-white size-9 relative z-10" />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white font-mono border border-gray-700">
                                LOC: 34.0522° N, 118.2437° W
                            </div>
                        </div>
                    </div>

                    {/* Central HUD */}
                    <div className="layout-content-container flex flex-col w-full max-w-[720px] bg-[#111822]/80 backdrop-blur-md border border-primary/30 rounded-xl shadow-[0_0_50px_rgba(19,109,236,0.15)] overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
                        <div className="bg-gradient-to-r from-red-900/40 via-red-900/10 to-red-900/40 border-b border-red-500/20 py-3 px-6 text-center">
                            <h2 className="text-red-400 text-lg md:text-xl font-bold leading-tight tracking-[0.1em] flex items-center justify-center gap-3">
                                <TriangleAlert className="size-6" />
                                WARNING: BATTLE MODE ENGAGED
                                <TriangleAlert className="size-6" />
                            </h2>
                        </div>
                        <div className="p-8 md:p-12 flex flex-col items-center">
                            <div className="relative w-full max-w-lg mx-auto mb-10">
                                <div className="absolute -inset-4 bg-primary/10 blur-xl rounded-full"></div>
                                <div className="flex gap-4 relative z-10">
                                    <div className="flex flex-1 flex-col items-center gap-2 group/timer">
                                        <div className="w-full aspect-[4/3] flex items-center justify-center rounded-lg bg-[#0d121a] border border-[#233348] shadow-inner relative overflow-hidden">
                                            <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent"></div>
                                            <p className="text-white text-5xl md:text-7xl font-bold tracking-tighter text-glow opacity-50">00</p>
                                        </div>
                                        <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">HRS</p>
                                    </div>
                                    <div className="flex flex-col justify-center h-full pt-4">
                                        <span className="text-2xl text-gray-600 font-bold animate-pulse">:</span>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center gap-2">
                                        <div className="w-full aspect-[4/3] flex items-center justify-center rounded-lg bg-[#0d121a] border border-[#233348] shadow-inner relative overflow-hidden">
                                            <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent"></div>
                                            <p className="text-white text-5xl md:text-7xl font-bold tracking-tighter text-glow opacity-50">00</p>
                                        </div>
                                        <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">MIN</p>
                                    </div>
                                    <div className="flex flex-col justify-center h-full pt-4">
                                        <span className="text-2xl text-gray-600 font-bold animate-pulse">:</span>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center gap-2">
                                        <div className="w-full aspect-[4/3] flex items-center justify-center rounded-lg bg-[#0d121a] border border-primary/50 shadow-[inset_0_0_20px_rgba(19,109,236,0.2)] relative overflow-hidden ring-2 ring-primary/20">
                                            <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent"></div>
                                            <p className="text-white text-5xl md:text-7xl font-bold tracking-tighter text-glow">60</p>
                                        </div>
                                        <p className="text-primary text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">SEC</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-center text-xs font-mono text-gray-500 border-t border-gray-800 pt-2 px-2">
                                    <span>SYNC: FROZEN</span>
                                    <span className="text-primary animate-pulse">WAITING FOR HANDOFF...</span>
                                    <span>LATENCY: 0ms</span>
                                </div>
                            </div>
                            <div className="text-center w-full max-w-md mx-auto space-y-8">
                                <div>
                                    <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2 tracking-wide">WAITING FOR OPERATOR INPUT...</h2>
                                    <p className="text-gray-400 text-sm">Control has been transferred to your terminal. Initialize the link to begin the mission.</p>
                                </div>
                                <div className="flex justify-center relative group/btn">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur opacity-25 group-hover/btn:opacity-75 transition duration-500"></div>
                                    <Link href="/play" className="relative flex w-full max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary hover:bg-blue-600 transition-all duration-300 text-white text-lg font-bold leading-normal tracking-widest uppercase shadow-xl transform active:scale-95 border-b-4 border-blue-800 hover:border-blue-900">
                                        <Power className="mr-3 animate-pulse size-6" />
                                        <span className="truncate">Initiate Mission</span>
                                    </Link>
                                </div>
                                <div className="text-[10px] text-gray-600 font-mono">
                                    By clicking initiate, you agree to Protocol Omega Terms of Engagement.
                                </div>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-[#233348] flex">
                            <div className="h-full bg-primary w-1/3 animate-[pulse_3s_ease-in-out_infinite]"></div>
                            <div className="h-full bg-transparent w-1/3"></div>
                            <div className="h-full bg-alert w-1/3 opacity-50"></div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-[#233348] bg-[#111822] px-6 py-2 flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase tracking-widest z-10">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Server Status: ONLINE</span>
                        <span className="hidden md:inline">Build: v2.4.0-RC3</span>
                    </div>
                    <div>
                        ID: 8849-XK-229
                    </div>
                </footer>
            </div>

            <style jsx global>{`
                .grid-bg {
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                }
                .scanline {
                    width: 100%;
                    height: 100px;
                    z-index: 10;
                    background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(19, 109, 236, 0.1) 50%, rgba(0,0,0,0) 100%);
                    opacity: 0.1;
                    position: absolute;
                    bottom: 100%;
                    animation: scanline 10s linear infinite;
                    pointer-events: none;
                }
                @keyframes scanline {
                    0% { bottom: 100%; }
                    100% { bottom: -100px; }
                }
                .text-glow {
                    text-shadow: 0 0 10px rgba(19, 109, 236, 0.5);
                }
            `}</style>
        </div>
    );
};

export default HandoffPage;
