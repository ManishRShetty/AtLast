'use client';

import React from 'react';
import { GameState } from '../types';
import { Target, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MissionHUDProps {
   riddle: string;
   status: GameState;
   isDark: boolean;
}

export const MissionHUD: React.FC<MissionHUDProps> = ({ riddle, status, isDark }) => {
   return (
      <div className={`flex flex-col rounded-2xl backdrop-blur-xl shadow-2xl border overflow-hidden ${isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-white/60 border-black/5'}`}>
         {/* Header */}
         <div className={`px-5 py-4 border-b flex items-center gap-3 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
               <Target size={16} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Mission Briefing</span>
         </div>

         <div className="p-6">
            <div className="relative">
               {status === 'SEARCHING' && !riddle ? (
                  <div className={`flex flex-col items-center justify-center py-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                     <Loader2 size={32} className="animate-spin mb-4 opacity-50" />
                     <p className="text-xs uppercase font-bold tracking-widest">Intercepting Data Stream...</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     <div>
                        <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                           Clue Decrypted
                        </h3>
                        <motion.div
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className={`text-sm md:text-base font-medium leading-relaxed ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}
                        >
                           "{riddle}"
                        </motion.div>
                     </div>

                     {status === 'SEARCHING' && (
                        <div className={`mt-4 pt-4 border-t flex items-center gap-2 text-xs font-medium ${isDark ? 'border-white/10 text-emerald-400' : 'border-black/5 text-emerald-600'}`}>
                           <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                           </span>
                           Live Satellite Tracking Active
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};