import React, { useEffect, useState } from 'react';
import { Power, Shield, Radio, Crosshair } from 'lucide-react';

interface HandoffModalProps {
    onStart: () => void;
}

const HandoffModal: React.FC<HandoffModalProps> = ({ onStart }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [glitchIntensity, setGlitchIntensity] = useState(0);

    const handleStart = () => {
        setIsExiting(true);
        setTimeout(() => {
            onStart();
        }, 800);
    };

    // Random glitch effect trigger
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.95) {
                setGlitchIntensity(1);
                setTimeout(() => setGlitchIntensity(0), 150);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center font-display overflow-hidden ${isExiting ? 'pointer-events-none' : ''}`}>

            {/* Layer 0: Global Fate-to-Black Overlay */}
            <div className={`fixed inset-0 bg-black z-[100] transition-opacity duration-1000 ease-in-out pointer-events-none ${isExiting ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Layer 1: Dark City Silhouette / Atmosphere */}
            <div className="absolute inset-0 z-0 bg-deep-black">
                {/* Placeholder for Cityscape */}
                <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10 bg-repeat animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
            </div>

            {/* Layer 2: Grid & Vignette */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Green Tech Grid */}
                <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.03)_1px,transparent_1px)]"></div>
                {/* Heavy Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_80%,#000000_100%)]"></div>
            </div>

            {/* Layer 3: Main Modal Content */}
            <div className={`relative z-20 w-full max-w-5xl p-6 transition-all duration-700 ${isExiting ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'}`}>

                {/* HUD Frame */}
                <div className="relative bg-black/80 backdrop-blur-md border border-slate-800 p-1">

                    {/* Decorative HUD Lines */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-neon-cyan"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-neon-cyan"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>

                    {/* Inner Content Wrapper */}
                    <div className="relative border border-slate-700/50 p-8 md:p-12 overflow-hidden flex flex-col items-center gap-10">

                        {/* Header Section */}
                        <div className="w-full flex justify-between items-start border-b border-slate-800 pb-4">
                            <div className="flex flex-col">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic select-none" style={{ textShadow: '0 0 20px rgba(0,255,255,0.3)' }}>
                                    Tactical <span className="text-neon-cyan">Handoff</span>
                                </h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-blink"></span>
                                    <span className="text-xs text-neon-cyan/70 tracking-[0.2em] font-mono">SECURE UPLINK ESTABLISHED</span>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col items-end text-xs font-mono text-slate-500">
                                <span>SYS.VER.4.0.2</span>
                                <span>ENCRYPTION: AES-4096</span>
                            </div>
                        </div>

                        {/* Central Visual / Info */}
                        <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center">

                            {/* Mission Status Widget */}
                            <div className="relative group p-6 border border-slate-800 bg-slate-900/50 w-full md:w-1/2 skew-x-[-12deg] hover:border-neon-cyan/50 transition-colors">
                                <div className="skew-x-[12deg]">
                                    <h3 className="text-slate-400 text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                                        <Shield size={14} /> Mission Status
                                    </h3>
                                    <div className="text-2xl text-white font-bold tracking-wide uppercase">
                                        Awaiting Operator Input
                                    </div>
                                    <div className="w-full bg-slate-800 h-1 mt-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-neon-cyan w-2/3 animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Signal Strength Widget */}
                            <div className="relative group p-6 border border-slate-800 bg-slate-900/50 w-full md:w-1/2 skew-x-[-12deg] hover:border-neon-cyan/50 transition-colors">
                                <div className="skew-x-[12deg]">
                                    <h3 className="text-slate-400 text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                                        <Radio size={14} /> Signal Strength
                                    </h3>
                                    <div className="flex items-end gap-1 h-8">
                                        {[1, 2, 3, 4, 5].map((bar) => (
                                            <div
                                                key={bar}
                                                className={`w-full bg-neon-cyan/20 h-full flex items-end transition-all duration-300`}
                                            >
                                                <div
                                                    className={`w-full bg-neon-cyan ${bar === 5 ? 'animate-pulse' : ''}`}
                                                    style={{ height: `${bar * 20}%`, opacity: bar === 5 ? 0.5 + Math.random() * 0.5 : 1 }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-6 w-full pt-6 justify-center items-center">

                            {/* Cancel / Secondary Button (Visual Only mostly, or could go back) */}
                            {/* <button className="relative group w-full md:w-48 h-14 bg-slate-900/80 border border-slate-600 text-slate-300 font-bold uppercase tracking-wider transform -skew-x-12 hover:bg-slate-800 hover:text-white transition-all overflow-hidden">
                                <span className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-x-12"></span>
                                <div className="skew-x-12 flex items-center justify-center gap-2">
                                    <X size={18} /> Abort
                                </div>
                            </button> */}

                            {/* Primary Action Button */}
                            <button
                                onClick={handleStart}
                                className="relative group w-full md:w-80 h-16 bg-slate-900 border border-neon-cyan/30 text-neon-cyan font-bold text-xl uppercase tracking-widest transform -skew-x-12 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-100 overflow-hidden"
                            >
                                {/* Glitch Overlay on Hover */}
                                <span className="absolute inset-0 bg-neon-cyan/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out skew-x-12"></span>
                                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-75 skew-x-12"></span>

                                <div className="skew-x-12 flex items-center justify-center gap-3 relative z-10">
                                    <span className="group-hover:animate-glitch inline-block">INITIATE</span>
                                    <Crosshair className={`size-6 group-hover:rotate-90 transition-transform duration-300 ${isExiting ? 'animate-spin' : ''}`} />
                                </div>
                            </button>
                        </div>

                        {/* Footer Warning */}
                        <div className="absolute bottom-2 w-full text-center">
                            <p className="text-[10px] text-red-500/80 font-mono tracking-[0.2em] animate-pulse">WARNING: AUTHORIZED PERSONNEL ONLY</p>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx global>{`
                .clip-corner {
                    clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
                }
            `}</style>
        </div>
    );
};

export default HandoffModal;
