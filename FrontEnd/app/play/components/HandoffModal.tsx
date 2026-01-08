import React from 'react';
import { Power, Shield } from 'lucide-react';

interface HandoffModalProps {
    onStart: () => void;
}

const HandoffModal: React.FC<HandoffModalProps> = ({ onStart }) => {
    const [isExiting, setIsExiting] = React.useState(false);

    const handleStart = () => {
        setIsExiting(true);
        setTimeout(() => {
            onStart();
        }, 1000); // Wait for fade to black
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 font-display ${isExiting ? 'pointer-events-none' : ''}`}>
            {/* Backdrop with Blur */}
            <div className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-all duration-500 ${isExiting ? 'opacity-0' : 'animate-in fade-in duration-500'}`}>
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('/noise.png')] pointer-events-none"></div>
                <div className="absolute inset-0 z-10 pointer-events-none bg-[size:100%_4px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] opacity-10"></div>
            </div>

            {/* Fade to Black Overlay */}
            <div className={`fixed inset-0 z-[100] bg-black transition-opacity duration-1000 pointer-events-none ${isExiting ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Content Container */}
            <div className={`relative z-10 w-full max-w-4xl p-4 ${isExiting ? 'animate-out fade-out zoom-out-95 duration-500 fill-mode-forwards' : 'animate-in zoom-in-95 duration-500'}`}>
                {/* Central HUD */}
                <div className="flex flex-col w-full bg-[#111822]/95 backdrop-blur-xl border border-primary/30 rounded-xl shadow-[0_0_60px_rgba(19,109,236,0.3)] overflow-hidden relative group ring-1 ring-primary/20">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg"></div>

                    {/* Header Gradient Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

                    {/* Header Banner */}
                    <div className="py-6 px-6 text-center relative overflow-hidden">
                        <h2 className="text-white text-lg md:text-xl font-bold leading-tight tracking-[0.1em] flex items-center justify-center gap-3 relative z-10 uppercase drop-shadow-lg">
                            <Shield className="size-6 text-primary animate-pulse" />
                            Tactical Handoff Ready
                            <Shield className="size-6 text-primary animate-pulse" />
                        </h2>
                        <div className="flex justify-center mt-2">
                            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"></span>
                                <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">Secure Connection</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 flex flex-col items-center relative pt-4">
                        {/* Background Grid */}
                        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>

                        <div className="relative w-full max-w-lg mx-auto mb-10 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300 fill-mode-both">
                            <div className="flex gap-4 relative z-10">
                                <div className="flex flex-1 flex-col items-center gap-2 group/timer">
                                    <div className="w-full aspect-[4/3] flex items-center justify-center rounded-lg bg-[#0d121a] border border-[#233348] shadow-inner relative overflow-hidden group-hover/timer:border-primary/30 transition-colors">
                                        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent"></div>
                                        <p className="text-white text-5xl md:text-7xl font-bold tracking-tighter text-glow opacity-50">00</p>
                                    </div>
                                    <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">HRS</p>
                                </div>
                                <div className="flex flex-col justify-center h-full pt-4">
                                    <span className="text-2xl text-primary/50 font-bold animate-pulse">:</span>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-2">
                                    <div className="w-full aspect-[4/3] flex items-center justify-center rounded-lg bg-[#0d121a] border border-[#233348] shadow-inner relative overflow-hidden">
                                        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent"></div>
                                        <p className="text-white text-5xl md:text-7xl font-bold tracking-tighter text-glow opacity-50">00</p>
                                    </div>
                                    <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">MIN</p>
                                </div>
                                <div className="flex flex-col justify-center h-full pt-4">
                                    <span className="text-2xl text-primary/50 font-bold animate-pulse">:</span>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-2">
                                    <div className="w-full aspect-[4/3] flex items-center justify-center rounded-lg bg-[#0B1016] border border-primary/50 shadow-[0_0_20px_rgba(19,109,236,0.2)] relative overflow-hidden ring-1 ring-primary/20">
                                        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent"></div>
                                        <p className="text-white text-5xl md:text-7xl font-bold tracking-tighter text-glow">60</p>
                                    </div>
                                    <p className="text-primary text-xs font-mono uppercase tracking-widest font-bold">SEC</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-[#233348] pt-2 px-2">
                                <span>SYNC: <span className="text-emerald-500">STABLE</span></span>
                                <span className="text-primary animate-pulse tracking-wider">AWAITING AUTHORIZATION...</span>
                                <span>LATENCY: 12ms</span>
                            </div>
                        </div>

                        <div className="text-center w-full max-w-md mx-auto space-y-8 relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500 fill-mode-both">
                            <div>
                                <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2 tracking-wide font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">MISSION PARAMETERS CONFIRMED</h2>
                                <p className="text-slate-400 text-sm tracking-wide">Control transferred. Initialize uplink to begin operation.</p>
                            </div>
                            <div className="flex justify-center relative group/btn">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur opacity-25 group-hover/btn:opacity-75 transition duration-500"></div>
                                <button
                                    onClick={handleStart}
                                    className="relative flex w-full max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary hover:bg-blue-600 transition-all duration-300 shadow-[0_0_20px_rgba(19,109,236,0.3)] hover:shadow-[0_0_30px_rgba(19,109,236,0.5)] border border-primary/50"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    <Power className="mr-3 animate-pulse size-5 text-white" />
                                    <span className="text-white text-lg font-bold leading-normal tracking-widest uppercase">Initiate Mission</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-20 bg-[#080c10] p-3 border-t border-[#233348] flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"></span>
                            Secure Uplink Established
                        </span>
                        <span>v.2.0.4 // PROTOCOL OMEGA</span>
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
                 @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default HandoffModal;
