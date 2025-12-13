import React, { useState, useEffect } from 'react';
import { CommandMap } from './components/CommandMap';
import { Terminal } from './components/Terminal';
import { MissionHUD } from './components/MissionHUD';
import { TARGETS, DEFAULT_MAPBOX_TOKEN } from './constants';
import { generateRiddle, streamAgentDebate } from './services/geminiService';
import { calculateDistance } from './utils/geo';
import { TargetLocation, GameState, LogMessage } from './types';
import { Moon, Sun, Play, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [currentTarget, setCurrentTarget] = useState<TargetLocation | null>(null);
  const [riddle, setRiddle] = useState<string>('');
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isDark, setIsDark] = useState(true);
  const [showMapTokenWarning, setShowMapTokenWarning] = useState(false);

  // Initialize & Theme Handling
  useEffect(() => {
    if (!DEFAULT_MAPBOX_TOKEN || DEFAULT_MAPBOX_TOKEN.includes('YOUR_TOKEN_HERE')) {
      setShowMapTokenWarning(true);
    }
    document.documentElement.classList.toggle('dark', isDark);
    
    if (gameState === 'IDLE') {
       addLog('SYSTEM', 'NetRunner OS v4.0 ready. Standing by.', 'info');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const addLog = (sender: string, message: string, type: 'info' | 'alert' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), sender, message, timestamp: new Date(), type }]);
  };

  const startGame = async () => {
    setGameState('SEARCHING');
    setScore(0);
    setLogs([]);
    addLog('SYSTEM', 'Initializing Global Search Protocol...', 'alert');

    const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    setCurrentTarget(target);

    try {
      addLog('NETWORK', 'Connecting to Oracle Intelligence...', 'info');
      
      const riddlePromise = generateRiddle(target.name);
      
      streamAgentDebate(target.name, (chunk) => {
        if (chunk.includes(':')) {
           const [agent, msg] = chunk.split(':');
           addLog(agent.trim(), msg.trim(), 'info');
        } else {
           addLog('INTERCEPT', chunk, 'info');
        }
      });

      const generatedRiddle = await riddlePromise;
      setRiddle(generatedRiddle);
      addLog('ORACLE', 'Target profile decrypted successfully.', 'success');
      
    } catch (error) {
      console.error(error);
      addLog('SYSTEM', 'Connection disrupted. Using fallback data.', 'error');
      setRiddle(`Target location unknown. Signal lost.`);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (gameState !== 'SEARCHING' || !currentTarget) return;

    const distance = calculateDistance(lat, lng, currentTarget.lat, currentTarget.lng);
    let points = 0;
    
    if (distance < 50) points = 1000;
    else if (distance < 200) points = 750;
    else if (distance < 500) points = 500;
    else if (distance < 1000) points = 250;
    else points = 50;

    setScore(points);
    setGameState('RESOLVED');

    addLog('SYSTEM', `Lock confirmed at ${lat.toFixed(2)}, ${lng.toFixed(2)}`, 'alert');
    addLog('SYSTEM', `Target delta: ${Math.floor(distance)}km`, distance < 500 ? 'success' : 'error');
  };

  return (
    <div className={`relative w-screen h-screen overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
      
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
         <CommandMap 
            onMapClick={handleMapClick} 
            interactive={gameState === 'SEARCHING'}
            targetLocation={gameState === 'RESOLVED' && currentTarget ? currentTarget : undefined}
            isDark={isDark}
         />
      </div>

      {/* Foreground UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col p-4 md:p-6 lg:p-8">
        
        {/* Top Header Bar */}
        <header className="flex justify-between items-center pointer-events-auto mb-6">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`flex items-center gap-4 px-6 py-3 rounded-full backdrop-blur-xl shadow-lg border ${isDark ? 'bg-zinc-900/60 border-white/10 text-white' : 'bg-white/70 border-black/5 text-zinc-800'}`}
          >
            <div className={`p-1.5 rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-500 text-white'}`}>
               <ShieldCheck size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">NETRUNNER</h1>
              <div className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Command Center
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4"
          >
            {/* Score Display */}
            <div className={`px-6 py-3 rounded-full backdrop-blur-xl shadow-lg border flex flex-col items-end min-w-[120px] ${isDark ? 'bg-zinc-900/60 border-white/10 text-white' : 'bg-white/70 border-black/5 text-zinc-800'}`}>
               <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Score</span>
               <span className="text-xl font-mono font-semibold tracking-tight">{score.toLocaleString()}</span>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-full backdrop-blur-xl shadow-lg border transition-all active:scale-95 ${isDark ? 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white/70 border-black/5 text-zinc-500 hover:text-zinc-900 hover:bg-white'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </motion.div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
          
          {/* Left Panel: Mission Brief */}
          <div className="w-full md:w-1/3 max-w-md pointer-events-auto flex flex-col justify-end md:justify-start">
             <AnimatePresence>
               {gameState !== 'IDLE' && (
                 <motion.div
                   initial={{ x: -50, opacity: 0, filter: "blur(10px)" }}
                   animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                   exit={{ x: -50, opacity: 0, filter: "blur(10px)" }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   className="h-full"
                 >
                   <MissionHUD riddle={riddle} status={gameState} isDark={isDark} />
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Center: Controls & Feedback */}
          <div className="flex-1 flex items-center justify-center pointer-events-auto">
            <AnimatePresence mode="wait">
              {gameState === 'IDLE' && (
                 <motion.button 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.9, opacity: 0 }}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={startGame}
                   className={`group relative px-10 py-5 rounded-2xl backdrop-blur-2xl shadow-2xl border transition-all flex items-center gap-4 ${isDark ? 'bg-white text-black border-transparent hover:bg-gray-200' : 'bg-zinc-900 text-white border-transparent hover:bg-zinc-800'}`}
                 >
                   <Play size={24} className="fill-current" />
                   <div className="text-left">
                     <div className="text-xs font-bold uppercase opacity-60">Ready</div>
                     <div className="text-lg font-bold">Start Mission</div>
                   </div>
                 </motion.button>
              )}
              
              {gameState === 'RESOLVED' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className={`p-8 rounded-3xl backdrop-blur-2xl shadow-2xl border text-center max-w-sm ${isDark ? 'bg-zinc-900/80 border-white/10 text-white' : 'bg-white/90 border-black/5 text-zinc-900'}`}
                >
                  <div className="text-sm uppercase font-bold opacity-50 mb-2">Mission Complete</div>
                  <h2 className="text-3xl font-bold mb-1">{score > 500 ? 'Target Secured' : 'Target Missed'}</h2>
                  <p className={`mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Actual location was <strong className={isDark ? 'text-white' : 'text-black'}>{currentTarget?.name}</strong>
                  </p>
                  <button 
                     onClick={startGame}
                     className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}
                   >
                     <RefreshCw size={18} />
                     Next Target
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel: Terminal Feed */}
          <div className="w-full md:w-1/3 max-w-md pointer-events-auto flex flex-col justify-end">
            <AnimatePresence>
              {(gameState === 'SEARCHING' || gameState === 'RESOLVED') && (
                <motion.div
                  initial={{ x: 50, opacity: 0, filter: "blur(10px)" }}
                  animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                  className="h-2/3 md:h-3/4"
                >
                  <Terminal logs={logs} isDark={isDark} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
      
      {/* Notifications */}
      <AnimatePresence>
        {showMapTokenWarning && (
          <motion.div 
            initial={{ y: -100 }} animate={{ y: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 z-50 pointer-events-none"
          >
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">Mapbox Token Missing - Visuals Limited</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}