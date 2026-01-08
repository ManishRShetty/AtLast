'use client';

import React, { useState } from 'react';
import { User, ChevronRight, Laptop } from 'lucide-react';

interface AgentRegistrationModalProps {
    isOpen: boolean;
    onComplete: (agentName: string) => void;
    onCancel: () => void;
}

const AgentRegistrationModal: React.FC<AgentRegistrationModalProps> = ({ isOpen, onComplete, onCancel }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 2) {
            setError(true);
            return;
        }
        onComplete(name);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#111822] border border-[#324867] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-[#1a2332] p-4 border-b border-[#324867] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        <span className="text-xs font-bold text-white tracking-widest uppercase">Identity Verification</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="size-2 rounded-full bg-red-500/50"></div>
                        <div className="size-2 rounded-full bg-yellow-500/50"></div>
                        <div className="size-2 rounded-full bg-green-500/50"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col items-center gap-4 mb-6 text-center">
                        <div className="size-16 rounded-full bg-[#1a2332] border border-[#324867] flex items-center justify-center mb-2">
                            <Laptop size={32} className="text-[#92a9c9]" />
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">Identify Yourself</h3>
                        <p className="text-sm text-[#92a9c9] font-mono leading-relaxed">
                            Security Protocol Omega requires operator authentication before proceeding to the secure channel.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="space-y-1">
                            <label htmlFor="agentName" className="text-[10px] font-bold text-primary uppercase tracking-widest pl-1">
                                Agent Codename
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="agentName"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError(false);
                                    }}
                                    className="w-full bg-[#0b1016] border border-[#324867] text-white p-3 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono placeholder:text-slate-700"
                                    placeholder="ENTER_CODENAME"
                                    autoFocus
                                    autoComplete="off"
                                />
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-focus-within:scale-y-100 transition-transform origin-bottom"></div>
                            </div>
                            {error && (
                                <p className="text-[10px] text-red-500 font-mono mt-1 opacity-100 transition-opacity">
                                    * ERROR: CODENAME INVALID OR TOO SHORT
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-2 group relative w-full h-12 overflow-hidden rounded bg-primary hover:bg-primary/90 transition-all"
                        >
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-white tracking-widest uppercase gap-2 z-10">
                                <span>Confirm Identity</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            {/* Scanning effect */}
                            <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-in-out"></div>
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-[#0b1016] p-2 border-t border-[#324867] flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase">
                    <span>Secured by AES-256</span>
                    <span>v.2.0.4</span>
                </div>
            </div>
        </div>
    );
};

export default AgentRegistrationModal;
