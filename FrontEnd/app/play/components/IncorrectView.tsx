import React from 'react';
import { XCircle, ShieldAlert } from 'lucide-react';
import TerminalPanel, { LogEntry } from './TerminalPanel';

interface IncorrectViewProps {
    resetGame: () => void;
}

const IncorrectView: React.FC<IncorrectViewProps> = ({ resetGame }) => {

    // Mock error logs
    const logs: LogEntry[] = [
        { id: '1', type: 'system', text: 'Verifying input hash...' },
        { id: '2', type: 'error', text: 'HASH MISMATCH DETECTED.' },
        { id: '3', type: 'error', text: 'Target coordinates invalid.' },
        { id: '4', type: 'warning', text: 'Applying penalty protocol...' },
        { id: '5', type: 'error', text: '-10 SECONDS DEDUCTED.' },
        { id: '6', type: 'system', text: 'Awaiting corrective input.' }
    ];

    return (
        <div className="bg-deep-black text-white font-display overflow-hidden h-[calc(100vh-60px)] flex flex-col relative w-full">

            {/* Background Layers */}
            <div className="absolute inset-0 z-0 bg-deep-black">
                <div className="absolute inset-0 bg-[url('/atlastbg.webp')] opacity-20 bg-cover bg-center bg-no-repeat grayscale brightness-50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 via-transparent to-black/80"></div>
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.05)_1px,transparent_1px)]"></div>
            </div>

            {/* Red Alert Pulse */}
            <div className="absolute inset-0 pointer-events-none z-[15] shadow-[inset_0_0_150px_rgba(239,68,68,0.4)] animate-pulse"></div>

            <main className="flex-1 flex overflow-hidden relative z-20">
                {/* Left: Terminal Panel */}
                <div className="w-[350px] hidden md:flex flex-col border-r border-red-900/30 bg-black/80 backdrop-blur-md">
                    <TerminalPanel logs={logs} />
                </div>

                {/* Right: Error Content */}
                <section className="flex-1 relative flex flex-col items-center justify-center p-6 text-center">

                    <div className="bg-black/80 border border-red-500/50 p-10 max-w-xl w-full relative shadow-[0_0_60px_rgba(239,68,68,0.3)] backdrop-blur-xl transform skew-x-[-6deg]">

                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>

                        <div className="transform skew-x-[6deg] flex flex-col items-center gap-6">
                            <ShieldAlert size={64} className="text-red-500 animate-pulse" />

                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                                ACCESS <span className="text-red-500">DENIED</span>
                            </h1>

                            <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded text-red-200 font-mono text-sm tracking-widest">
                                ERROR_CODE: MISMATCH_0x99
                            </div>

                            <p className="text-slate-400 text-sm tracking-wide uppercase">
                                Target verification failed. Time penalty applied.
                            </p>

                            <button
                                onClick={resetGame}
                                className="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
                            >
                                Retry Connection
                            </button>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
};

export default IncorrectView;
