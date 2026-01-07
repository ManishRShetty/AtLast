'use client';

import React, { useState } from 'react';
import SuccessView from './components/SuccessView';
import FailView from './components/FailView';
import IncorrectView from './components/IncorrectView';
import PlayView from './components/PlayView';

type GameState = 'playing' | 'success' | 'fail' | 'incorrect';

const Battlespace = () => {
    const [gameState, setGameState] = useState<GameState>('playing');

    const handleSend = () => {
        const states: GameState[] = ['success', 'fail', 'incorrect'];
        const randomState = states[Math.floor(Math.random() * states.length)];
        setGameState(randomState);
    };

    const resetGame = () => {
        setGameState('playing');
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

    return <PlayView handleSend={handleSend} />;
};

export default Battlespace;
