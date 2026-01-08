'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Unlock, WifiOff, Cpu, ShieldAlert, Lock } from 'lucide-react';
import AgentRegistrationModal from '@/components/AgentRegistrationModal';

const BreachPage = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleInitiateProtocol = () => {
        setIsModalOpen(true);
    };

    const handleModalComplete = (agentName: string, difficulty: string) => {
        // Save user name securely (simulated here with localStorage)
        if (typeof window !== 'undefined') {
            localStorage.setItem('atlast_agent_name', agentName);
            localStorage.setItem('atlast_difficulty', difficulty);
        }
        // setIsModalOpen(false); // Keep modal open during transition
        setIsTransitioning(true);
        setTimeout(() => {
            router.push('/intro');
        }, 2000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-white font-display overflow-y-auto h-screen w-full flex flex-col">
            {/* Modal */}
            <AgentRegistrationModal
                isOpen={isModalOpen}
                onComplete={handleModalComplete}
                onCancel={() => setIsModalOpen(false)}
            />

            {/* Transition Overlay */}
            <div className={`fixed inset-0 z-[100] bg-black pointer-events-none transition-opacity duration-2000 ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Effects */}
            <div className="absolute inset-0 z-50 pointer-events-none scanlines opacity-30"></div>
            <div className="absolute inset-0 z-40 pointer-events-none vignette"></div>
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #324867 1px, transparent 1px), linear-gradient(to bottom, #324867 1px, transparent 1px)' }}></div>

            {/* Header Removed - Replaced by Global Navbar */}
            {/* 
            <header className="relative z-30 flex items-center justify-between border-b border-[#233348]/50 bg-[#111822]/80 backdrop-blur-sm px-6 py-3 w-full">
                <div className="flex items-center gap-4">
                    <div className="size-6 text-primary">
                        <Radar />
                    </div>
                    <h2 className="text-white text-lg font-bold tracking-widest uppercase">AtLast: Protocol Omega</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-red-900/20 border border-red-500/50">
                        <AlertTriangle size={14} className="text-red-500" />
                        <span className="text-red-500 text-xs font-bold tracking-wider">SYSTEM BREACH DETECTED</span>
                    </div>
                    <div className="text-[#92a9c9] text-xs font-mono">
                        <span className="opacity-50">LAT:</span> 45.92 <span className="opacity-50">LON:</span> -12.04
                    </div>
                    <div className="size-8 rounded bg-[#233348] flex items-center justify-center border border-[#324867]">
                        <Settings size={14} className="text-primary" />
                    </div>
                </div>
            </header>
            */}

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 w-full max-w-[1400px] mx-auto">
                <div className="relative w-full max-w-4xl flex flex-col items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-2 text-center mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 mb-2">
                            <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-red-400 text-xs font-mono font-bold tracking-widest">CRITICAL ALERT</span>
                        </div>
                        <h1 className="glitch-text text-5xl md:text-7xl font-black tracking-tighter uppercase text-white leading-none">
                            Atlast
                        </h1>
                        <p className="text-[#92a9c9] text-sm md:text-base font-mono tracking-[0.2em] uppercase">
                            Currently in Development // Only UI Demonstartion // u.1.0.2
                        </p>
                    </div>
                    <div className="relative w-full h-64 md:h-80 bg-black/40 border-y border-[#324867] flex items-center justify-center overflow-hidden backdrop-blur-sm group">
                        <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('/digital-noise.png')" }}></div>
                        <svg className="w-full h-full px-4 md:px-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" preserveAspectRatio="none" viewBox="0 0 800 200">
                            <path d="M0,100 L20,100 L25,90 L30,110 L40,100 L100,100 L110,40 L120,160 L130,100 L200,100 L210,100 L215,100 L220,100 L250,100 L260,10 L270,190 L280,50 L290,150 L300,100 L350,100 L360,80 L370,120 L380,100 L400,100 L410,20 L420,180 L430,60 L440,140 L450,100 L500,100 L510,95 L520,105 L530,100 L600,100 L610,10 L620,190 L630,50 L640,150 L650,100 L700,100 L710,90 L720,110 L730,100 L780,100 L800,100" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                            <path className="opacity-50 blur-[2px] translate-x-1" d="M0,100 L20,100 L25,90 L30,110 L40,100 L100,100 L110,40 L120,160 L130,100 L200,100 L210,100 L215,100 L220,100 L250,100 L260,10 L270,190 L280,50 L290,150 L300,100 L350,100 L360,80 L370,120 L380,100 L400,100 L410,20 L420,180 L430,60 L440,140 L450,100 L500,100 L510,95 L520,105 L530,100 L600,100 L610,10 L620,190 L630,50 L640,150 L650,100 L700,100 L710,90 L720,110 L730,100 L780,100 L800,100" fill="none" stroke="#136dec" strokeWidth="1" vectorEffect="non-scaling-stroke"></path>
                        </svg>
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(19,109,236,0.3)_100%)] bg-[length:100%_20px] pointer-events-none"></div>
                    </div>
                    <div className="flex flex-col items-center gap-6 mt-4 w-full max-w-md">
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock size={18} className="text-primary animate-pulse" />
                                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Encrypted Transmission</span>
                            </div>
                            <div className="flex justify-between items-end px-1">
                                <span className="text-xs font-mono text-primary font-bold">DECRYPTION SEQUENCE</span>
                                <span className="text-xs font-mono text-white">87%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#233348] rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[87%] shadow-[0_0_10px_rgba(19,109,236,0.8)]"></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-[#92a9c9] uppercase">
                                <span>Packets: 40,392</span>
                                <span>Time: Unknown</span>
                            </div>
                        </div>
                        <button
                            onClick={handleInitiateProtocol}
                            className="group relative overflow-hidden rounded-lg bg-primary hover:bg-primary/90 text-white font-bold py-4 px-12 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(19,109,236,0.4)] border border-primary/50 w-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative z-10 flex items-center justify-center gap-3 tracking-widest text-lg">
                                <Unlock />
                                INITIATE PROTOCOL
                            </span>
                        </button>
                    </div>
                </div>

                {/* Side Panels */}
                <div className="hidden xl:flex flex-col gap-4 absolute left-10 top-1/2 -translate-y-1/2 w-64">
                    <div className="border border-[#324867] bg-[#111822]/90 p-4 rounded-lg backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#324867]">
                            <WifiOff size={14} className="text-red-500" />
                            <span className="text-xs font-bold text-[#92a9c9]">SIGNAL STRENGTH</span>
                        </div>
                        <div className="text-2xl font-bold text-red-500 tracking-wider">CRITICAL</div>
                        <div className="text-[10px] font-mono text-[#92a9c9] mt-1">NO CARRIER DETECTED</div>
                    </div>
                    <div className="border border-[#324867] bg-[#111822]/90 p-4 rounded-lg backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#324867]">
                            <Cpu size={14} className="text-primary" />
                            <span className="text-xs font-bold text-[#92a9c9]">PACKET LOSS</span>
                        </div>
                        <div className="text-2xl font-bold text-white tracking-wider">99.9%</div>
                        <div className="w-full h-1 bg-[#233348] mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-full"></div>
                        </div>
                    </div>
                </div>
                <div className="hidden xl:flex flex-col gap-4 absolute right-10 top-1/2 -translate-y-1/2 w-64 text-right">
                    <div className="border border-[#324867] bg-[#111822]/90 p-4 rounded-lg backdrop-blur-md">
                        <div className="flex items-center justify-end gap-2 mb-2 pb-2 border-b border-[#324867]">
                            <span className="text-xs font-bold text-[#92a9c9]">THREAT LEVEL</span>
                            <ShieldAlert size={14} className="text-red-500" />
                        </div>
                        <div className="text-2xl font-bold text-red-500 tracking-wider">OMEGA</div>
                        <div className="text-[10px] font-mono text-[#92a9c9] mt-1">CLASSIFIED // EYES ONLY</div>
                    </div>
                    <div className="border border-[#324867] bg-[#111822]/90 p-4 rounded-lg backdrop-blur-md font-mono text-xs text-[#92a9c9]">
                        <p className="mb-1">&gt; SYS_LOCK // FAILED</p>
                        <p className="mb-1 text-red-400">&gt; FIREWALL // BREACHED</p>
                        <p className="mb-1">&gt; REROUTING...</p>
                        <p className="animate-pulse">&gt; _</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-20 border-t border-[#233348] bg-[#111822] px-6 py-2 flex justify-between items-center text-[10px] md:text-xs text-[#92a9c9] font-mono tracking-wider w-full">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-red-500"></span>
                        LIVE FEED
                    </span>
                    <span className="hidden md:inline">SERVER: US-EAST-4</span>
                </div>
                <div className="uppercase text-center">
                    WARNING: Unauthorized Access Attempt
                </div>
                <div className="flex items-center gap-4">
                    <span>VER: 4.0.2</span>
                    <span>SECURE // <span className="text-red-500 font-bold">OFFLINE</span></span>
                </div>
            </footer>

            <style jsx global>{`
                .scanlines {
                    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
                    background-size: 100% 4px;
                }
                .glitch-text {
                    text-shadow: 2px 0 #ff2a2a, -2px 0 #136dec;
                }
                .vignette {
                    background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 90%);
                }
            `}</style>
        </div>
    );
};

export default BreachPage;
