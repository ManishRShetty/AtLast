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

    // Timer Logic
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState === 'playing' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing') {
            setGameState('fail');
        }
        return () => clearInterval(interval);
    }, [gameState, timeRemaining]);

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

    return <PlayView handleSend={handleSend} timeRemaining={timeRemaining} />;
};

export default Battlespace;
