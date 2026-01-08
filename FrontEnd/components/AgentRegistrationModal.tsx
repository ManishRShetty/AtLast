'use client';

import React, { useState } from 'react';
import { ChevronRight, Shield, Zap, Skull, TriangleAlert, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentRegistrationModalProps {
    isOpen: boolean;
    onComplete: (agentName: string, difficulty: string) => void;
    onCancel: () => void;
}

type Step = 'NAME' | 'DIFFICULTY';

const AgentRegistrationModal: React.FC<AgentRegistrationModalProps> = ({ isOpen, onComplete }) => {
    const [step, setStep] = useState<Step>('NAME');
    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState('AGENT'); // Default to Normal
    const [error, setError] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 2) {
            setError(true);
            return;
        }
        setStep('DIFFICULTY');
    };

    const handleFinalSubmit = () => {
        setIsExiting(true);
        setTimeout(() => {
            onComplete(name, difficulty);
        }, 500); // Wait for fade to black
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center font-display ${isExiting ? 'pointer-events-none' : ''}`}>
                    {/* Backdrop with Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`absolute inset-0 bg-black/90 backdrop-blur-sm ${isExiting ? 'opacity-0' : ''}`}
                    >
                        <div className="absolute inset-0 z-0 opacity-20 bg-[url('/noise.png')] pointer-events-none"></div>
                        <div className="absolute inset-0 z-10 pointer-events-none bg-[size:100%_4px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] opacity-10"></div>
                    </motion.div>

                    {/* Fade to Black Overlay */}
                    <div className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 pointer-events-none ${isExiting ? 'opacity-100' : 'opacity-0'}`}></div>

                    {/* Content Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`relative z-10 w-full max-w-4xl p-4 ${isExiting ? 'animate-out fade-out zoom-out-95 duration-500 fill-mode-forwards' : ''}`}
                    >
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
                                    AGENT AUTHENTICATION
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

                                {/* Dynamic Content Area (The Steps) */}
                                <div className="relative w-full max-w-md mx-auto z-20 min-h-[250px] flex flex-col justify-center">
                                    <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-8 tracking-wide font-display text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                        {step === 'NAME' ? 'IDENTIFY AGENT' : 'SELECT PARAMETERS'}
                                    </h3>

                                    {step === 'NAME' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="w-full"
                                        >
                                            <form onSubmit={handleNameSubmit} className="flex flex-col gap-8">
                                                <div className="relative group">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur-md"></div>
                                                    <div className="relative flex items-center bg-[#0B1016]/95 border border-[#233348] rounded-xl overflow-hidden transition-all group-focus-within:border-primary/60 group-focus-within:shadow-[0_0_20px_rgba(19,109,236,0.2)] backdrop-blur-xl">
                                                        <div className="pl-4 pr-2 text-primary flex items-center pointer-events-none select-none h-full shrink-0">
                                                            <span className="font-mono text-xs md:text-sm tracking-widest font-bold opacity-80 drop-shadow-[0_0_5px_rgba(19,109,236,0.5)]">CODENAME //</span>
                                                        </div>
                                                        <div className="w-[1px] h-8 bg-[#233348]"></div>
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => {
                                                                setName(e.target.value);
                                                                setError(false);
                                                            }}
                                                            className="w-full bg-transparent border-none outline-none text-white font-mono text-lg md:text-xl py-4 px-4 focus:ring-0 focus:outline-none focus:border-none placeholder-slate-700 tracking-wider uppercase"
                                                            placeholder="ENTER_ID..."
                                                            autoFocus
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    {error && (
                                                        <div className="absolute top-full left-0 mt-2 text-red-500 text-xs font-mono tracking-widest flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                                                            <TriangleAlert size={12} />
                                                            <span>ERROR: INVALID IDENTIFIER</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-center relative group/btn">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur opacity-25 group-hover/btn:opacity-75 transition duration-500"></div>
                                                    <button
                                                        type="submit"
                                                        className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary hover:bg-blue-600 transition-all duration-300 shadow-[0_0_20px_rgba(19,109,236,0.3)] hover:shadow-[0_0_30px_rgba(19,109,236,0.5)] border border-primary/50"
                                                    >
                                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                                        <span className="text-white text-lg font-bold leading-normal tracking-widest uppercase mr-2">Proceed</span>
                                                        <ChevronRight size={20} className="text-white" />
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}

                                    {step === 'DIFFICULTY' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="w-full flex flex-col gap-6"
                                        >
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { id: 'RECRUIT', label: 'Recruit', icon: Shield, color: 'text-emerald-400', border: 'hover:border-emerald-500', selectedBorder: 'border-emerald-500', bg: 'hover:bg-emerald-500/10', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]' },
                                                    { id: 'AGENT', label: 'Agent', icon: Zap, color: 'text-primary', border: 'hover:border-primary', selectedBorder: 'border-primary', bg: 'hover:bg-primary/10', glow: 'shadow-[0_0_20px_rgba(19,109,236,0.2)]' },
                                                    { id: 'VETERAN', label: 'Veteran', icon: Skull, color: 'text-red-500', border: 'hover:border-red-500', selectedBorder: 'border-red-500', bg: 'hover:bg-red-500/10', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]' }
                                                ].map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => setDifficulty(option.id)}
                                                        className={`
                                                            relative p-4 rounded-lg border transition-all duration-300 text-left group
                                                            ${difficulty === option.id
                                                                ? `${option.selectedBorder} bg-[#1a2332]/80 ${option.glow} scale-[1.02]`
                                                                : `border-[#233348] bg-[#0B1016] ${option.border} ${option.bg} opacity-70 hover:opacity-100 hover:scale-[1.01]`
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className={`text-sm md:text-base font-bold uppercase tracking-widest transition-colors ${difficulty === option.id ? option.color : 'text-slate-400 group-hover:text-white'}`}>
                                                                {option.label}
                                                            </span>
                                                            <option.icon size={18} className={`${difficulty === option.id ? option.color : 'text-slate-600'} transition-colors`} />
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">
                                                            {option.id === 'RECRUIT' && 'Threat Level: Low // Training Details'}
                                                            {option.id === 'AGENT' && 'Threat Level: Normal // Standard Ops'}
                                                            {option.id === 'VETERAN' && 'Threat Level: Critical // Real World'}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex justify-center relative group/btn pt-2">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur opacity-25 group-hover/btn:opacity-75 transition duration-500"></div>
                                                <button
                                                    onClick={handleFinalSubmit}
                                                    className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary hover:bg-blue-600 transition-all duration-300 shadow-[0_0_20px_rgba(19,109,236,0.3)] hover:shadow-[0_0_30px_rgba(19,109,236,0.5)] border border-primary/50"
                                                >
                                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                                    <Power className="mr-3 animate-pulse size-5 text-white" />
                                                    <span className="text-white text-lg font-bold leading-normal tracking-widest uppercase">Initiate Mission</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="relative z-20 bg-[#080c10] p-3 border-t border-[#233348] flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"></span>
                                    System Ready
                                </span>
                                <span>v.2.0.4 // PROTOCOL OMEGA</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AgentRegistrationModal;
