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
    const [difficulty, setDifficulty] = useState('INDIA_EASY');
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
        }, 500);
    };

    const difficultyOptions = [
        { id: 'INDIA_EASY', label: 'India // Recruit', desc: 'Major Metros', icon: Shield, color: 'text-emerald-400', borderColor: 'border-emerald-500', bgColor: 'bg-emerald-500/10' },
        { id: 'INDIA_HARD', label: 'India // Veteran', desc: 'Tier-2 & History', icon: Zap, color: 'text-amber-400', borderColor: 'border-amber-500', bgColor: 'bg-amber-500/10' },
        { id: 'GLOBAL_EASY', label: 'Global // Recruit', desc: 'Capital Cities', icon: Shield, color: 'text-blue-400', borderColor: 'border-blue-500', bgColor: 'bg-blue-500/10' },
        { id: 'GLOBAL_HARD', label: 'Global // Veteran', desc: 'Obscure World', icon: Skull, color: 'text-red-500', borderColor: 'border-red-500', bgColor: 'bg-red-500/10' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center font-display ${isExiting ? 'pointer-events-none' : ''}`}>

                    {/* Layer 1: Dark Apocalyptic City Silhouette */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-black"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
                            style={{ backgroundImage: "url('/atlastbg.webp')" }}
                        />

                        {/* Layer 2: Grid Pattern Overlay */}
                        <div
                            className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px'
                            }}
                        />

                        {/* Layer 3: Heavy Radial Gradient Vignette */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
                    </motion.div>


                    {/* Fade to Black Overlay (Exit) */}
                    <div className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 pointer-events-none ${isExiting ? 'opacity-100' : 'opacity-0'}`}></div>

                    {/* Content Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`relative z-10 w-full max-w-2xl p-4 ${isExiting ? 'animate-out fade-out zoom-out-95 duration-500 fill-mode-forwards' : ''}`}
                    >
                        {/* Modal Card - Styled to match Cyberpunk/Tactical Dystopia */}
                        <div className="relative bg-[#050a10]/90 border border-cyan-900/50 backdrop-blur-xl shadow-[0_0_50px_rgba(0,255,255,0.1)] overflow-hidden">

                            {/* Decorative Corner Markers */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>

                            {/* Header */}
                            <div className="py-8 px-8 text-center border-b border-cyan-900/30 relative">
                                <h2
                                    className="text-white text-3xl md:text-4xl font-bold tracking-[0.2em] drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] uppercase"
                                >
                                    {step === 'NAME' ? 'Identity Verification' : 'Mission Parameters'}
                                </h2>
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                            </div>

                            {/* Body */}
                            <div className="p-8 md:p-10">
                                {/* Name Step */}
                                {step === 'NAME' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="w-full"
                                    >
                                        <form onSubmit={handleNameSubmit} className="flex flex-col gap-8">
                                            {/* Input Field */}
                                            <div className="relative group">
                                                <div className="absolute -top-3 left-4 bg-[#050a10] px-2 text-xs font-mono text-cyan-500 tracking-widest uppercase z-10">
                                                    Agent Codename
                                                </div>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(e.target.value);
                                                        setError(false);
                                                    }}
                                                    className="w-full bg-[#0a1520]/80 border border-cyan-900/50 text-white text-xl md:text-2xl py-5 px-6 focus:outline-none focus:border-cyan-400 placeholder-slate-700 tracking-[0.1em] font-mono transition-all clip-path-input focus:shadow-[0_0_20px_rgba(0,255,255,0.1)]"
                                                    placeholder="ENTER ALIAS..."
                                                    autoFocus
                                                    autoComplete="off"
                                                />
                                                {error && (
                                                    <div className="absolute top-full left-0 mt-3 text-red-500 text-xs font-mono flex items-center gap-2 bg-red-950/30 px-3 py-1 border border-red-500/30 w-full animate-shake">
                                                        <TriangleAlert size={12} />
                                                        <span>ERROR: INVALID IDENTIFIER LENGTH</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Proceed Button - Tactical Skewed */}
                                            <div className="flex justify-center pt-2">
                                                <button type="submit" className="relative group perspective-distant">
                                                    <div
                                                        className="relative bg-cyan-950/40 border border-cyan-500/50 px-16 py-4 overflow-hidden group-hover:border-cyan-400 transition-colors"
                                                        style={{ transform: 'skew(-12deg)' }}
                                                    >
                                                        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                                        <div className="absolute inset-0 bg-cyan-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                                                        {/* Glitch Effect on Hover */}
                                                        <span
                                                            className="flex items-center gap-3 text-cyan-400 text-xl font-bold tracking-widest group-hover:text-white transition-colors relative z-10 group-hover:animate-glitch"
                                                            style={{ transform: 'skew(12deg)' }}
                                                        >
                                                            CONFIRM IDENTITY
                                                            <ChevronRight size={20} />
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* Difficulty Step */}
                                {step === 'DIFFICULTY' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="w-full flex flex-col gap-8"
                                    >
                                        {/* Difficulty Options Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {difficultyOptions.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setDifficulty(option.id)}
                                                    className={`
                                                        relative p-5 transition-all duration-300 text-left group overflow-hidden
                                                        ${difficulty === option.id
                                                            ? `border-l-4 ${option.borderColor} bg-[rgba(0,0,0,0.4)]`
                                                            : 'border-l-4 border-transparent bg-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,255,255,0.05)] hover:border-cyan-500/30'
                                                        }
                                                    `}
                                                >
                                                    {/* Selection Glow */}
                                                    {difficulty === option.id && (
                                                        <div className={`absolute inset-0 ${option.bgColor} opacity-20 pointer-events-none`}></div>
                                                    )}

                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-sm font-bold uppercase tracking-widest ${difficulty === option.id ? option.color : 'text-slate-400 group-hover:text-cyan-300'}`}>
                                                            {option.label}
                                                        </span>
                                                        <option.icon size={16} className={difficulty === option.id ? option.color : 'text-slate-600'} />
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wide group-hover:text-slate-400 transition-colors">
                                                        [{option.desc}]
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Start Mission Button - Tactical Skewed (Green/Teal) */}
                                        <div className="flex justify-center pt-2">
                                            <button onClick={handleFinalSubmit} className="relative group">
                                                <div
                                                    className="relative bg-emerald-950/40 border border-emerald-500/50 px-16 py-4 overflow-hidden group-hover:border-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                                    style={{ transform: 'skew(-12deg)' }}
                                                >
                                                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                                    <div className="absolute inset-0 bg-emerald-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                                                    <span
                                                        className="flex items-center gap-3 text-emerald-400 text-xl font-bold tracking-widest group-hover:text-white transition-colors relative z-10 group-hover:animate-glitch"
                                                        style={{ transform: 'skew(12deg)' }}
                                                    >
                                                        <Power className="mr-1" size={18} />
                                                        ENGAGE LINK
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer Decor */}
                            <div className="h-2 bg-[#0a1520] w-full border-t border-cyan-900/30 flex items-center justify-end px-4 gap-1">
                                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                                <div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-cyan-500/30 rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AgentRegistrationModal;
