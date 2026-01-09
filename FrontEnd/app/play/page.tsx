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

    // Track if fail logs have been added to prevent duplicates
    const [failLogsAdded, setFailLogsAdded] = useState(false);

    const stopLogStreamRef = useRef<(() => void) | null>(null);

    // Map frontend difficulty names to backend names
    const mapDifficulty = (frontendDifficulty: string): string => {
        const mapping: Record<string, string> = {
            'RECRUIT': 'Easy',
            'AGENT': 'Medium',
            'VETERAN': 'Hard'
        };
        return mapping[frontendDifficulty] || 'Medium';
    };

    // Initialize session and fetch first riddle when game starts
    const initializeGame = useCallback(async () => {
        try {
            setIsLoadingRiddle(true);
            setAgentLogs(['Initializing secure connection...']);

            // Get difficulty from localStorage (set by AgentRegistrationModal)
            const storedDifficulty = typeof window !== 'undefined'
                ? localStorage.getItem('atlast_difficulty') || 'AGENT'
                : 'AGENT';
            const backendDifficulty = mapDifficulty(storedDifficulty);

            setAgentLogs(prev => [...prev, `Difficulty: ${backendDifficulty.toUpperCase()}`]);

            // Start a new session with difficulty
            const newSessionId = await startSession(backendDifficulty);
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
            setAgentLogs(prev => [...prev, 'Target acquired: [REDACTED]']);
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

    // Handle Fail State Logs
    useEffect(() => {
        if (gameState === 'fail' && !failLogsAdded) {
            setAgentLogs(prev => [
                ...prev,
                '[ERROR] CONNECTION TERMINATED',
                '[ERROR] SIGNAL LOST',
                `[ERROR] TARGET CITY WAS: ${riddle?.answer?.toUpperCase() || 'UNKNOWN'}`,
                `[INFO] The answer was "${riddle?.answer || 'Unknown'}"`,
                '[SYSTEM] System Halted // Terminal ID: OMEGA-9 // ERROR_CODE: 0x4B2'
            ]);
            setFailLogsAdded(true);
        } else if (gameState !== 'fail') {
            setFailLogsAdded(false);
        }
    }, [gameState, failLogsAdded, riddle]);


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
        setFailLogsAdded(false);
    };

    // Load next riddle without resetting the entire game (for correct answers)
    const loadNextRiddle = useCallback(async () => {
        if (!sessionId) {
            // If no session, fall back to full reset
            resetGame();
            return;
        }

        try {
            setIsLoadingRiddle(true);
            setGameState('playing');
            setTimeRemaining(60); // Reset timer for new riddle

            setAgentLogs(prev => [...prev, '--- NEW TARGET ---']);
            setAgentLogs(prev => [...prev, 'Requesting next target intelligence...']);

            // Fetch the next riddle using existing session
            const riddleData = await getQuestion(sessionId);
            setRiddle(riddleData);
            setAgentLogs(prev => [...prev, 'Target acquired: [REDACTED]']);
            setAgentLogs(prev => [...prev, 'MISSION READY. AWAITING AGENT INPUT.']);
        } catch (error) {
            console.error('Failed to load next riddle:', error);
            setAgentLogs(prev => [...prev, `ERROR: ${error instanceof Error ? error.message : 'Failed to get next target'}`]);
            // Fall back to reset on error
            resetGame();
        } finally {
            setIsLoadingRiddle(false);
        }
    }, [sessionId]);

    if (gameState === 'success') {
        return <SuccessView resetGame={loadNextRiddle} />;
    }

    if (gameState === 'incorrect') {
        return <IncorrectView resetGame={resetGame} />;
    }

    return (
        <>
            <PlayView
                handleSend={handleSend}
                timeRemaining={timeRemaining}
                isGameStarted={isGameStarted}
                onStartGame={handleStartGame}
                riddle={riddle}
                agentLogs={agentLogs}
                isLoadingRiddle={isLoadingRiddle}
            />
            {gameState === 'fail' && (
                <FailView resetGame={resetGame} cityName={riddle?.answer} />
            )}
        </>
    );
};

export default Battlespace;
