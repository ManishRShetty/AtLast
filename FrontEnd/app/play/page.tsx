'use client';

import React, { useState } from 'react';
import SuccessView from './components/SuccessView';
import FailView from './components/FailView';
import IncorrectView from './components/IncorrectView';
import PlayView from './components/PlayView';

type GameState = 'playing' | 'success' | 'fail' | 'incorrect';

const Battlespace = () => {
    const [gameState, setGameState] = useState<GameState>('playing');
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isGameStarted, setIsGameStarted] = useState(false);

    // Timer Logic
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isGameStarted && gameState === 'playing' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing' && isGameStarted) {
            setGameState('fail');
        }
        return () => clearInterval(interval);
    }, [gameState, timeRemaining, isGameStarted]);

    // Audio Logic
    const heartbeatAudioRef = React.useRef<HTMLAudioElement | null>(null);

    React.useEffect(() => {
        // Initialize audio
        heartbeatAudioRef.current = new Audio('/audio/heartbeat.mp3');
        heartbeatAudioRef.current.loop = true;
        heartbeatAudioRef.current.volume = 0.5; // Start at reasonable volume

        return () => {
            if (heartbeatAudioRef.current) {
                heartbeatAudioRef.current.pause();
                heartbeatAudioRef.current = null;
            }
        };
    }, []);

    React.useEffect(() => {
        if (!heartbeatAudioRef.current) return;

        if (isGameStarted && gameState === 'playing' && timeRemaining <= 60 && timeRemaining > 0) {
            // Speed up heartbeat as time runs out (optional polish)
            const playbackRate = timeRemaining < 15 ? 1.5 : (timeRemaining < 30 ? 1.2 : 1.0);
            heartbeatAudioRef.current.playbackRate = playbackRate;

            heartbeatAudioRef.current.play().catch(e => console.warn("Audio playback failed:", e));
        } else {
            heartbeatAudioRef.current.pause();
            heartbeatAudioRef.current.currentTime = 0;
        }
    }, [isGameStarted, gameState, timeRemaining]);

    const handleSend = (command: string): boolean => {
        if (command.toLowerCase().trim() === 'buenos aires') {
            setGameState('success');
            return true;
        } else {
            setTimeRemaining((prev) => Math.max(0, prev - 10));
            return false;
        }
    };

    const resetGame = () => {
        setGameState('playing');
        setTimeRemaining(60);
        setIsGameStarted(false); // Reset to show handoff again? Or maybe just restart timer? User intention unclear, assuming full reset.
    };

    if (gameState === 'success') {
        return <SuccessView resetGame={resetGame} />;
    }

    if (gameState === 'fail') {
        return <FailView resetGame={resetGame} />;
    }

    if (gameState === 'incorrect') {
        return <IncorrectView resetGame={resetGame} />;
    }

    return (
        <PlayView
            handleSend={handleSend}
            timeRemaining={timeRemaining}
            isGameStarted={isGameStarted}
            onStartGame={() => setIsGameStarted(true)}
        />
    );
};

export default Battlespace;
