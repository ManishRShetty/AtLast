import React from 'react';
import { TriangleAlert, Power } from 'lucide-react';

interface HandoffModalProps {
    onStart: () => void;
}

const HandoffModal: React.FC<HandoffModalProps> = ({ onStart }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop with Blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500"></div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl p-4 animate-in zoom-in-95 duration-300">
                {/* Side Panels (Simplified for Modal) */}
                {/* <div className="hidden xl:flex flex-col absolute -left-32 top-1/2 -translate-y-1/2 w-64 gap-4 pointer-events-none opacity-60">
                    <div className="border border-[#233348] bg-surface-dark/90 p-4 rounded-lg backdrop-blur">
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
                </div> */}

                {/* Central HUD */}
                <div className="flex flex-col w-full bg-[#111822]/90 backdrop-blur-xl border border-primary/30 rounded-xl shadow-[0_0_50px_rgba(19,109,236,0.3)] overflow-hidden relative group">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg"></div>

                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-red-900/40 via-red-900/10 to-red-900/40 border-b border-red-500/20 py-4 px-6 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                        <h2 className="text-red-400 text-lg md:text-xl font-bold leading-tight tracking-[0.1em] flex items-center justify-center gap-3 relative z-10">
                            <TriangleAlert className="size-6 animate-pulse" />
                            WARNING: BATTLE MODE ENGAGED
                            <TriangleAlert className="size-6 animate-pulse" />
                        </h2>
                    </div>

                    <div className="p-8 md:p-12 flex flex-col items-center relative">
                        {/* Background Grid */}
                        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>

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

                        <div className="text-center w-full max-w-md mx-auto space-y-8 relative z-10">
                            <div>
                                <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2 tracking-wide font-display">WAITING FOR OPERATOR INPUT...</h2>
                                <p className="text-gray-400 text-sm">Control has been transferred to your terminal. Initialize the link to begin the mission.</p>
                            </div>
                            <div className="flex justify-center relative group/btn">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur opacity-25 group-hover/btn:opacity-75 transition duration-500"></div>
                                <button
                                    onClick={onStart}
                                    className="relative flex w-full max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary hover:bg-blue-600 transition-all duration-300 text-white text-lg font-bold leading-normal tracking-widest uppercase shadow-xl transform active:scale-95 border-b-4 border-blue-800 hover:border-blue-900"
                                >
                                    <Power className="mr-3 animate-pulse size-6" />
                                    <span className="truncate">Initiate Mission</span>
                                </button>
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
            </div>

            <style jsx global>{`
                .grid-bg {
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                }
                .text-glow {
                    text-shadow: 0 0 10px rgba(19, 109, 236, 0.5);
                }
            `}</style>
        </div>
    );
};

export default HandoffModal;
