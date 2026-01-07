import React from 'react';
import { Terminal } from 'lucide-react';

const TerminalPanel = () => {
    return (
        <aside className="w-[30%] min-w-[350px] max-w-[500px] flex flex-col border-r border-[#233348] bg-terminal-bg relative z-10 shadow-2xl">
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
                <div className="opacity-50 mb-4 text-xs">Login successful. User ID: 994-Alpha.</div>
                <div className="mb-2">
                    <span className="text-primary font-bold">root@omega:~$</span> initiate_protocol --force
                </div>
                <div className="mb-4 text-emerald-500">
                    &gt; Establishing secure connection...<br />
                    &gt; Encrypted packet received.<br />
                    &gt; Brute-forcing SHA-256 signatures...
                </div>
                <div className="mb-4 pl-2 border-l-2 border-primary/30">
                    <span className="text-xs uppercase text-slate-500 mb-1 block">Intercepted Transmission</span>
                    <p className="text-white">"Target is located in the Southern Hemisphere. Prepare for immediate extraction upon coordinate verification."</p>
                </div>
                <div className="mb-4 text-yellow-500">
                    &gt; WARNING: Trace attempt detected.<br />
                    &gt; Rerouting via proxy: Singapore... Done.<br />
                    &gt; Rerouting via proxy: Helsinki... Done.
                </div>
                <div className="mb-2">
                    <span className="text-primary font-bold">root@omega:~$</span> decrypt_target_list
                </div>
                <div className="text-emerald-500">
                    &gt; Match found.<br />
                    &gt; Decrypting riddle package...<br />
                    &gt; <span className="text-white">Outputting to Main Visualizer.</span><span className="terminal-cursor"></span>
                </div>
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
