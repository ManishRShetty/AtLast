'use client';

import React, { useEffect, useRef } from 'react';
import { LogMessage } from '../types';
import { motion } from 'framer-motion';

interface TerminalProps {
  logs: LogMessage[];
  isDark: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, isDark }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className={`flex flex-col h-full rounded-2xl backdrop-blur-xl shadow-2xl border overflow-hidden ${isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-white/60 border-black/5'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-3 border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Live Intelligence</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400/80"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400/80"></div>
          <div className="w-2 h-2 rounded-full bg-green-400/80"></div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar font-mono text-xs space-y-3">
        {logs.length === 0 && (
          <div className="flex h-full items-center justify-center opacity-30">
            <span className={isDark ? 'text-white' : 'text-black'}>No active signals...</span>
          </div>
        )}
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg border ${log.sender === 'SYSTEM'
                ? (isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-200' : 'bg-blue-50 border-blue-100 text-blue-800')
                : log.type === 'error'
                  ? (isDark ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-red-50 border-red-100 text-red-800')
                  : log.type === 'success'
                    ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' : 'bg-emerald-50 border-emerald-100 text-emerald-800')
                    : (isDark ? 'bg-white/5 border-white/5 text-zinc-300' : 'bg-white/40 border-white/20 text-zinc-700')
              }`}
          >
            <div className="flex justify-between items-center mb-1 opacity-60 text-[10px] uppercase font-bold">
              <span>{log.sender}</span>
              <span>{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className="leading-relaxed">
              {log.message}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};