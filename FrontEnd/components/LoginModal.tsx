import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, ChevronRight, Info } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await login({ username, password });
            } else {
                await register({ username, password });
            }
            onClose();
        } catch (err) {
            setError(isLogin ? 'AUTH FAILURE // INVALID CREDENTIALS' : 'REG FAILURE // USER EXISTS');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center font-display">
                    {/* Layer 1: Background & Overlay (Same as Registration) */}
                    <div className="fixed inset-0 bg-black">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
                            style={{ backgroundImage: "url('/atlastbg.webp')" }}
                        />
                        <div
                            className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: `linear-gradient(to right, rgba(0, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.3) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-lg p-4"
                    >
                        <div className="relative bg-[#050a10]/90 border border-cyan-900/50 backdrop-blur-xl shadow-[0_0_50px_rgba(0,255,255,0.1)] overflow-hidden">
                            {/* Decorative Corner Markers */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-cyan-500/50 hover:text-cyan-400 transition-colors font-mono text-xs tracking-widest z-20"
                            >
                                [ ABORT ]
                            </button>

                            {/* Header */}
                            <div className="py-8 px-8 text-center border-b border-cyan-900/30 relative">
                                <h2 className="text-white text-3xl font-bold tracking-[0.2em] drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] uppercase">
                                    {isLogin ? 'System Access' : 'New Protocol'}
                                </h2>
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                            </div>

                            {/* Form */}
                            <div className="p-8 md:p-10">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <div className="relative group">
                                        <div className="absolute -top-3 left-4 bg-[#050a10] px-2 text-xs font-mono text-cyan-500 tracking-widest uppercase z-10">
                                            Ident
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-[#0a1520]/80 border border-cyan-900/50 text-white text-lg py-4 px-6 focus:outline-none focus:border-cyan-400 placeholder-slate-700 tracking-[0.1em] font-mono transition-all clip-path-input focus:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                                            placeholder="CODENAME"
                                            required
                                            autoComplete="username"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute -top-3 left-4 bg-[#050a10] px-2 text-xs font-mono text-cyan-500 tracking-widest uppercase z-10">
                                            Key
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-[#0a1520]/80 border border-cyan-900/50 text-white text-lg py-4 px-6 focus:outline-none focus:border-cyan-400 placeholder-slate-700 tracking-[0.1em] font-mono transition-all clip-path-input focus:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                                            placeholder="******"
                                            required
                                            autoComplete="current-password"
                                        />
                                    </div>

                                    {error && (
                                        <div className="bg-red-950/30 border border-red-500/30 text-red-500 px-4 py-2 font-mono text-xs flex items-center gap-2 animate-shake">
                                            <TriangleAlert size={14} />
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-center pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div
                                                className="relative bg-cyan-950/40 border border-cyan-500/50 px-16 py-4 overflow-hidden group-hover:border-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                                style={{ transform: 'skew(-12deg)' }}
                                            >
                                                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                                <div className="absolute inset-0 bg-cyan-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                                                <span
                                                    className="flex items-center gap-3 text-cyan-400 text-lg font-bold tracking-widest group-hover:text-white transition-colors relative z-10 group-hover:animate-glitch"
                                                    style={{ transform: 'skew(12deg)' }}
                                                >
                                                    {loading ? 'PROCESSING...' : (isLogin ? 'INITIATE CONNECTION' : 'REGISTER AGENT')}
                                                    {!loading && <ChevronRight size={20} />}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => {
                                            setIsLogin(!isLogin);
                                            setError(null);
                                        }}
                                        className="text-xs font-mono text-cyan-500/50 hover:text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto group transition-colors"
                                    >
                                        <Info size={12} className="group-hover:animate-pulse" />
                                        {isLogin ? 'NO CREDENTIALS? // REGISTER_NEW' : 'HAS CREDENTIALS? // LOGIN_EXISTING'}
                                    </button>
                                </div>
                            </div>

                            {/* Footer Decor */}
                            <div className="h-2 bg-[#0a1520] w-full border-t border-cyan-900/30 flex items-center justify-end px-4 gap-1">
                                <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                                <div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-cyan-500/30 rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
