'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Terminal } from '../components/Terminal';
import { MissionHUD } from '../components/MissionHUD';
import { TARGETS, DEFAULT_MAPBOX_TOKEN } from '../constants';
import { startSession, getQuestion, streamLogs, submitAnswer } from '../services/apiService';

// Dynamically import CommandMap with SSR disabled to avoid "window is not defined" error
const CommandMap = dynamic(
    () => import('../components/CommandMap').then((mod) => ({ default: mod.CommandMap })),
    { ssr: false }
);

import { calculateDistance } from '../utils/geo';
import { TargetLocation, GameState, LogMessage } from '../types';
import { Moon, Sun, Play, RefreshCw, AlertTriangle, ShieldCheck, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
    const [gameState, setGameState] = useState<GameState>('IDLE');
    const [currentTarget, setCurrentTarget] = useState<TargetLocation | null>(null);
    const [riddle, setRiddle] = useState<string>('');
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const [score, setScore] = useState<number>(0);
    const [isDark, setIsDark] = useState(true);
    const [showMapTokenWarning, setShowMapTokenWarning] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [attempts, setAttempts] = useState<number>(0);
    const [answerFeedback, setAnswerFeedback] = useState<string>('');

    // Initialize & Theme Handling
    useEffect(() => {
        if (!DEFAULT_MAPBOX_TOKEN || DEFAULT_MAPBOX_TOKEN.includes('YOUR_TOKEN_HERE')) {
            setShowMapTokenWarning(true);
        }
        document.documentElement.classList.toggle('dark', isDark);

        if (gameState === 'IDLE') {
            addLog('SYSTEM', 'NetRunner OS v4.0 ready. Standing by.', 'info');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const addLog = (sender: string, message: string, type: 'info' | 'alert' | 'success' | 'error' = 'info') => {
        setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), sender, message, timestamp: new Date(), type }]);
    };

    const startGame = async () => {
        setScore(0);
        setLogs([]);
        setUserAnswer('');
        setAttempts(0);
        setAnswerFeedback('');
        addLog('SYSTEM', 'Initializing Global Search Protocol...', 'alert');

        const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
        setCurrentTarget(target);

        try {
            addLog('NETWORK', 'Establishing connection to backend server...', 'info');

            // Start backend session
            const newSessionId = await startSession();
            setSessionId(newSessionId);
            addLog('NETWORK', `Session ${newSessionId.slice(0, 8)} established.`, 'success');

            // Start streaming agent logs
            const cleanup = streamLogs(
                newSessionId,
                (logMessage) => {
                    // Parse agent messages that may come in format "Agent: Message"
                    if (logMessage.includes(':')) {
                        const [agent, msg] = logMessage.split(':', 2);
                        addLog(agent.trim(), msg.trim(), 'info');
                    } else {
                        addLog('AGENT', logMessage, 'info');
                    }
                },
                (error) => {
                    console.error('Log stream error:', error);
                    addLog('SYSTEM', 'Agent communication interrupted.', 'error');
                }
            );

            // Get riddle from backend
            addLog('ORACLE', 'Requesting target intelligence...', 'info');
            const riddleData = await getQuestion(newSessionId);
            setRiddle(riddleData.riddle);
            addLog('ORACLE', 'Target profile decrypted successfully.', 'success');

            // Transition to ANSWERING state
            setGameState('ANSWERING');

            // Store cleanup function for later use (optional: you may want to call this on unmount)
            // For now, we'll let it stream until component unmounts

        } catch (error) {
            console.error(error);
            addLog('SYSTEM', 'Connection disrupted. Ensure backend server is running.', 'error');
            setRiddle(`Target location unknown. Backend offline.`);
        }
    };

    const handleAnswerSubmit = async () => {
        if (!sessionId || !userAnswer.trim()) return;

        try {
            addLog('USER', `Submitting answer: ${userAnswer}`, 'info');
            const result = await submitAnswer(sessionId, userAnswer);

            setAttempts(result.attempts);
            setAnswerFeedback(result.message);

            if (result.correct && result.location) {
                addLog('ORACLE', result.message, 'success');

                // Create target from backend location data
                const target: TargetLocation = {
                    id: 'revealed',
                    name: result.location.name,
                    lat: result.location.lat,
                    lng: result.location.lng
                };
                setCurrentTarget(target);

                // Transition to REVEALED state - show map with target
                setGameState('REVEALED');
                addLog('SYSTEM', 'Location revealed. Click on the map to confirm your guess.', 'alert');

                // Clear answer input
                setUserAnswer('');
            } else {
                addLog('ORACLE', result.message, 'error');
            }
        } catch (error) {
            console.error('Answer submission error:', error);
            addLog('SYSTEM', 'Failed to verify answer. Try again.', 'error');
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        if (gameState !== 'REVEALED' || !currentTarget) return;

        const distance = calculateDistance(lat, lng, currentTarget.lat, currentTarget.lng);

        // Calculate base score from distance
        let baseScore = 0;
        if (distance < 50) baseScore = 1000;
        else if (distance < 200) baseScore = 750;
        else if (distance < 500) baseScore = 500;
        else if (distance < 1000) baseScore = 250;
        else baseScore = 50;

        // Apply attempt penalty (reduce score by 15% per extra attempt)
        const attemptPenalty = Math.max(0, (attempts - 1) * 0.15);
        const finalScore = Math.round(baseScore * (1 - attemptPenalty));

        setScore(finalScore);
        setGameState('RESOLVED');

        addLog('SYSTEM', `Lock confirmed at ${lat.toFixed(2)}, ${lng.toFixed(2)}`, 'alert');
        addLog('SYSTEM', `Target delta: ${Math.floor(distance)}km`, distance < 500 ? 'success' : 'error');
        if (attempts > 1) {
            addLog('SYSTEM', `Attempts: ${attempts} (-${Math.round(attemptPenalty * 100)}% penalty)`, 'alert');
        }
    };

    return (
        <div className={`relative w-screen h-screen overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gray-100'}`}>

            {/* Background Map */}
            <div className="absolute inset-0 z-0">
                <CommandMap
                    onMapClick={handleMapClick}
                    interactive={gameState === 'REVEALED'}
                    targetLocation={gameState === 'RESOLVED' && currentTarget ? currentTarget : (gameState === 'REVEALED' && currentTarget ? currentTarget : undefined)}
                    isDark={isDark}
                />
            </div>

            {/* Foreground UI Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col p-4 md:p-6 lg:p-8 h-full">

                {/* Top Header Bar */}
                <header className="flex justify-between items-center pointer-events-auto mb-4 shrink-0">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`flex items-center gap-4 px-6 py-3 rounded-full backdrop-blur-xl shadow-lg border ${isDark ? 'bg-zinc-900/60 border-white/10 text-white' : 'bg-white/70 border-black/5 text-zinc-800'}`}
                    >
                        <div className={`p-1.5 rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-500 text-white'}`}>
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-wide">Operation</h1>
                            <div className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                AtLast
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex gap-4"
                    >
                        {/* Score Display */}
                        <div className={`px-6 py-3 rounded-full backdrop-blur-xl shadow-lg border flex flex-col items-end min-w-[120px] ${isDark ? 'bg-zinc-900/60 border-white/10 text-white' : 'bg-white/70 border-black/5 text-zinc-800'}`}>
                            <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Score</span>
                            <span className="text-xl font-mono font-semibold tracking-tight">{score.toLocaleString()}</span>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-3 rounded-full backdrop-blur-xl shadow-lg border transition-all active:scale-95 ${isDark ? 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white/70 border-black/5 text-zinc-500 hover:text-zinc-900 hover:bg-white'}`}
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </motion.div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 relative min-h-0">

                    {/* Left Panel: Mission Brief */}
                    <div className="w-full md:w-1/3 max-w-md pointer-events-auto flex flex-col justify-end md:justify-start shrink-0">
                        <AnimatePresence>
                            {(gameState === 'ANSWERING' || gameState === 'REVEALED') && (
                                <motion.div
                                    initial={{ x: -50, opacity: 0, filter: "blur(10px)" }}
                                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                                    exit={{ x: -50, opacity: 0, filter: "blur(10px)" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="h-full"
                                >
                                    <MissionHUD riddle={riddle} status={gameState} isDark={isDark} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Center: Controls & Feedback */}
                    <div className="flex-1 flex items-center justify-center pointer-events-auto">
                        <AnimatePresence mode="wait">
                            {gameState === 'IDLE' && (
                                <motion.button
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={startGame}
                                    className={`group relative px-10 py-5 rounded-2xl backdrop-blur-2xl shadow-2xl border transition-all flex items-center gap-4 ${isDark ? 'bg-white text-black border-transparent hover:bg-gray-200' : 'bg-zinc-900 text-white border-transparent hover:bg-zinc-800'}`}
                                >
                                    <Play size={24} className="fill-current" />
                                    <div className="text-left">
                                        <div className="text-xs font-bold uppercase opacity-60">Ready</div>
                                        <div className="text-lg font-bold">Start Mission</div>
                                    </div>
                                </motion.button>
                            )}

                            {gameState === 'ANSWERING' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    className={`p-8 rounded-3xl backdrop-blur-2xl shadow-2xl border max-w-md w-full ${isDark ? 'bg-zinc-900/80 border-white/10 text-white' : 'bg-white/90 border-black/5 text-zinc-900'}`}
                                >
                                    <div className="text-sm uppercase font-bold opacity-50 mb-2 text-center">Decode Target Location</div>
                                    <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Answer</h2>

                                    {answerFeedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mb-4 p-3 rounded-lg text-sm text-center ${answerFeedback.includes('Correct') ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') : (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')}`}
                                        >
                                            {answerFeedback}
                                        </motion.div>
                                    )}

                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                                            placeholder="Type city name..."
                                            className={`flex-1 px-4 py-3 rounded-xl font-mono transition-all outline-none ${isDark ? 'bg-white/10 border border-white/20 text-white placeholder-zinc-500 focus:border-white/40' : 'bg-black/5 border border-black/10 text-black placeholder-zinc-400 focus:border-black/20'}`}
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAnswerSubmit}
                                            disabled={!userAnswer.trim()}
                                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${!userAnswer.trim() ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'} ${isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}
                                        >
                                            <Send size={18} />
                                            Submit
                                        </button>
                                    </div>

                                    {attempts > 0 && (
                                        <p className={`text-sm text-center ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                            Attempts: {attempts}
                                        </p>
                                    )}
                                </motion.div>
                            )}

                            {gameState === 'REVEALED' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    className={`p-8 rounded-3xl backdrop-blur-2xl shadow-2xl border text-center max-w-sm ${isDark ? 'bg-zinc-900/80 border-white/10 text-white' : 'bg-white/90 border-black/5 text-zinc-900'}`}
                                >
                                    <div className="text-sm uppercase font-bold opacity-50 mb-2">Location Revealed</div>
                                    <h2 className="text-3xl font-bold mb-4">🎯 {currentTarget?.name}</h2>
                                    <p className={`mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        Click on the map to confirm your final guess
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                        Closer clicks earn higher scores!
                                    </p>
                                </motion.div>
                            )}

                            {gameState === 'RESOLVED' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    className={`p-8 rounded-3xl backdrop-blur-2xl shadow-2xl border text-center max-w-sm ${isDark ? 'bg-zinc-900/80 border-white/10 text-white' : 'bg-white/90 border-black/5 text-zinc-900'}`}
                                >
                                    <div className="text-sm uppercase font-bold opacity-50 mb-2">Mission Complete</div>
                                    <h2 className="text-3xl font-bold mb-1">{score > 500 ? 'Target Secured' : 'Target Missed'}</h2>
                                    <p className={`mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        Actual location was <strong className={isDark ? 'text-white' : 'text-black'}>{currentTarget?.name}</strong>
                                    </p>
                                    <button
                                        onClick={startGame}
                                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}
                                    >
                                        <RefreshCw size={18} />
                                        Next Target
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Panel: Terminal Feed - CORRECTED */}
                    {/* 1. min-h-0 prevents parent blowout */}
                    {/* 2. overflow-hidden forces clamping, so Terminal.tsx scrollbar works */}
                    <div className="w-full md:w-1/3 max-w-md pointer-events-auto flex flex-col justify-end md:h-full shrink-0 min-h-0">
                        <AnimatePresence>
                            {(gameState === 'ANSWERING' || gameState === 'REVEALED' || gameState === 'RESOLVED') && (
                                <motion.div
                                    initial={{ x: 50, opacity: 0, filter: "blur(10px)" }}
                                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                                    // Ensure motion div flexes to fill available space but doesn't exceed it
                                    className="max-h-[40vh] md:max-h-full flex flex-col"
                                >
                                    {/* WRAPPER: overflow-hidden is key here! */}
                                    <div className="flex-1 min-h-0 overflow-hidden rounded-lg shadow-xl backdrop-blur-md">
                                        <Terminal logs={logs} isDark={isDark} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            {/* Notifications */}
            <AnimatePresence>
                {
                    showMapTokenWarning && (
                        <motion.div
                            initial={{ y: -100 }} animate={{ y: 0 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 z-50 pointer-events-none"
                        >
                            <AlertTriangle size={18} />
                            <span className="text-sm font-medium">Mapbox Token Missing - Visuals Limited</span>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </div >
    );
}