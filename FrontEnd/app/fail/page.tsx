'use client';

import React from 'react';
import Link from 'next/link';

const SignalLostPage = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden">
            {/* Main Container */}
            <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0 opacity-20 bg-noise pointer-events-none" style={{ backgroundImage: "url('/noise.png')" }}></div>
                <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('/bg-map.jpg')" }}></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent"></div>
                {/* Decorative Scanlines */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[size:100%_4px] bg-scanline opacity-10"></div>
                {/* Corner Accents */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-lg hidden md:block"></div>
                <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/50 rounded-tr-lg hidden md:block"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/50 rounded-bl-lg hidden md:block"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/50 rounded-br-lg hidden md:block"></div>

                {/* Main Content Wrapper */}
                <div className="relative z-20 flex flex-col items-center w-full max-w-[800px] gap-8">
                    {/* Warning Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-failure-red/10 border border-failure-red/30 rounded text-failure-red text-xs font-bold tracking-[0.2em] animate-pulse">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        <span>CONNECTION TERMINATED</span>
                    </div>

                    {/* Hero Text Section */}
                    <div className="text-center space-y-2">
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none glitch-text select-none" data-text="SIGNAL LOST">
                            SIGNAL LOST
                        </h1>
                        <p className="text-failure-red text-xl md:text-2xl font-bold tracking-[0.2em] uppercase opacity-90 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                            TARGET: CITY DETONATED
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[#111822]/80 backdrop-blur-sm border border-[#324867] rounded-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                        <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-[#324867]/50 relative">
                            <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Final Score</div>
                            <div className="text-4xl font-bold text-primary drop-shadow-[0_0_15px_rgba(19,109,236,0.4)]">14,250</div>
                            <div className="text-[#556987] text-[10px] mt-1">NEW PERSONAL BEST</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-[#324867]/50">
                            <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Time Elapsed</div>
                            <div className="text-3xl font-bold text-white tracking-wider">08:45</div>
                            <div className="text-[#556987] text-[10px] mt-1">LIMIT EXCEEDED</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4">
                            <div className="text-[#92a9c9] text-xs font-medium tracking-widest uppercase mb-1">Locations Secured</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">12</span>
                                <span className="text-xl text-[#556987] font-medium">/ 20</span>
                            </div>
                            <div className="text-failure-red/70 text-[10px] mt-1 font-bold">INCOMPLETE</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full max-w-[480px] gap-4">
                        <Link href="/play" className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(19,109,236,0.3)] hover:shadow-[0_0_30px_rgba(19,109,236,0.5)] border border-primary/50">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <span className="material-symbols-outlined mr-2 text-white/90">restart_alt</span>
                            <span className="text-white text-lg font-bold uppercase tracking-wider">Re-Initialize Protocol</span>
                        </Link>
                        <div className="flex gap-4">
                            <button className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#233348] hover:bg-[#2c405a] border border-[#324867] text-[#92a9c9] hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">
                                <span className="material-symbols-outlined text-sm mr-2">list_alt</span>
                                <span>Mission Log</span>
                            </button>
                            <button className="flex-1 flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#233348] hover:bg-failure-red/20 border border-[#324867] hover:border-failure-red/50 text-[#92a9c9] hover:text-failure-red transition-all text-sm font-bold uppercase tracking-wide">
                                <span className="material-symbols-outlined text-sm mr-2">logout</span>
                                <span>Abort</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer Meta */}
                    <div className="pt-8 text-center opacity-60">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#324867] to-transparent mx-auto mb-4"></div>
                        <p className="text-[#556987] text-xs font-mono tracking-[0.2em] uppercase">
                            System Halted // Terminal ID: OMEGA-9 // ERROR_CODE: 0x4B2
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .bg-noise {
                    background-image: url(/noise.png);
                }
                .glitch-text {
                    position: relative;
                }
                .glitch-text::before, .glitch-text::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .glitch-text::before {
                    left: 2px;
                    text-shadow: -1px 0 #ff00c1;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim 5s infinite linear alternate-reverse;
                }
                .glitch-text::after {
                    left: -2px;
                    text-shadow: -1px 0 #00fff9;
                    clip: rect(44px, 450px, 56px, 0);
                    animation: glitch-anim2 5s infinite linear alternate-reverse;
                }
                @keyframes glitch-anim {
                    0% { clip: rect(44px, 9999px, 56px, 0); } 5% { clip: rect(3px, 9999px, 9px, 0); } 10% { clip: rect(82px, 9999px, 12px, 0); } 15% { clip: rect(10px, 9999px, 90px, 0); } 20% { clip: rect(40px, 9999px, 60px, 0); } 25% { clip: rect(2px, 9999px, 34px, 0); } 30% { clip: rect(98px, 9999px, 12px, 0); } 35% { clip: rect(32px, 9999px, 48px, 0); } 40% { clip: rect(12px, 9999px, 66px, 0); } 45% { clip: rect(86px, 9999px, 22px, 0); } 50% { clip: rect(54px, 9999px, 94px, 0); } 55% { clip: rect(24px, 9999px, 4px, 0); } 60% { clip: rect(72px, 9999px, 88px, 0); } 65% { clip: rect(100px, 9999px, 30px, 0); } 70% { clip: rect(6px, 9999px, 58px, 0); } 75% { clip: rect(46px, 9999px, 76px, 0); } 80% { clip: rect(28px, 9999px, 16px, 0); } 85% { clip: rect(92px, 9999px, 52px, 0); } 90% { clip: rect(62px, 9999px, 38px, 0); } 95% { clip: rect(18px, 9999px, 84px, 0); } 100% { clip: rect(36px, 9999px, 68px, 0); }
                }
                @keyframes glitch-anim2 {
                    0% { clip: rect(12px, 9999px, 94px, 0); } 5% { clip: rect(48px, 9999px, 24px, 0); } 10% { clip: rect(88px, 9999px, 6px, 0); } 15% { clip: rect(34px, 9999px, 56px, 0); } 20% { clip: rect(66px, 9999px, 80px, 0); } 25% { clip: rect(4px, 9999px, 42px, 0); } 30% { clip: rect(76px, 9999px, 18px, 0); } 35% { clip: rect(22px, 9999px, 96px, 0); } 40% { clip: rect(52px, 9999px, 30px, 0); } 45% { clip: rect(90px, 9999px, 62px, 0); } 50% { clip: rect(14px, 9999px, 72px, 0); } 55% { clip: rect(58px, 9999px, 38px, 0); } 60% { clip: rect(36px, 9999px, 10px, 0); } 65% { clip: rect(82px, 9999px, 54px, 0); } 70% { clip: rect(26px, 9999px, 86px, 0); } 75% { clip: rect(68px, 9999px, 46px, 0); } 80% { clip: rect(10px, 9999px, 28px, 0); } 85% { clip: rect(60px, 9999px, 92px, 0); } 90% { clip: rect(40px, 9999px, 64px, 0); } 95% { clip: rect(96px, 9999px, 20px, 0); } 100% { clip: rect(32px, 9999px, 50px, 0); }
                }
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
};

export default SignalLostPage;
