'use client';

import React from 'react';
import Link from 'next/link';

const WakeUpPage = () => {
    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-hidden tech-grid-bg text-white">
            {/* Header */}
            <header className="w-full border-b border-border-tech/50 bg-background-dark/80 backdrop-blur-sm z-10">
                <div className="layout-container flex w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">lock</span>
                        <p className="text-slate-400 text-xs sm:text-sm font-medium tracking-widest uppercase">SECURE CHANNEL // PROTOCOL OMEGA INITIALIZED</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-slate-500 text-xs font-mono hidden sm:block">SYS_UPTIME: 00:00:12</p>
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-y-auto">
                <div className="w-full max-w-4xl flex flex-col gap-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div className="flex flex-col gap-1 rounded border border-border-tech bg-background-dark/50 p-3 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-1 opacity-50"><span className="material-symbols-outlined text-primary text-lg">enhanced_encryption</span></div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Encryption</p>
                            <p className="text-white text-lg md:text-xl font-bold leading-none tracking-tight">AES-256</p>
                        </div>
                        <div className="flex flex-col gap-1 rounded border border-border-tech bg-background-dark/50 p-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 opacity-50"><span className="material-symbols-outlined text-green-500 text-lg">wifi</span></div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Connection</p>
                            <p className="text-green-400 text-lg md:text-xl font-bold leading-none tracking-tight">STABLE</p>
                        </div>
                        <div className="flex flex-col gap-1 rounded border border-border-tech bg-background-dark/50 p-3 relative overflow-hidden col-span-2 md:col-span-1">
                            <div className="absolute top-0 right-0 p-1 opacity-50"><span className="material-symbols-outlined text-primary text-lg">satellite_alt</span></div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Uplink</p>
                            <p className="text-primary text-lg md:text-xl font-bold leading-none tracking-tight">ACTIVE</p>
                        </div>
                    </div>

                    {/* Central Visualizer */}
                    <div className="relative w-full rounded-lg border border-border-tech bg-background-dark overflow-hidden shadow-2xl shadow-primary/5">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                        <div className="absolute bottom-4 right-4 text-xs text-primary/40 font-mono hidden md:block">FREQ: 142.885 MHz</div>
                        <div className="flex flex-col md:flex-row items-stretch">
                            <div className="relative w-full md:w-2/3 h-64 md:h-auto bg-black/40 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border-tech">
                                <div className="absolute inset-0 bg-center bg-cover opacity-80 mix-blend-screen" style={{ backgroundImage: "url('/waveform.png')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark/20"></div>
                                <div className="relative z-10 size-24 md:size-32 rounded-full border border-primary/30 flex items-center justify-center">
                                    <div className="size-20 md:size-28 rounded-full border border-primary/60 border-dashed animate-[spin_10s_linear_infinite]"></div>
                                    <span className="material-symbols-outlined text-white text-4xl drop-shadow-[0_0_10px_rgba(19,109,236,0.8)]">graphic_eq</span>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 p-6 flex flex-col justify-center gap-4 bg-background-dark/80">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Live Feed</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white leading-tight uppercase tracking-tight">Director Vance</h2>
                                    <p className="text-primary text-sm font-medium tracking-wide border-l-2 border-primary pl-2 mt-1">INTEL HEAD</p>
                                </div>
                                <div className="h-px w-full bg-border-tech/50"></div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>SIGNAL</span>
                                        <span className="text-white">98%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1">
                                        <div className="bg-primary h-1 rounded-full" style={{ width: '98%' }}></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>VOICE MATCH</span>
                                        <span className="text-white">CONFIRMED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transcription Box */}
                    <div className="w-full rounded-lg border border-border-tech/50 bg-slate-900/50 backdrop-blur-md p-5 md:p-6 shadow-lg">
                        <div className="flex gap-4 items-start">
                            <div className="hidden sm:flex flex-col items-center gap-1 mt-1">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded border border-primary/30 size-10 grayscale hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: "url('/director-vance.jpg')" }}></div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Incoming Transmission</p>
                                <p className="text-white text-lg md:text-xl font-light leading-relaxed font-mono">
                                    <span className="text-primary mr-2">&gt;&gt;</span>
                                    "Agent, listen closely. We have a breach in sector 4. The geography doesn't match the maps. We need eyes on the ground immediately."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex justify-center pt-4 pb-8">
                        <Link href="/handoff" className="group relative flex items-center justify-center overflow-hidden rounded-md h-14 px-8 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(19,109,236,0.3)] hover:shadow-[0_0_30px_rgba(19,109,236,0.5)]">
                            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-white/50"></div>
                            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-white/50"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-white text-base font-bold tracking-[0.1em] uppercase group-hover:tracking-[0.15em] transition-all">Acknowledge Protocol</span>
                                <span className="text-[10px] text-blue-200 font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1">INITIATE_RESPONSE</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-2 border-t border-border-tech/30 bg-background-dark/90 text-center">
                <p className="text-[10px] text-slate-600 font-mono tracking-widest">SERVER LOCATION: [REDACTED] // PROTOCOL OMEGA V.2.0.4</p>
            </footer>

            <style jsx global>{`
                body {
                    font-family: "Space Grotesk", sans-serif;
                }
                .tech-grid-bg {
                    background-size: 40px 40px;
                    background-image: linear-gradient(rgba(50, 72, 103, 0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(50, 72, 103, 0.1) 1px, transparent 1px);
                }
            `}</style>
        </div>
    );
};

export default WakeUpPage;
