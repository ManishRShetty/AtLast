import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Shield, Activity, Lock, ShieldAlert } from 'lucide-react';

export type LogType = 'command' | 'info' | 'success' | 'warning' | 'error' | 'system';

export interface LogEntry {
    id: string;
    text?: string;
    component?: React.ReactNode;
    type: LogType;
    typingDelay?: number; // ms to wait before typing next char
}

const Typewriter = ({ text, delay = 10, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');
    const index = useRef(0);

    useEffect(() => {
        // Reset if text changes
        setDisplayedText('');
        index.current = 0;

        const interval = setInterval(() => {
            if (index.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index.current));
                index.current++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, delay);
        return () => clearInterval(interval);
    }, [text, delay, onComplete]);

    return <span>{displayedText}</span>;
};

interface TerminalPanelProps {
    logs: LogEntry[];
    className?: string; // Allow custom classNames for positioning/size overrides if needed
    variant?: 'sidebar' | 'standalone';
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ logs, className, variant = 'sidebar' }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const baseClasses = "flex flex-col relative z-10 box-border overflow-hidden";
    const sidebarClasses = "w-full h-full bg-[#05080a]/95"; // Integrated sidebar style
    const standaloneClasses = "w-full h-full border border-neon-cyan/20 rounded-xl bg-[#0B1016]/95 backdrop-blur-md";

    const variantClasses = variant === 'sidebar' ? sidebarClasses : standaloneClasses;

    return (
        <aside className={`${baseClasses} ${variantClasses} ${className || ''}`}>

            {/* Header / Status Bar */}
            <div className="relative z-10 px-5 py-4 border-b border-[#233348] flex justify-between items-center bg-[#080c11]">
                {/* Neon Top Line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"></div>

                <div className="flex items-center gap-3">
                    <div className="bg-neon-cyan/10 p-1.5 rounded border border-neon-cyan/30">
                        <Terminal size={14} className="text-neon-cyan" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-[10px] font-bold tracking-[0.2em] text-neon-cyan uppercase flex items-center gap-2">
                            Decryption Stream
                            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-blink"></span>
                        </h3>
                        <span className="text-[8px] text-slate-500 font-mono tracking-widest">SECURE CHANNEL // OMEGA-7</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Activity size={14} className="text-slate-600 animate-pulse" />
                    <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-neon-cyan opacity-80"></div>
                        <div className="w-1 h-3 bg-neon-cyan opacity-60"></div>
                        <div className="w-1 h-3 bg-neon-cyan opacity-40"></div>
                        <div className="w-1 h-3 bg-slate-800"></div>
                    </div>
                </div>
            </div>

            {/* Log Area */}
            <div className="flex-1 p-5 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 relative scrollbar-hide">
                {/* Background Details */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[size:100%_4px] bg-[linear-gradient(to_bottom,black_50%,transparent_50%)] z-0"></div>

                <div className="relative z-10 space-y-3">
                    {logs.map((log) => (
                        <div key={log.id} className={`break-words ${log.type === 'error' ? 'animate-shake' : ''}`}>
                            {log.type === 'command' && (
                                <div className="text-white flex gap-2 items-start group">
                                    <span className="text-neon-cyan font-bold select-none opacity-50 text-xs mt-0.5">➜</span>
                                    <span className="text-slate-100 font-bold tracking-wide">
                                        <Typewriter text={log.text || ''} delay={15} />
                                    </span>
                                </div>
                            )}
                            {log.type === 'system' && (
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-5 border-l border-slate-700 ml-1">
                                    {log.text}
                                </div>
                            )}
                            {log.type === 'info' && !log.component && (
                                <div className="text-emerald-400/90 pl-5">
                                    <Typewriter text={log.text || ''} delay={5} />
                                </div>
                            )}
                            {log.type === 'warning' && (
                                <div className="text-yellow-500 pl-5 flex items-center gap-2">
                                    <span className="text-[9px] bg-yellow-500/10 border border-yellow-500/30 px-1 rounded uppercase tracking items-center flex">WARN</span>
                                    <span><Typewriter text={log.text || ''} delay={5} /></span>
                                </div>
                            )}
                            {log.type === 'error' && (
                                <div className="text-red-500 font-bold pl-5 flex items-center gap-2 bg-red-900/10 py-1 border-l-2 border-red-500">
                                    <ShieldAlert size={12} />
                                    <span><Typewriter text={log.text || ''} delay={5} /></span>
                                </div>
                            )}
                            {log.type === 'success' && (
                                <div className="text-neon-cyan pl-5 border-l border-neon-cyan/50 flex items-center gap-2">
                                    <Shield size={12} />
                                    <Typewriter text={log.text || ''} delay={5} />
                                </div>
                            )}
                            {/* Component support */}
                            {log.component}
                        </div>
                    ))}

                    {/* Active Cursor */}
                    <div className="mt-4 flex items-center gap-2 pl-1 animate-pulse text-neon-cyan/50">
                        <span className="text-xs">_</span>
                    </div>

                    <div ref={bottomRef} className="h-4" />
                </div>
            </div>

            {/* Footer / Status */}
            <div className="p-2 border-t border-[#233348] bg-[#080c11] text-[10px] text-slate-600 font-mono flex justify-between uppercase tracking-widest relative z-10">
                <span className="flex items-center gap-1.5"><Lock size={8} /> Encrypted</span>
                <span>Latency: 14ms</span>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </aside>
    );
};

export default TerminalPanel;
