'use client';

import { useEffect, useRef } from 'react';

const SoundEffects = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const heartbeatRef = useRef<HTMLAudioElement | null>(null);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        // Initialize click audio
        audioRef.current = new Audio('/audio/click.mp3');
        audioRef.current.volume = 0.3;

        // Initialize heartbeat audio
        heartbeatRef.current = new Audio('/audio/heartbeat.mp3');
        heartbeatRef.current.loop = true;
        heartbeatRef.current.volume = 0.15; // Low ambient volume

        const playClick = () => {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => { });
            }
        };

        const tryStartHeartbeat = () => {
            if (heartbeatRef.current && !hasStartedRef.current) {
                heartbeatRef.current.play().then(() => {
                    hasStartedRef.current = true;
                }).catch(() => {
                    // Waiting for interaction
                });
            }
        };

        // Try auto-start
        tryStartHeartbeat();

        const handleClick = (e: MouseEvent) => {
            // Ensure heartbeat is playing on first interaction
            if (!hasStartedRef.current) {
                tryStartHeartbeat();
            }

            const target = e.target as HTMLElement;
            // Check if element or any parent is interactive
            const interactive = target.closest('button, a, [role="button"], input, select, textarea, .interactive');

            if (interactive) {
                playClick();
            }
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('keydown', () => {
            if (!hasStartedRef.current) tryStartHeartbeat();
        });

        return () => {
            window.removeEventListener('click', handleClick);
            if (heartbeatRef.current) {
                heartbeatRef.current.pause();
                heartbeatRef.current = null;
            }
        };
    }, []);

    return null;
};

export default SoundEffects;
