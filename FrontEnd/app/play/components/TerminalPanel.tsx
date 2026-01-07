import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';

export type LogType = 'command' | 'info' | 'success' | 'warning' | 'error' | 'system';

export interface LogEntry {
    id: string;
    text?: string;
    component?: React.ReactNode;
    type: LogType;
    typingDelay?: number; // ms to wait before typing next char
}

const Typewriter = ({ text, delay = 30, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');
    const index = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(index.current));
            index.current++;
            if (index.current >= text.length) {
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
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ logs, className }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <aside className={`w-[30%] min-w-[350px] max-w-[500px] flex flex-col border-r border-[#233348] bg-terminal-bg relative z-10 shadow-2xl ${className || ''}`}>
            <div className="px-5 py-3 border-b border-[#233348] flex justify-between items-center bg-[#0d1219]">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-primary" />
                    <h3 className="text-xs font-bold tracking-widest text-primary uppercase">Decryption Stream // OMEGA-7</h3>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
            </div>
            <div className="flex-1 p-5 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 bg-scanlines bg-[length:100%_4px]">
                {logs.map((log) => (
                    <div key={log.id} className="mb-2 break-words">
                        {log.type === 'command' && (
                            <div className="text-white">
                                <span className="text-primary font-bold mr-2">root@omega:~$</span>
                                <Typewriter text={log.text || ''} delay={30} />
                            </div>
                        )}
                        {log.type === 'system' && (
                            <div className="opacity-50 text-xs mb-4">{log.text}</div>
                        )}
                        {log.type === 'info' && !log.component && (
                            <div className="text-emerald-500">
                                <span className="mr-2">&gt;</span>
                                <Typewriter text={log.text || ''} delay={10} />
                            </div>
                        )}
                        {log.type === 'warning' && (
                            <div className="text-yellow-500">
                                <span className="mr-2">&gt;</span>
                                <Typewriter text={log.text || ''} delay={10} />
                            </div>
                        )}
                        {log.type === 'error' && (
                            <div className="text-red-500 font-bold">
                                <span className="mr-2">&gt;</span>
                                <Typewriter text={log.text || ''} delay={10} />
                            </div>
                        )}
                        {/* Support for custom component logs (no auto-typing for components, they handle themselves or just appear) */}
                        {log.component}
                    </div>
                ))}

                {/* Active cursor line */}
                <div className="mt-2 text-primary font-bold">
                    <span className="mr-2">root@omega:~$</span><span className="terminal-cursor"></span>
                </div>

                <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-[#233348] bg-[#0d1219]">
                <div className="flex items-center gap-2 bg-background-dark border border-[#233348] rounded px-3 py-2">
                    <span className="text-primary text-xs">&gt;</span>
                    <div className="h-4 w-32 bg-primary/20 rounded animate-pulse"></div>
                </div>
            </div>
        </aside>
    );
};

export default TerminalPanel;
