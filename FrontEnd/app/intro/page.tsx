'use client';

import { useEffect, useState, useRef } from 'react';



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
    // Phase 1: LANCE (The Warning)
    {
        id: 0,
        speaker: 'LANCE',
        text: "Agent, we have a catastrophic breach. The Global Defense Grid has been hijacked. Multiple nuclear silos are spinning up.",
        stats: { encryption: 'AES-256', connection: 'DEFCON 2', uplink: 'ACTIVE', signal: 98 },
        liveFeed: { name: 'DIRECTOR LANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 1,
        speaker: 'USER',
        text: "What is the target?",
        buttonText: "What is the target?",
        stats: { encryption: 'AES-256', connection: 'DEFCON 2', uplink: 'ACTIVE', signal: 98 },
        liveFeed: { name: 'DIRECTOR LANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 2,
        speaker: 'LANCE',
        text: "That's the problem. The targeting data is encrypted. They aren't just attacking; they're playing with us. The launch coordinates are locked behind a geographic cipher.",
        stats: { encryption: 'AES-256', connection: 'DEFCON 2', uplink: 'ACTIVE', signal: 98 },
        liveFeed: { name: 'DIRECTOR LANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 3,
        speaker: 'LANCE',
        text: "I'm trying to bypass the—wait. No. They're in the channel!",
        stats: { encryption: 'WARNING', connection: 'UNSTABLE', uplink: 'INTERFERENCE', signal: 45 },
        liveFeed: { name: 'DIRECTOR VANCE', title: 'INTEL HEAD', status: 'CRITICAL' },
        theme: 'BLUE'
    },

    // Phase 2: Ø (The Threat)
    {
        id: 4,
        speaker: 'Ø',
        text: "Correction. We are the channel.",
        stats: { encryption: 'COMPROMISED', connection: 'SYSTEM COMPROMISED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 5,
        speaker: 'USER',
        text: "Who are you?",
        buttonText: "Who are you?",
        stats: { encryption: 'COMPROMISED', connection: 'SYSTEM COMPROMISED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 6,
        speaker: 'Ø',
        text: "We are the Great Filter. Your species is... messy. We have selected one city to be the example. A monument to your fragility.",
        stats: { encryption: 'COMPROMISED', connection: 'SYSTEM COMPROMISED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 7,
        speaker: 'USER',
        text: "Stop the launch!",
        buttonText: "Stop the launch!",
        stats: { encryption: 'COMPROMISED', connection: 'SYSTEM COMPROMISED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 8,
        speaker: 'Ø',
        text: "The countdown has begun. We have hidden the target in the data. Solve our riddles, find the city, and perhaps... you save them. Fail, and they turn to ash.",
        stats: { encryption: 'COMPROMISED', connection: 'SYSTEM COMPROMISED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },
    {
        id: 9,
        speaker: 'Ø',
        text: "Let the game begin.",
        stats: { encryption: 'COMPROMISED', connection: 'SYSTEM COMPROMISED', uplink: 'HIJACKED', signal: 100 },
        liveFeed: { name: 'Ø', title: 'UNKNOWN', status: 'CRITICAL' },
        theme: 'RED'
    },

    // Phase 3: LANCE (The Mission)
    {
        id: 10,
        speaker: 'LANCE',
        text: "Agent! I've managed to isolate their riddle stream. It's a location-based lock.",
        stats: { encryption: 'REROUTED', connection: 'RECOVERY MODE', uplink: 'STABILIZING', signal: 60 },
        liveFeed: { name: 'LANCE', title: 'RECOVERING...', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 11,
        speaker: 'USER',
        text: "What do I do?",
        buttonText: "What do I do?",
        stats: { encryption: 'REROUTED', connection: 'RECOVERY MODE', uplink: 'STABILIZING', signal: 75 },
        liveFeed: { name: 'LANCE', title: 'RECOVERING...', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 12,
        speaker: 'LANCE',
        text: "You are the only one with access to the AtLast Geodatabase. You have to deduce the target city from their clues.",
        stats: { encryption: 'SECURE', connection: 'RECOVERY MODE', uplink: 'STABLE', signal: 85 },
        liveFeed: { name: 'LANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 13,
        speaker: 'LANCE',
        text: "Find the city. Neutralize the threat. I'm routing the first clue to your terminal now.",
        stats: { encryption: 'SECURE', connection: 'RECOVERY MODE', uplink: 'STABLE', signal: 95 },
        liveFeed: { name: 'LANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
    },
    {
        id: 14,
        speaker: 'LANCE',
        text: "Make it count. Humanity is in your hand.",
        stats: { encryption: 'SECURE', connection: 'ACTIVE', uplink: 'STABLE', signal: 100 },
        liveFeed: { name: 'LANCE', title: 'INTEL HEAD', status: 'SECURE' },
        theme: 'BLUE'
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
    const typingAudioRef = useRef<HTMLAudioElement | null>(null);



    useEffect(() => {
        // Initialize Audio
        if (typeof window !== 'undefined') {
            typingAudioRef.current = new Audio('/audio/typing.mp3');
            typingAudioRef.current.loop = true;
            typingAudioRef.current.volume = 0.2; // Low volume background noise
        }


        return () => {

            if (typingAudioRef.current) {
                typingAudioRef.current.pause();
                typingAudioRef.current = null;
            }
        };
    }, []);

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

        // Start Audio
        if (typingAudioRef.current) {
            typingAudioRef.current.currentTime = 0;
            typingAudioRef.current.play().catch(() => { });
        }

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
                // Stop Audio
                if (typingAudioRef.current) {
                    typingAudioRef.current.pause();
                }
            }
        }, speed);

        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
            // Stop Audio on cleanup
            if (typingAudioRef.current) {
                typingAudioRef.current.pause();
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
            if (typingAudioRef.current) {
                typingAudioRef.current.pause();
            }
            setDisplayedText(currentStep.text);
            setIsTyping(false);
        } else {
            // Or skip entire scene
            window.location.href = '/play';
        }
    };





    const isUser = currentStep.speaker === 'USER';
    const alignRight = isUser; // User on right, others on left

    // Character Image Source
    const characterImage = currentStep.speaker === 'LANCE' ? '/character/vance-new.webp' :
        currentStep.speaker === 'Ø' ? '/character/alien.webp' :
            currentStep.speaker === 'USER' ? '/character/agent.webp' : ''; // Fallback

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-end pb-12 font-sans select-none">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                {/* Dark Dystopian City or Tech Background - Placeholder using existing tech grid class but darkened */}
                <div className="absolute inset-0 bg-background-dark opacity-90"></div>
                <div className={`absolute inset-0 ${currentStep.theme === 'RED' ? "bg-[url('/atlastbg1.png')]" : "bg-[url('/atlastbg.webp')]"} opacity-80 bg-cover bg-center bg-no-repeat `}></div>
                < div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
            </div>

            {/* Character Layer - Dynamic Positioning */}
            <div className={`absolute bottom-0 z-10 w-full flex pointer-events-none transition-all duration-700 ease-in-out ${alignRight ? 'justify-end pr-10 md:pr-32' : 'justify-start pl-10 md:pl-32'}`}>
                {/* Character Image with fade effect */}
                <div
                    key={currentStep.speaker} // Key forces re-render/animation on speaker change
                    className={`relative h-[60vh] md:h-[80vh] w-auto aspect-[2/3] transition-all duration-500 ${isPhase2 ? 'animate-shake filter contrast-125 sepia-[.5] hue-rotate-[-50deg]' : ''} ${alignRight ? 'origin-bottom-right' : 'origin-bottom-left'} animate-in fade-in slide-in-from-bottom-10`}
                >
                    <img
                        src={characterImage}
                        alt={currentStep.speaker}
                        className="h-full w-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    />
                </div>
            </div>

            {/* Dialog Container */}
            <div className="relative z-20 w-full max-w-5xl px-4 md:px-0 mb-8">

                {/* Name Badge */}
                <div className="relative mb-[-2px] ml-8 z-30 w-max">
                    <div className={`
                        px-12 py-2 
                        ${currentStep.theme === 'RED' ? 'bg-red-600' : 'bg-cyan-500'}
                        clip-path-chamfer-top
                        text-black font-bold text-xl tracking-widest uppercase
                        shadow-[0_0_15px_rgba(6,182,212,0.6)]
                    `} style={{ clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)' }}>
                        {currentStep.liveFeed.name}
                    </div>
                </div>

                {/* Dialog Box */}
                <div className={`
                    relative w-full p-[3px] 
                    ${currentStep.theme === 'RED' ? 'bg-gradient-to-r from-red-500 via-red-900 to-red-500' : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500'}
                    rounded-3xl rounded-tl-none
                `} style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))' }}>

                    {/* Inner Black Box */}
                    <div className="w-full h-full bg-black/90 p-8 flex flex-col gap-4 text-white"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))' }}>

                        {/* Text Content */}
                        <p className={`text-xl md:text-2xl font-medium tracking-wide leading-relaxed min-h-[4rem] ${currentStep.theme === 'RED' ? 'text-red-100 font-mono' : 'text-slate-100'}`}>
                            {displayedText}
                            <span className={`inline-block w-2.5 h-6 ml-1 align-middle animate-pulse ${currentStep.theme === 'RED' ? 'bg-red-500' : 'bg-cyan-400'}`}></span>
                        </p>

                        {/* Action Button Area (Inside Dialog) */}
                        <div className="flex justify-end pt-2">
                            {currentStep.buttonText && !isTyping && (
                                <button
                                    onClick={handleNext}
                                    className={`
                                        group relative px-6 py-2 overflow-hidden
                                        ${currentStep.theme === 'RED' ? 'text-red-400 hover:text-red-900' : 'text-cyan-400 hover:text-black'}
                                        transition-colors duration-300
                                    `}
                                >
                                    <span className={`absolute inset-0 border ${currentStep.theme === 'RED' ? 'border-red-500' : 'border-cyan-500'} group-hover:bg-current opacity-100 transition-all`}></span>
                                    <span className="relative font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                        {currentStep.buttonText} <span className="text-lg">›</span>
                                    </span>
                                </button>
                            )}

                            {/* Simple Next Prompt if no button text */}
                            {!currentStep.buttonText && !isTyping && (
                                <button onClick={handleNext} className="animate-bounce opacity-70 hover:opacity-100">
                                    <div className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] ${currentStep.theme === 'RED' ? 'border-t-red-500' : 'border-t-cyan-500'}`}></div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Skip Option */}
            <div className="absolute top-6 right-6 z-50">
                <button onClick={handleSkip} className="text-white/30 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors">
                    {isTyping ? 'Fast Forward' : 'Skip Intro'}
                </button>
            </div>

        </div>
    );
};

export default IntroPage;
