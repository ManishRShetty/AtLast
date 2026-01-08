'use client';

import { useEffect, useRef } from 'react';

const SoundEffects = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio('/audio/click.mp3');
        audioRef.current.volume = 0.3; // Subtle volume

        const playClick = () => {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {
                    // Ignore autoplay errors
                });
            }
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if element or any parent is interactive
            const interactive = target.closest('button, a, [role="button"], input, select, textarea');

            if (interactive) {
                playClick();
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return null;
};

export default SoundEffects;
