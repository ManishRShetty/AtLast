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
    const [difficulty, setDifficulty] = useState('AGENT');
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
                    {/* Background - Same as breach page */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        {/* Apocalyptic Background */}
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: "url('/atlastbg.png')" }}
                        />
                        {/* Dark overlay for better readability */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    </motion.div>

                    {/* Fade to Black Overlay */}
                    <div className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 pointer-events-none ${isExiting ? 'opacity-100' : 'opacity-0'}`}></div>

                    {/* Content Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`relative z-10 w-full max-w-2xl p-4 ${isExiting ? 'animate-out fade-out zoom-out-95 duration-500 fill-mode-forwards' : ''}`}
                    >
                        {/* Modal Card */}
                        <div className="relative bg-black/80 border border-neutral-700/50 rounded-xl overflow-hidden backdrop-blur-xl">
                            {/* Header */}
                            <div className="py-6 px-6 text-center border-b border-neutral-700/30">
                                <h2
                                    className="text-white text-3xl md:text-4xl font-bold tracking-wider drop-shadow-lg"
                                    style={{ fontFamily: "'Road Rage', cursive" }}
                                >
                                    {step === 'NAME' ? 'ENTER CODENAME' : 'SELECT DIFFICULTY'}
                                </h2>
                            </div>

                            {/* Body */}
                            <div className="p-6 md:p-8">
                                {/* Name Step */}
                                {step === 'NAME' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="w-full"
                                    >
                                        <form onSubmit={handleNameSubmit} className="flex flex-col gap-6">
                                            {/* Input Field */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(e.target.value);
                                                        setError(false);
                                                    }}
                                                    className="w-full bg-black/60 border-2 border-neutral-600 rounded-lg text-white text-xl md:text-2xl py-4 px-6 focus:outline-none focus:border-red-600 placeholder-neutral-500 tracking-wider uppercase transition-colors"
                                                    placeholder="YOUR NAME..."
                                                    autoFocus
                                                    autoComplete="off"
                                                />
                                                {error && (
                                                    <div className="absolute top-full left-0 mt-2 text-red-500 text-sm font-mono flex items-center gap-2">
                                                        <TriangleAlert size={14} />
                                                        <span>Name must be at least 2 characters</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Proceed Button - Skewed Red Style */}
                                            <div className="flex justify-center pt-4">
                                                <button type="submit" className="relative group">
                                                    <div className="absolute inset-0 bg-red-600/40 blur-xl skew-x-[-8deg] group-hover:bg-red-500/60 transition-colors duration-300" />
                                                    <div className="relative bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-12 py-4 skew-x-[-8deg] group-hover:from-red-700 group-hover:via-red-600 group-hover:to-red-700 transition-all duration-300 border-t border-red-500/30">
                                                        <span
                                                            className="flex items-center gap-2 text-white text-xl font-bold tracking-wider skew-x-[8deg] drop-shadow-lg"
                                                            style={{ fontFamily: "'Road Rage', cursive" }}
                                                        >
                                                            PROCEED
                                                            <ChevronRight size={24} />
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 w-full h-2 bg-black/60 skew-x-[-8deg] border border-neutral-800/50" />
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
                                        className="w-full flex flex-col gap-6"
                                    >
                                        {/* Difficulty Options Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {difficultyOptions.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setDifficulty(option.id)}
                                                    className={`
                                                        relative p-4 rounded-lg border-2 transition-all duration-300 text-left group
                                                        ${difficulty === option.id
                                                            ? `${option.borderColor} ${option.bgColor} scale-[1.02]`
                                                            : 'border-neutral-700 bg-black/40 hover:border-neutral-500 opacity-70 hover:opacity-100'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-sm font-bold uppercase tracking-widest ${difficulty === option.id ? option.color : 'text-neutral-400'}`}>
                                                            {option.label}
                                                        </span>
                                                        <option.icon size={18} className={difficulty === option.id ? option.color : 'text-neutral-600'} />
                                                    </div>
                                                    <div className="text-xs text-neutral-500 font-mono uppercase tracking-wide">
                                                        {option.desc}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Start Mission Button - Skewed Red Style */}
                                        <div className="flex justify-center pt-4">
                                            <button onClick={handleFinalSubmit} className="relative group">
                                                <div className="absolute inset-0 bg-red-600/40 blur-xl skew-x-[-8deg] group-hover:bg-red-500/60 transition-colors duration-300" />
                                                <div className="relative bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-12 py-4 skew-x-[-8deg] group-hover:from-red-700 group-hover:via-red-600 group-hover:to-red-700 transition-all duration-300 border-t border-red-500/30">
                                                    <span
                                                        className="flex items-center gap-3 text-white text-xl font-bold tracking-wider skew-x-[8deg] drop-shadow-lg"
                                                        style={{ fontFamily: "'Road Rage', cursive" }}
                                                    >
                                                        <Power className="animate-pulse" size={22} />
                                                        START MISSION
                                                    </span>
                                                </div>
                                                <div className="mt-1 w-full h-2 bg-black/60 skew-x-[-8deg] border border-neutral-800/50" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AgentRegistrationModal;
