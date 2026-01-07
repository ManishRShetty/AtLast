import React from 'react';
import { XCircle, ShieldAlert, Radar, Plus, Minus } from 'lucide-react';
import TerminalPanel from './TerminalPanel';

interface IncorrectViewProps {
    resetGame: () => void;
}

const IncorrectView: React.FC<IncorrectViewProps> = ({ resetGame }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex flex-col relative">
            {/* Effects */}
            <div className="absolute inset-0 pointer-events-none z-[60] shadow-[inset_0_0_150px_rgba(220,38,38,0.3)] border-4 border-red-500/50 animate-pulse"></div>
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-10 bg-[url('/carbon-fibre.png')]"></div>
            <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-500/80 to-transparent z-50 animate-pulse"></div>

            {/* Status Overlay */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center z-40 pointer-events-none">
                <div className="flex items-center gap-2 bg-red-500/10 px-4 py-1 rounded-full border border-red-500">
                    <XCircle size={14} className="text-red-500 animate-pulse-fast" />
                    <span className="text-red-500 text-xs font-bold tracking-widest">BREACH DETECTED</span>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Aside */}
                <TerminalPanel logs={[
                    { id: '1', type: 'system', text: 'Login successful. User ID: 994-Alpha.' },
                    { id: '2', type: 'command', text: 'verify_target --id="OPT-C"' },
                    { id: 'err1', type: 'error', text: 'VERIFYING HASH... FAILED.' },
                    { id: 'err2', type: 'error', text: 'CRITICAL ERROR: TARGET MISMATCH DETECTED.' },
                    { id: 'err3', type: 'error', text: 'GEOLOCATION SIGNATURE DOES NOT MATCH DECRYPTED STREAM.' },
                    { id: 'err4', type: 'error', text: 'INITIATING PENALTY PROTOCOL...' },
                    { id: 'err5', type: 'error', text: 'PENALTY APPLIED: -10 SECONDS' },
                    { id: 'err6', type: 'error', text: 'SYSTEM LOCKDOWN IMMINENT.' }
                ]} />

                {/* Section */}
                <section className="flex-1 relative bg-background-dark flex flex-col overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 via-red-500/10 to-red-500/30 z-10 pointer-events-none mix-blend-overlay"></div>
                        {/* <div className="absolute inset-0 bg-danger-pattern z-10 opacity-10 pointer-events-none"></div> */}
                        {/* Simplified danger pattern for now */}
                        <img alt="Dark satellite view of Earth from space showing city lights and continents" className="w-full h-full object-cover grayscale contrast-125 brightness-50" src="/bg-earth.jpg" />
                    </div>
                    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                        <div className="relative bg-black/90 border border-red-500 p-10 rounded-lg text-center shadow-[0_0_100px_rgba(239,68,68,0.4)] backdrop-blur-xl max-w-lg w-full transform scale-100">
                            <div className="absolute inset-x-0 top-2 h-[1px] bg-red-500/50"></div>
                            <div className="absolute inset-x-0 bottom-2 h-[1px] bg-red-500/50"></div>
                            <ShieldAlert size={72} className="text-red-500 mb-4 animate-pulse mx-auto" />
                            <h1 className="text-5xl font-bold font-mono text-red-500 mb-2 tracking-tighter glitch-text">ERROR</h1>
                            <h2 className="text-2xl font-bold text-white tracking-[0.2em] mb-4">TARGET MISMATCH</h2>
                            <div className="bg-red-500/20 border border-red-500/50 p-2 text-red-200 font-mono text-sm inline-block rounded mb-4">
                                ERR_CODE: GEO_INVALID_0x99
                            </div>
                            <p className="text-slate-400 text-sm uppercase tracking-widest">Protocol Omega Failed. Resetting Coords.</p>
                            <button onClick={resetGame} className="mt-6 pointer-events-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-widest transition-colors">
                                Try Again
                            </button>
                        </div>
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col pointer-events-none">
                        <div className="px-8 py-6 flex justify-between items-start opacity-50 grayscale">
                            <div className="bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg p-3">
                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Target Region</div>
                                <div className="text-xl font-bold text-white flex items-center gap-2">
                                    <Radar size={24} className="text-slate-500" />
                                    LATAM SECTOR 4
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <Plus size={24} />
                                </button>
                                <button className="size-10 bg-background-dark/80 backdrop-blur-md border border-[#233348] rounded-lg text-white flex items-center justify-center">
                                    <Minus size={24} />
                                </button>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <style jsx global>{`
                .terminal-cursor {
                    display: inline-block; width: 10px; height: 1.2em; background-color: #ef4444; animation: blink 0.5s step-end infinite; vertical-align: text-bottom;
                }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                .animate-pulse-fast { animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .glitch-text { text-shadow: 2px 0 #ef4444, -2px 0 #136dec; }
            `}</style>
        </div>
    );
};

export default IncorrectView;
