import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Plus, Minus, Crosshair, Send, Lock, ShieldAlert, Cpu, Radio, Shield } from 'lucide-react';
import TerminalPanel, { LogEntry } from './TerminalPanel';
import HandoffModal from './HandoffModal';
import { RiddleData } from '@/types';
import { searchCities } from '@/services/apiService';

interface PlayViewProps {
    handleSend: (command: string) => boolean | Promise<boolean>;
    timeRemaining: number;
    isGameStarted: boolean;
    onStartGame: () => void;
    riddle?: RiddleData | null;
    agentLogs?: string[];
    isLoadingRiddle?: boolean;
    score: number;
    difficulty: string;
}

const PlayView: React.FC<PlayViewProps> = ({
    handleSend,
    timeRemaining,
    isGameStarted,
    onStartGame,
    riddle,
    agentLogs = [],
    isLoadingRiddle = false,
    score,
    difficulty
}) => {
    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [inputValue, setInputValue] = useState('');
    const [isError, setIsError] = useState(false);
    const [showTryAgain, setShowTryAgain] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Autocomplete State
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Log Handling
    const logs: LogEntry[] = agentLogs.map((log, index) => ({
        id: `log-${index}`,
        type: log.startsWith('ERROR') ? 'error' :
            log.includes('✅') || log.includes('READY') ? 'success' :
                log.includes('⚠️') ? 'warning' : 'info',
        text: log
    }));

    const onSend = async () => {
        if (!inputValue.trim() || isSubmitting) return;

        const cmd = inputValue.trim();
        setInputValue('');
        setIsSubmitting(true);
        setShowSuggestions(false);

        try {
            const isCorrect = await handleSend(cmd);

            if (!isCorrect) {
                // Trigger Error State
                setIsError(true);
                setShowTryAgain(true);

                // Play Error Sound
                const errorAudio = new Audio('/audio/error.mp3');
                errorAudio.volume = 0.5;
                errorAudio.play().catch(() => { });

                setTimeout(() => {
                    setIsError(false);
                    setShowTryAgain(false);
                }, 1000);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSend();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (value.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            const results = await searchCities(value);
            setSuggestions(results);
            setShowSuggestions(true);
        }, 300);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="bg-deep-black text-white font-display overflow-hidden h-[calc(100vh-60px)] flex flex-col relative w-full">

            {/* Modal Overlay */}
            {!isGameStarted && <HandoffModal onStart={onStartGame} />}

            <div className={`flex-1 flex flex-col overflow-hidden relative transition-all duration-700 ${!isGameStarted ? 'blur-md scale-[0.98] opacity-50 pointer-events-none' : ''}`}>

                {/* --- Layered Background (Matches Handoff) --- */}
                <div className="absolute inset-0 z-0 bg-deep-black">
                    <div className="absolute inset-0 bg-[url('/atlastbg.webp')] opacity-40 bg-cover bg-center bg-no-repeat"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
                </div>

                {/* Layer 2: Grid & Vignette */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.03)_1px,transparent_1px)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
                </div>


                {/* --- Main Game Layout --- */}
                <main className="flex-1 flex overflow-hidden relative z-20">

                    {/* Left: Terminal Panel (Keeping functionality but ensuring style matches) */}
                    <div className="w-[350px] hidden md:flex flex-col border-r border-[#233348] border-opacity-50">
                        <TerminalPanel logs={logs} />
                    </div>

                    {/* Right: Tactical HUD & Game Area */}
                    <section className="flex-1 relative flex flex-col">

                        {/* 1. Top Bar: Floating Tactical HUD */}
                        <div className="absolute top-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
                            <div className="relative pointer-events-auto">
                                {/* Timer Container - Skewed */}
                                <div className="absolute inset-0 bg-slate-900/90 border border-neon-cyan/30 transform skew-x-[-12deg] shadow-[0_0_20px_rgba(0,255,255,0.1)]"></div>

                                <div className="relative px-8 md:px-16 py-3 flex flex-col items-center gap-1 z-10">
                                    <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold tracking-[0.2em] animate-pulse">
                                        <AlertTriangle size={12} />
                                        <span>DEFCON 1 IMMINENT</span>
                                    </div>

                                    <div className="flex items-end gap-6 md:gap-12">
                                        {/* Score (Left) */}
                                        <div className="hidden md:flex flex-col items-end opacity-80">
                                            <span className="text-[10px] text-slate-400 tracking-widest uppercase">SCORE</span>
                                            <span className="text-xl font-bold text-white tabular-nums leading-none">{score.toLocaleString()}</span>
                                        </div>

                                        {/* Timer (Center) */}
                                        <div className="text-5xl font-bold tracking-widest text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] leading-none">
                                            {formatTime(timeRemaining)}
                                        </div>

                                        {/* Difficulty (Right) */}
                                        <div className="hidden md:flex flex-col items-start opacity-80">
                                            <span className="text-[10px] text-slate-400 tracking-widest uppercase">LEVEL</span>
                                            <span className={`text-xl font-bold leading-none ${difficulty === 'Hard' ? 'text-red-500' : 'text-neon-cyan'}`}>
                                                {difficulty?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timer Bar */}
                                    <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-neon-cyan transition-all duration-1000 ease-linear"
                                            style={{ width: `${(timeRemaining / 60) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Side Widgets (Controls Only - removed Mission Intel as it's top now) */}
                        <div className="absolute top-24 right-8 z-30 pointer-events-none flex flex-col gap-2 hidden lg:flex">
                            {/* Map Controls (Visual Only for now as per previous impl) */}
                            {['ZOOM IN', 'ZOOM OUT', 'LOCK'].map((label, i) => (
                                <button key={i} className="pointer-events-auto px-4 py-2 bg-black/60 border-r-2 border-slate-700 text-[10px] text-slate-400 font-medium hover:border-neon-cyan hover:text-neon-cyan hover:bg-black/90 transition-all uppercase tracking-widest text-right">
                                    {label}
                                </button>
                            ))}
                        </div>


                        {/* 3. Central Riddle Display */}
                        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                            <div className="w-full max-w-3xl relative">
                                {/* Decorative Brackets */}
                                <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-slate-700/50 rounded-tl-3xl"></div>
                                <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-slate-700/50 rounded-br-3xl"></div>

                                <div className="bg-[#050505]/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 relative overflow-hidden group">
                                    {/* Neon Glow Border Effect */}
                                    <div className="absolute inset-0 border border-neon-cyan/20 group-hover:border-neon-cyan/40 transition-colors duration-500"></div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>

                                    <div className="relative z-10 text-center space-y-6">
                                        <div className="flex justify-center">
                                            <div className="inline-flex items-center gap-2 bg-neon-cyan/10 px-4 py-1 rounded-sm border border-neon-cyan/30 text-neon-cyan text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
                                                <Lock size={12} /> Encrypted Transmission
                                            </div>
                                        </div>

                                        <h2 className="text-lg md:text-2xl font-medium leading-relaxed font-sans tracking-wide text-slate-100 min-h-[8rem] flex items-center justify-center">
                                            {isLoadingRiddle ? (
                                                <span className="animate-pulse text-neon-cyan">DECRYPTING INCOMING SIGNAL...</span>
                                            ) : riddle ? (
                                                <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">"{riddle.riddle}"</span>
                                            ) : (
                                                "Awaiting mission briefing..."
                                            )}
                                        </h2>

                                        <div className="flex justify-center gap-4 text-xs text-slate-500 font-mono tracking-widest pt-4 border-t border-slate-800/50">
                                            <span className="flex items-center gap-1"><Radio size={12} /> SIGNATURE: UNKNOWN</span>
                                            <span className="flex items-center gap-1"><Cpu size={12} /> ORIGIN: PROXY-7</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* 4. Input Area (Bottom) */}
                        <div className="p-6 pb-12 w-full flex justify-center relative z-20">
                            <div className="w-full max-w-4xl relative flex items-stretch gap-4">

                                {/* Label Badge - Skewed */}
                                <div className="hidden md:flex bg-neon-cyan text-black px-6 items-center justify-center font-bold tracking-widest transform skew-x-[-12deg] shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                                    <div className="transform skew-x-[12deg] whitespace-nowrap">
                                        ANSWER //
                                    </div>
                                </div>

                                {/* Input Container */}
                                <div className="flex-1 relative group">
                                    <div className="absolute inset-0 bg-slate-900/90 border border-slate-600 transform skew-x-[-12deg] group-focus-within:border-neon-cyan transition-colors"></div>

                                    <input
                                        autoFocus
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="relative w-full h-14 bg-transparent border-none outline-none text-white font-mono text-xl px-8 transform -skew-x-12 placeholder-slate-600 focus:ring-0 uppercase tracking-wider z-10"
                                        placeholder="ENTER COORDINATES OR CITY..."
                                        spellCheck="false"
                                    />

                                    {/* Decoration Lines */}
                                    <div className="absolute bottom-1 right-4 w-12 h-[2px] bg-neon-cyan/50 z-20"></div>

                                    {/* Autocomplete Dropdown */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute bottom-full left-0 mb-2 w-full bg-black/95 border border-slate-700 z-50">
                                            <ul className="py-2">
                                                {suggestions.map((s, i) => (
                                                    <li key={i} onClick={() => handleSuggestionClick(s)} className="px-6 py-2 hover:bg-neon-cyan/20 cursor-pointer text-slate-300 hover:text-neon-cyan font-mono border-l-2 border-transparent hover:border-neon-cyan transition-colors">
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Send Button */}
                                <button
                                    onClick={onSend}
                                    disabled={!inputValue.trim()}
                                    className={`relative px-8 h-14 font-bold uppercase tracking-widest transform skew-x-[-12deg] transition-all duration-300 group overflow-hidden
                                        ${inputValue.trim()
                                            ? 'bg-gradient-to-r from-neon-cyan to-blue-500 text-black shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]'
                                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="transform skew-x-[12deg] flex items-center gap-2">
                                        <span>INITIATE</span>
                                        <Send size={16} className={`transition-transform ${inputValue.trim() ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''}`} />
                                    </div>

                                    {/* Glitch Overlay */}
                                    {inputValue.trim() && (
                                        <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                    </section>

                    {/* --- Overlays --- */}

                    {/* Error Flash */}
                    <div className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-200 ${isError ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay"></div>
                        <div className="absolute inset-0 border-[10px] border-red-500/50 animate-pulse"></div>
                    </div>

                    {/* Try Again Modal */}
                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-[60] transition-all duration-300 ${showTryAgain ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        <div className="bg-black/90 border-2 border-red-500 p-8 flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(239,68,68,0.5)] transform skew-x-[-6deg]">
                            <ShieldAlert size={48} className="text-red-500 animate-pulse" />
                            <h2 className="text-4xl font-black text-red-500 tracking-widest glitch-text">ACCESS DENIED</h2>
                            <p className="text-white font-mono tracking-widest">PENALTY APPLIED // RETRYING CONNECTION</p>
                        </div>
                    </div>

                </main>
            </div>

            <style jsx global>{`
                .glitch-text {
                    text-shadow: 2px 2px 0px #ff0000, -2px -2px 0px #00ffff;
                    animation: glitch 0.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default PlayView;
