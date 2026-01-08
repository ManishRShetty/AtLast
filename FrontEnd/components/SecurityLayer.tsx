'use client';

import { useEffect, useState } from 'react';
import { Skull } from 'lucide-react';

const SecurityLayer = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setCoords({ x: e.clientX, y: e.clientY });
            setShowWarning(true);

            // Auto hide after animation
            const timer = setTimeout(() => {
                setShowWarning(false);
            }, 2000);

            return () => clearTimeout(timer);
        };

        // const handleKeyDown = (e: KeyboardEvent) => {
        //     // Prevent some common debug shortcuts if desired, mainly just right click requested though.
        //     // Keeping it simple to just right click as requested.
        // };

        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    if (!showWarning) return null;

    return (
        <div
            className="fixed z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-200"
            style={{
                left: Math.min(coords.x, window.innerWidth - 320), // Prevent going offscreen right
                top: Math.min(coords.y, window.innerHeight - 100) // Prevent going offscreen bottom
            }}
        >
            <div className="bg-black/95 border border-red-500/50 rounded-lg p-4 shadow-[0_0_30px_rgba(220,38,38,0.4)] backdrop-blur-xl flex items-center gap-4 max-w-xs">
                <div className="bg-red-500/20 p-2 rounded-full animate-pulse">
                    <Skull className="text-red-500" size={20} />
                </div>
                <div>
                    <h3 className="text-red-500 font-bold font-mono text-xs tracking-widest uppercase mb-1">
                        Security Alert
                    </h3>
                    <p className="text-white/90 text-sm font-bold leading-tight">
                        Looking for 'Inspect Element'? <br />
                        <span className="text-red-400">You can't debug death.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SecurityLayer;
