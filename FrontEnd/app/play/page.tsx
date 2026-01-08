'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SuccessView from './components/SuccessView';
import FailView from './components/FailView';
import IncorrectView from './components/IncorrectView';
import PlayView from './components/PlayView';
import { startSession, getQuestion, submitAnswer, streamLogs } from '@/services/apiService';
import { RiddleData } from '@/types';

type GameState = 'loading' | 'playing' | 'success' | 'fail' | 'incorrect';

const Battlespace = () => {
    const [gameState, setGameState] = useState<GameState>('loading');
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [riddle, setRiddle] = useState<RiddleData | null>(null);
    const [agentLogs, setAgentLogs] = useState<string[]>([]);
    const [isLoadingRiddle, setIsLoadingRiddle] = useState(false);

    const stopLogStreamRef = useRef<(() => void) | null>(null);

    // Initialize session and fetch first riddle when game starts
    const initializeGame = useCallback(async () => {
        try {
            setIsLoadingRiddle(true);
            setAgentLogs(['Initializing secure connection...']);

            // Start a new session
            const newSessionId = await startSession();
            setSessionId(newSessionId);
            setAgentLogs(prev => [...prev, `Session established: ${newSessionId.slice(0, 8)}...`]);

            // Start streaming logs
            if (stopLogStreamRef.current) {
                stopLogStreamRef.current();
            }
            stopLogStreamRef.current = streamLogs(
                newSessionId,
                (message) => {
                    setAgentLogs(prev => [...prev, message]);
                },
                (error) => {
                    console.error('Log stream error:', error);
                }
            );

            // Fetch the first riddle
            setAgentLogs(prev => [...prev, 'Requesting target intelligence...']);
            const riddleData = await getQuestion(newSessionId);
            setRiddle(riddleData);
            setAgentLogs(prev => [...prev, `Target acquired: ${riddleData.location?.name || 'Unknown'}`]);
            setAgentLogs(prev => [...prev, 'MISSION READY. AWAITING AGENT INPUT.']);

            setGameState('playing');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            setAgentLogs(prev => [...prev, `ERROR: ${error instanceof Error ? error.message : 'Connection failed'}`]);
        } finally {
            setIsLoadingRiddle(false);
        }
    }, []);

    // Start the game when user clicks the handoff modal
    const handleStartGame = useCallback(async () => {
        setIsGameStarted(true);
        await initializeGame();
    }, [initializeGame]);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isGameStarted && gameState === 'playing' && timeRemaining > 0 && !isLoadingRiddle) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing' && isGameStarted) {
            setGameState('fail');
        }
        return () => clearInterval(interval);
    }, [gameState, timeRemaining, isGameStarted, isLoadingRiddle]);

    // Audio Logic
    const heartbeatAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio
        heartbeatAudioRef.current = new Audio('/audio/heartbeat.mp3');
        heartbeatAudioRef.current.loop = true;
        heartbeatAudioRef.current.volume = 0.5;

        return () => {
            if (heartbeatAudioRef.current) {
                heartbeatAudioRef.current.pause();
                heartbeatAudioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!heartbeatAudioRef.current) return;

        if (isGameStarted && gameState === 'playing' && timeRemaining <= 60 && timeRemaining > 0 && !isLoadingRiddle) {
            const playbackRate = timeRemaining < 15 ? 1.5 : (timeRemaining < 30 ? 1.2 : 1.0);
            heartbeatAudioRef.current.playbackRate = playbackRate;
            heartbeatAudioRef.current.play().catch(e => console.warn("Audio playback failed:", e));
        } else {
            heartbeatAudioRef.current.pause();
            heartbeatAudioRef.current.currentTime = 0;
        }
    }, [isGameStarted, gameState, timeRemaining, isLoadingRiddle]);

    // Cleanup log stream on unmount
    useEffect(() => {
        return () => {
            if (stopLogStreamRef.current) {
                stopLogStreamRef.current();
            }
        };
    }, []);

    const handleSend = async (command: string): Promise<boolean> => {
        if (!sessionId) {
            console.error('No session ID');
            return false;
        }

        try {
            const result = await submitAnswer(sessionId, command);

            if (result.correct) {
                setGameState('success');
                return true;
            } else {
                setTimeRemaining((prev) => Math.max(0, prev - 10));
                return false;
            }
        } catch (error) {
            console.error('Failed to verify answer:', error);
            // Fallback to local check if API fails
            if (riddle && command.toLowerCase().trim() === riddle.answer.toLowerCase().trim()) {
                setGameState('success');
                return true;
            }
            setTimeRemaining((prev) => Math.max(0, prev - 10));
            return false;
        }
    };

    const resetGame = () => {
        // Cleanup previous session
        if (stopLogStreamRef.current) {
            stopLogStreamRef.current();
            stopLogStreamRef.current = null;
        }

        setGameState('loading');
        setTimeRemaining(60);
        setIsGameStarted(false);
        setSessionId(null);
        setRiddle(null);
        setAgentLogs([]);
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
            onStartGame={handleStartGame}
            riddle={riddle}
            agentLogs={agentLogs}
            isLoadingRiddle={isLoadingRiddle}
        />
    );
};

export default Battlespace;
