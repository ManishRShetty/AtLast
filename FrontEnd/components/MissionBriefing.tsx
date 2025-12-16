import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Crosshair, Radio, ChevronRight, SkipForward } from 'lucide-react';

interface MissionBriefingProps {
    onBeginMission: () => void;
    onSkip: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({ onBeginMission, onSkip }) => {
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [showObjectives, setShowObjectives] = useState(false);

    const dialogues = [
        "Welcome to Operation AtLast. I'm Commander Atlas, your mission handler.",
        "We've intercepted encrypted intelligence about a high-value target. Your job is to locate them.",
        "Our Oracle AI will provide cryptic clues. Analyze the patterns, decode the location, and mark the coordinates.",
        "Speed and precision matter. The closer you get, the higher your score.",
        "Good hunting, Operator."
    ];

    const objectives = [
        "Analyze intelligence patterns from Oracle AI",
        "Decode cryptic location clues",
        "Identify target coordinates on global map",
        "Maximize accuracy for higher scores"
    ];

    const scoringTiers = [
        { range: "< 50km", points: 1000, grade: "EXCELLENT", color: "text-green-400" },
        { range: "< 200km", points: 750, grade: "GOOD", color: "text-blue-400" },
        { range: "< 500km", points: 500, grade: "FAIR", color: "text-yellow-400" },
        { range: "< 1000km", points: 250, grade: "POOR", color: "text-orange-400" },
        { range: "> 1000km", points: 50, grade: "MISS", color: "text-red-400" }
    ];

    // Typing animation effect
    useEffect(() => {
        if (currentDialogueIndex >= dialogues.length) {
            setShowObjectives(true);
            return;
        }

        const currentDialogue = dialogues[currentDialogueIndex];
        let charIndex = 0;
        setDisplayedText('');
        setIsTyping(true);

        const typingInterval = setInterval(() => {
            if (charIndex < currentDialogue.length) {
                setDisplayedText(currentDialogue.slice(0, charIndex + 1));
                charIndex++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);

                // Auto-advance to next dialogue after a pause
                setTimeout(() => {
                    setCurrentDialogueIndex(prev => prev + 1);
                }, 1500);
            }
        }, 30);

        return () => clearInterval(typingInterval);
    }, [currentDialogueIndex]);

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">

            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-white to-transparent"
                    animate={{ y: [0, window.innerHeight] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Main content container */}
            <div className="relative z-10 w-full max-w-5xl px-6 md:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-4">
                        <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Classified</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-2">
                        OPERATION <span className="text-indigo-400">ATLAST</span>
                    </h1>
                    <div className="text-zinc-500 uppercase text-sm tracking-widest">Mission Briefing</div>
                </motion.div>

                {/* Commander Section */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">

                        {/* Commander header */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <div className="text-indigo-400 text-sm font-bold uppercase tracking-wider">Commander Atlas</div>
                                <div className="text-zinc-500 text-xs">Mission Handler • Clearance Level: Omega</div>
                            </div>
                        </div>

                        {/* Dialogue box */}
                        <div className="min-h-[120px] relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentDialogueIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-white text-lg md:text-xl leading-relaxed font-light"
                                >
                                    {displayedText}
                                    {isTyping && (
                                        <motion.span
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                            className="inline-block w-2 h-5 bg-indigo-400 ml-1"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-4 text-zinc-600 text-sm">
                                [{currentDialogueIndex + 1} / {dialogues.length}]
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Mission Objectives */}
                <AnimatePresence>
                    {showObjectives && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-2 gap-6 mb-8"
                        >

                            {/* Objectives Panel */}
                            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Crosshair className="w-5 h-5 text-indigo-400" />
                                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">Mission Objectives</h3>
                                </div>
                                <ul className="space-y-3">
                                    {objectives.map((objective, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="flex items-start gap-3 text-zinc-300 text-sm"
                                        >
                                            <ChevronRight className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                                            <span>{objective}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Scoring Panel */}
                            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Target className="w-5 h-5 text-indigo-400" />
                                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">Scoring System</h3>
                                </div>
                                <div className="space-y-2">
                                    {scoringTiers.map((tier, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="flex items-center justify-between text-sm py-2 px-3 bg-black/30 rounded-lg"
                                        >
                                            <span className="text-zinc-400">{tier.range}</span>
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold ${tier.color}`}>{tier.points}</span>
                                                <span className={`text-xs uppercase ${tier.color}`}>{tier.grade}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <AnimatePresence>
                    {showObjectives && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onBeginMission}
                                className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
                            >
                                <Target className="w-5 h-5" />
                                Begin Mission
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onSkip}
                                className="px-8 py-4 bg-zinc-900 text-white border border-white/20 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors"
                            >
                                <SkipForward className="w-5 h-5" />
                                Skip Briefing
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Skip button (always visible) */}
                {!showObjectives && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        onClick={onSkip}
                        className="absolute top-8 right-8 px-4 py-2 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-lg text-white text-sm flex items-center gap-2 hover:bg-zinc-800 transition-colors"
                    >
                        <SkipForward className="w-4 h-4" />
                        Skip
                    </motion.button>
                )}
            </div>
        </div>
    );
};
