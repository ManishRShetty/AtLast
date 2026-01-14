import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
            setError(isLogin ? 'Login failed. Check credentials.' : 'Registration failed. User may exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black border-2 border-green-500/50 p-8 w-full max-w-md relative shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-green-500/50 hover:text-green-400 transition-colors"
                >
                    ✕ ABORT
                </button>

                <h2 className="text-2xl font-mono text-green-400 mb-6 tracking-wider text-center border-b border-green-500/30 pb-4">
                    {isLogin ? 'ACCESS REQUEST' : 'NEW AGENT REGISTRATION'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-green-500/70 mb-2 uppercase">Ident</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/50 border border-green-500/30 text-green-400 px-4 py-3 font-mono focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-all placeholder-green-900"
                            placeholder="CODENAME"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-green-500/70 mb-2 uppercase">Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-green-500/30 text-green-400 px-4 py-3 font-mono focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-all placeholder-green-900"
                            placeholder="******"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-2 font-mono text-sm">
                            ⚠ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-900/30 hover:bg-green-500/20 border border-green-500 text-green-400 py-3 font-mono tracking-widest transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50"
                    >
                        {loading ? 'PROCESSING...' : (isLogin ? 'INITIATE LINK' : 'REGISTER AGENT')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs font-mono text-green-500/50 hover:text-green-400 underline decoration-green-500/30 underline-offset-4"
                    >
                        {isLogin ? 'NO CREDENTIALS? REGISTER HERE' : 'EXISTING AGENT? LOGIN HERE'}
                    </button>
                </div>
            </div>
        </div>
    );
}
