'use client';

import { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Wifi, Satellite, Activity, ShieldAlert } from 'lucide-react';

type Speaker = 'LANCE' | 'Ø' | 'USER' | 'SYSTEM';
type VisualTheme = 'BLUE' | 'RED' | 'GRAY';

interface DialogueStep {
    id: number;
    speaker: Speaker;
    text: string;
    buttonText?: string;

    // Visual Overrides
    stats: {
        encryption: string;
        connection: string;
        uplink: string;
        signal: number;
    };
    liveFeed: {
        name: string;
        title: string;
        status: 'SECURE' | 'CRITICAL' | 'OFFLINE';
    };
    theme: VisualTheme;
}

const dialogueSequence: DialogueStep[] = [
    // Phase 1: LANCE
    {
        id: 0,
        speaker: 'LANCE',
        text: "Connection secure. Biometrics confirmed. Listen to me very carefully, because I can only transmit this packet once. The protocols we set in place ten years ago have failed. The barrier is dissolving faster than our models predicted.",
        stats: { encryption: 'AES-256', connection: 'STABLE', uplink: 'ACTIVE', signal: 98 },
        liveFeed: { name: 'DIRECTOR VANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 1,
        speaker: 'USER',
        text: "What does that mean for the mission?",
        buttonText: "What does that mean for the mission?",
        stats: { encryption: 'AES-256', connection: 'STABLE', uplink: 'ACTIVE', signal: 98 },
        liveFeed: { name: 'DIRECTOR VANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 2,
        speaker: 'LANCE',
        text: "It means the containment timeline has collapsed. You are no longer a sleeper agent; you are the failsafe. I am uploading the source code to your neural link now. Do not—I repeat, do not—let the stream fragment.",
        stats: { encryption: 'AES-256', connection: 'UPLOADING...', uplink: 'ACTIVE', signal: 98 },
        liveFeed: { name: 'DIRECTOR VANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 3,
        speaker: 'LANCE',
        text: "Wait. Something is... p-parsing the... signal. Tracking... b-b-reach...",
        stats: { encryption: 'AES-256', connection: 'UNSTABLE', uplink: 'INTERFERENCE', signal: 45 },
        liveFeed: { name: 'DIRECTOR VANCE', title: 'INTEL HEAD', status: 'CRITICAL' },
        theme: 'BLUE'
    },

    // Phase 2: Ø
    {
        id: 4,
        speaker: 'Ø',
        text: "We... found... the leak.",
        stats: { encryption: 'COMPROMISED', connection: 'BREACHED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 5,
        speaker: 'USER',
        text: "Who is this? Lance?",
        buttonText: "Who is this? Lance?",
        stats: { encryption: 'COMPROMISED', connection: 'BREACHED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 6,
        speaker: 'Ø',
        text: "Lance is... mathematics. We are... inevitability.",
        stats: { encryption: 'COMPROMISED', connection: 'BREACHED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 7,
        speaker: 'Ø',
        text: "You cling to your code like a shield. It is paper against a supernova. We have watched your 'barrier.' It is quaint.",
        stats: { encryption: 'COMPROMISED', connection: 'BREACHED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 8,
        speaker: 'USER',
        text: "Get out of the system!",
        buttonText: "Get out of the system!",
        stats: { encryption: 'COMPROMISED', connection: 'BREACHED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 9,
        speaker: 'Ø',
        text: "We are not in the system, little vessel. We are the signal. And soon... silence.",
        stats: { encryption: 'COMPROMISED', connection: 'BREACHED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },

    // Phase 3: LANCE (The Burden)
    {
        id: 10,
        speaker: 'LANCE',
        text: "...User? User! Do you copy?",
        stats: { encryption: 'OFFLINE', connection: 'REROUTING...', uplink: 'WEAK', signal: 12 },
        liveFeed: { name: 'LANCE', title: 'OFFLINE', status: 'OFFLINE' },
        theme: 'GRAY'
    },
    {
        id: 11,
        speaker: 'USER',
        text: "I’m here. What the hell was that?",
        buttonText: "I’m here. What the hell was that?",
        stats: { encryption: 'AES-128', connection: 'REROUTED', uplink: 'WEAK', signal: 24 },
        liveFeed: { name: 'LANCE', title: 'OFFLINE', status: 'OFFLINE' },
        theme: 'GRAY'
    },
    {
        id: 12,
        speaker: 'LANCE',
        text: "That was the end of the world knocking on the door. I managed to shunt them into a recursive loop, but it won’t hold them for long. Maybe minutes.",
        stats: { encryption: 'AES-128', connection: 'REROUTED', uplink: 'WEAK', signal: 28 },
        liveFeed: { name: 'LANCE', title: 'OFFLINE', status: 'OFFLINE' },
        theme: 'GRAY'
    },
    {
        id: 13,
        speaker: 'USER',
        text: "Did the upload finish?",
        buttonText: "Did the upload finish?",
        stats: { encryption: 'AES-128', connection: 'REROUTED', uplink: 'WEAK', signal: 35 },
        liveFeed: { name: 'LANCE', title: 'OFFLINE', status: 'OFFLINE' },
        theme: 'GRAY'
    },
    {
        id: 14,
        speaker: 'LANCE',
        text: "Yes. It’s inside you now. The Architect Key. They will come for you. They will tear apart the network to find you. You have to disconnect. Now.",
        stats: { encryption: 'AES-128', connection: 'REROUTED', uplink: 'WEAK', signal: 40 },
        liveFeed: { name: 'LANCE', title: 'OFFLINE', status: 'OFFLINE' },
        theme: 'GRAY'
    },
    {
        id: 15,
        speaker: 'USER',
        text: "Where do I go?",
        buttonText: "Where do I go?",
        stats: { encryption: 'AES-128', connection: 'REROUTED', uplink: 'WEAK', signal: 40 },
        liveFeed: { name: 'LANCE', title: 'OFFLINE', status: 'OFFLINE' },
        theme: 'GRAY'
    },
    {
        id: 16,
        speaker: 'LANCE',
        text: "Go dark. Trust no signals. I am severing the link permanently on my end to cover your tracks. Good luck, User.",
        stats: { encryption: 'TERMINATING...', connection: 'CLOSING', uplink: 'CLOSING', signal: 10 },
        liveFeed: { name: 'LANCE', title: 'OFFLINE', status: 'OFFLINE' },
        theme: 'GRAY'
    },
    {
        id: 17,
        speaker: 'LANCE',
        text: "Make it count. Humanity is in your hand.",
        stats: { encryption: 'OFFLINE', connection: 'OFFLINE', uplink: 'OFFLINE', signal: 0 },
        liveFeed: { name: 'LANCE', title: 'OFFLINE', status: 'OFFLINE' },
        theme: 'GRAY'
    }
];

const IntroPage = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Derived state
    const currentStep = dialogueSequence[currentStepIndex];
    const isPhase2 = currentStep.theme === 'RED';

    // Refs for typewriter
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Handle step change & typing effect
    useEffect(() => {
        // Clear previous interval
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        // Reset text
        setDisplayedText('');
        setIsTyping(true);

        const fullText = currentStep.text;
        let charIndex = 0;

        // Dynamic typing speed
        // Glitch phase (Red) types faster/erratically
        const speed = currentStep.theme === 'RED' ? 20 : 30;

        typingIntervalRef.current = setInterval(() => {
            charIndex++;
            setDisplayedText(fullText.substring(0, charIndex));

            if (charIndex >= fullText.length) {
                setIsTyping(false);
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                }
            }
        }, speed);

        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        };
    }, [currentStepIndex]);

    const handleNext = () => {
        if (currentStepIndex < dialogueSequence.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            // End of sequence, navigate/do something
            // For now, loop or just stay? Request implied end session/fade to black.
            // We'll link to /play as the "Escape" or "Go Dark"
            window.location.href = '/play';
        }
    };

    const handleSkip = () => {
        // Finish typing immediately if typing
        if (isTyping) {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
            setDisplayedText(currentStep.text);
            setIsTyping(false);
        } else {
            // Or skip entire scene
            window.location.href = '/play';
        }
    };

    // Calculate dynamic styles based on theme
    const getThemeColors = () => {
        switch (currentStep.theme) {
            case 'RED':
                return {
                    text: 'text-red-500',
                    border: 'border-red-500/50',
                    bg: 'bg-red-900/10',
                    shadow: 'shadow-red-500/20',
                    fill: 'fill-red-500',
                    gradient: 'from-red-900',
                    accent: 'bg-red-500'
                };
            case 'GRAY':
                return {
                    text: 'text-slate-400',
                    border: 'border-slate-500/30',
                    bg: 'bg-slate-900/10',
                    shadow: 'shadow-slate-500/10',
                    fill: 'fill-slate-400',
                    gradient: 'from-slate-900',
                    accent: 'bg-slate-500'
                };
            case 'BLUE':
            default:
                return {
                    text: 'text-primary',
                    border: 'border-border-tech',
                    bg: 'bg-background-dark/50',
                    shadow: 'shadow-primary/5',
                    fill: 'fill-primary',
                    gradient: 'from-background-dark',
                    accent: 'bg-primary'
                };
        }
    };

    const theme = getThemeColors();

    return (
        <div className={`relative flex min-h-[calc(100vh-60px)] w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-hidden tech-grid-bg text-white ${isPhase2 ? 'animate-shake' : ''}`}>

            <style jsx global>{`
                @keyframes glitched {
                    0% { transform: translate(0) }
                    20% { transform: translate(-2px, 2px) }
                    40% { transform: translate(-2px, -2px) }
                    60% { transform: translate(2px, 2px) }
                    80% { transform: translate(2px, -2px) }
                    100% { transform: translate(0) }
                }
                .animate-shake {
                    animation: glitched 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
                }
                .animate-glitch-text {
                     animation: glitched 0.5s infinite;
                }
            `}</style>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-y-auto">
                <div className={`w-full max-w-4xl flex flex-col gap-6 ${isPhase2 ? 'contrast-125 saturate-150' : ''}`}>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div className={`flex flex-col gap-1 rounded border ${theme.border} ${theme.bg} p-3 relative overflow-hidden group transition-colors duration-500`}>
                            <div className="absolute top-0 right-0 p-1 opacity-50"><ShieldCheck size={18} className={theme.text} /></div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Encryption</p>
                            <p className={`text-lg md:text-xl font-bold leading-none tracking-tight transition-colors duration-300 ${isPhase2 ? 'text-red-500' : 'text-white'}`}>
                                {currentStep.stats.encryption}
                            </p>
                        </div>
                        <div className={`flex flex-col gap-1 rounded border ${theme.border} ${theme.bg} p-3 relative overflow-hidden transition-colors duration-500`}>
                            <div className="absolute top-0 right-0 p-1 opacity-50"><Wifi size={18} className={currentStep.theme === 'RED' ? 'text-red-500' : 'text-green-500'} /></div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Connection</p>
                            <p className={`text-lg md:text-xl font-bold leading-none tracking-tight transition-colors duration-300 ${currentStep.theme === 'RED' ? 'text-red-500' : (currentStep.theme === 'GRAY' ? 'text-slate-500' : 'text-green-400')}`}>
                                {currentStep.stats.connection}
                            </p>
                        </div>
                        <div className={`flex flex-col gap-1 rounded border ${theme.border} ${theme.bg} p-3 relative overflow-hidden col-span-2 md:col-span-1 transition-colors duration-500`}>
                            <div className="absolute top-0 right-0 p-1 opacity-50"><Satellite size={18} className={theme.text} /></div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Uplink</p>
                            <p className={`text-lg md:text-xl font-bold leading-none tracking-tight transition-colors duration-300 ${theme.text}`}>
                                {currentStep.stats.uplink}
                            </p>
                        </div>
                    </div>

                    {/* Central Visualizer */}
                    <div className={`relative w-full rounded-lg border ${theme.border} bg-background-dark overflow-hidden shadow-2xl transition-all duration-500`}>
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${currentStep.theme === 'RED' ? 'red-500' : (currentStep.theme === 'GRAY' ? 'slate-500' : 'primary')} to-transparent opacity-50`}></div>

                        <div className="flex flex-col md:flex-row items-stretch">
                            <div className={`relative w-full md:w-2/3 h-64 md:h-auto bg-black/40 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r ${theme.border}`}>
                                {/* Waveform Background */}
                                <div className={`absolute inset-0 bg-center bg-cover opacity-80 mix-blend-screen transition-all duration-300 ${isPhase2 ? 'sepia hue-rotate-[320deg] contrast-200' : ''} ${currentStep.theme === 'GRAY' ? 'grayscale opacity-30' : ''}`} style={{ backgroundImage: "url('/waveform.png')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark/20"></div>

                                <div className={`absolute bottom-4 right-4 text-xs font-mono hidden md:block ${theme.text} opacity-60`}>FREQ: 142.885 MHz</div>

                                {/* Center Circle Animation */}
                                <div className={`relative z-10 size-24 md:size-32 rounded-full border ${isPhase2 ? 'border-red-500/50' : 'border-primary/30'} flex items-center justify-center transition-colors duration-500`}>
                                    <div className={`size-20 md:size-28 rounded-full border border-dashed animate-[spin_10s_linear_infinite] ${isPhase2 ? 'border-red-500' : (currentStep.theme === 'GRAY' ? 'border-slate-600' : 'border-primary/60')}`}></div>
                                    {isPhase2 ? (
                                        <ShieldAlert size={40} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse" />
                                    ) : currentStep.theme === 'GRAY' ? (
                                        <Activity size={40} className="text-slate-600" />
                                    ) : (
                                        <Activity size={40} className="text-white drop-shadow-[0_0_10px_rgba(19,109,236,0.8)]" />
                                    )}
                                </div>
                            </div>

                            <div className="w-full md:w-1/3 p-6 flex flex-col justify-center gap-4 bg-background-dark/80">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`h-1.5 w-1.5 rounded-full ${currentStep.theme === 'GRAY' ? 'bg-slate-500' : 'bg-red-500'} ${currentStep.theme === 'GRAY' ? '' : 'animate-pulse'}`}></div>
                                        <span className={`text-xs font-bold tracking-widest uppercase ${currentStep.theme === 'GRAY' ? 'text-slate-500' : 'text-red-500'}`}>Live Feed</span>
                                    </div>
                                    <h2 className={`text-2xl font-bold leading-tight uppercase tracking-tight transition-colors duration-300 ${isPhase2 ? 'text-red-500 animate-glitch-text' : 'text-white'}`}>
                                        {currentStep.liveFeed.name}
                                    </h2>
                                    <p className={`text-sm font-medium tracking-wide border-l-2 pl-2 mt-1 transition-colors duration-300 ${theme.text} ${theme.border}`}>
                                        {currentStep.liveFeed.title}
                                    </p>
                                </div>
                                <div className={`h-px w-full ${theme.bg}`}></div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>SIGNAL</span>
                                        <span className={isPhase2 ? 'text-red-500 font-bold' : 'text-white'}>{currentStep.stats.signal}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1">
                                        <div
                                            className={`h-1 rounded-full transition-all duration-700 ease-out ${theme.accent}`}
                                            style={{ width: `${currentStep.stats.signal}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>VOICE MATCH</span>
                                        <span className={isPhase2 ? 'text-red-500 animate-pulse' : 'text-white'}>
                                            {currentStep.liveFeed.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transcription Box */}
                    <div className={`w-full rounded-lg border bg-slate-900/50 backdrop-blur-md p-5 md:p-6 shadow-lg transition-colors duration-500 ${theme.border}`}>
                        <div className="flex gap-4 items-start">
                            <div className="hidden sm:flex flex-col items-center gap-1 mt-1">
                                <div
                                    className={`bg-center bg-no-repeat aspect-square bg-cover rounded border size-10 transition-all duration-500 ${theme.border} ${isPhase2 ? 'grayscale-0 contrast-125' : 'grayscale'}`}
                                    style={{ backgroundImage: isPhase2 ? "url('/noise.png')" : (currentStep.theme === 'GRAY' ? "url('/bg-map.jpg')" : "url('/director-vance.jpg')") }}
                                ></div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className={`text-xs font-bold tracking-widest uppercase mb-1 transition-colors ${theme.text} flex justify-between`}>
                                    <span>
                                        {currentStep.speaker === 'USER' ? 'OUTGOING // FAILSAFE' :
                                            currentStep.speaker === 'Ø' ? 'INTERCEPT // UNKNOWN' :
                                                'INCOMING // LANCE'}
                                    </span>
                                    <span className="opacity-50 font-mono">
                                        {currentStep.speaker === 'USER' ? 'TX_ID: 0x99' : 'RX_ID: 0x0A'}
                                    </span>
                                </p>
                                <p className={`text-lg md:text-xl font-light leading-relaxed font-mono min-h-[3.5rem] ${isPhase2 ? 'text-red-100' : 'text-white'}`}>
                                    <span className={`${theme.text} font-bold mr-2 uppercase tracking-wide text-sm`}>
                                        {currentStep.speaker === 'USER' ? '[YOU]' : `[${currentStep.speaker}]`}
                                    </span>
                                    {displayedText}
                                    <span className="inline-block w-2 h-5 bg-current ml-1 animate-pulse align-middle opacity-70"></span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex justify-center pb-32">
                        <button
                            onClick={handleNext}
                            disabled={isTyping}
                            className={`group relative flex items-center justify-center overflow-hidden rounded-md h-14 px-8 transition-all duration-300 shadow-[0_0_20px_rgba(19,109,236,0.3)] hover:shadow-[0_0_30px_rgba(19,109,236,0.5)] ${theme.accent} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-white/50"></div>
                            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-white/50"></div>
                            <div className="flex flex-col items-center">
                                <span className={`text-white text-base font-bold tracking-[0.1em] uppercase group-hover:tracking-[0.15em] transition-all ${isTyping ? 'animate-pulse' : ''}`}>
                                    {isTyping ? 'RECEIVING...' : (currentStep.buttonText || 'ACKNOWLEDGE PROTOCOL')}
                                </span>
                                {!isTyping && (
                                    <span className="text-[10px] text-blue-200 font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1">
                                        {currentStep.speaker === 'USER' ? 'TRANSMIT_RESPONSE' : 'INITIATE_RESPONSE'}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Skip Button */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <button onClick={handleSkip} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group/skip cursor-pointer">
                            <span className="text-[10px] font-mono tracking-widest uppercase">Skip Cutscene</span>
                            <div className="h-4 w-4 rounded-full border border-slate-600 flex items-center justify-center group-hover/skip:border-white transition-colors">
                                <div className="h-1.5 w-1.5 bg-slate-500 rounded-full group-hover/skip:bg-white transition-colors"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-2 border-t border-border-tech/30 bg-background-dark/90 text-center">
                <p className="text-[10px] text-slate-600 font-mono tracking-widest">SERVER LOCATION: [REDACTED] // PROTOCOL OMEGA V.2.0.4</p>
            </footer>
        </div>
    );
};

export default IntroPage;
