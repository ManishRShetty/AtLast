'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AgentRegistrationModal from '@/components/AgentRegistrationModal';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/context/AuthContext';

const BreachPage = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { isAuthenticated, username, logout } = useAuth();

    const handleStartGame = () => {
        if (isAuthenticated) {
            // Skip registration if logged in
            setIsTransitioning(true);
            setTimeout(() => {
                router.push('/intro');
            }, 2000);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleModalComplete = (agentName: string, difficulty: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('atlast_agent_name', agentName);
            localStorage.setItem('atlast_difficulty', difficulty);
        }
        setIsTransitioning(true);
        setTimeout(() => {
            router.push('/intro');
        }, 2000);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black font-display text-white">
            {/* Modal */}
            <AgentRegistrationModal
                isOpen={isModalOpen}
                onComplete={handleModalComplete}
                onCancel={() => setIsModalOpen(false)}
            />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            {/* Transition Overlay (Fade to Black) */}
            <div className={`fixed inset-0 z-[100] bg-black pointer-events-none transition-opacity duration-1000 ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Full Background Image */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                style={{ backgroundImage: "url('/atlastbg.webp')" }}
            />

            {/* Vignette / Dark Overlay */}
            <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-0" />

            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 bg-gradient-to-b from-black/90 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Image
                            src="/logow.png"
                            alt="Icon"
                            width={28}
                            height={28}
                            className="w-7 h-auto object-contain brightness-200"
                        />
                    </div>
                    <span className="text-white font-bold tracking-[0.15em] text-lg uppercase font-display drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                        ATLAST: PROTOCOL OMEGA
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    {isAuthenticated && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 font-mono text-xs tracking-wider">
                                <span className="text-slate-500">AGENT:</span>
                                <span className="text-emerald-500 font-bold">{username?.toUpperCase()}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/50 hover:border-cyan-400/60 text-cyan-400 text-[10px] px-3 py-1 font-bold tracking-widest transition-all uppercase rounded-sm backdrop-blur-sm"
                            >
                                LOGOUT
                            </button>
                        </div>
                    )}                </div>
            </header>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">

                {/* Logo and Text Group */}
                <div className="flex items-center gap-2 md:gap-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Image
                            src="/logo.webp"
                            alt="Alien Logo"
                            width={180}
                            height={180}
                            className="w-32 md:w-44 h-auto object-contain drop-shadow-[0_0_25px_rgba(0,255,255,0.5)]"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Image
                            src="/text.webp"
                            alt="ATLAST"
                            width={450}
                            height={140}
                            className="w-72 md:w-96 h-auto drop-shadow-[0_0_15px_rgba(0,255,255,0.3)] contrast-125"
                        />
                    </motion.div>
                </div>

                {/* Buttons Container */}
                <div className="flex flex-col md:flex-row items-center gap-8 mt-16">

                    {/* Enter as Rogue Button (Guest) */}
                    <div className="relative group flex flex-col items-center gap-3">
                        <motion.button
                            onClick={handleStartGame}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative z-10"
                        >
                            {/* Button Shape */}
                            <div
                                className="bg-emerald-900/20 md:w-64 w-56 h-12 md:h-14 flex items-center justify-center relative backdrop-blur-sm border border-emerald-500/30 group-hover:border-emerald-500/80 transition-colors"
                                style={{
                                    clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)'
                                }}
                            >
                                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>

                                <span className="relative z-10 text-emerald-400 font-display font-bold text-lg tracking-widest uppercase group-hover:text-emerald-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    {isAuthenticated ? 'ENTER' : 'ENTER AS ROGUE'}
                                </span>
                            </div>
                        </motion.button>

                        {/* Hover Annotation */}
                        <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-center pointer-events-none">
                            <p className="text-[10px] text-emerald-500/70 font-mono tracking-widest uppercase bg-black/80 px-2 py-1 border-x border-emerald-500/30">
                                // NO SAVE DATA RECORDED
                            </p>
                        </div>
                    </div>

                    {/* Authenticate Button (Login) */}
                    {!isAuthenticated && (
                        <div className="relative group flex flex-col items-center gap-3">
                            <motion.button
                                onClick={() => setIsLoginModalOpen(true)}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative z-10"
                            >
                                {/* Button Shape */}
                                <div
                                    className="bg-cyan-900/20 md:w-64 w-56 h-12 md:h-14 flex items-center justify-center relative backdrop-blur-sm border border-cyan-500/30 group-hover:border-cyan-500/80 transition-colors"
                                    style={{
                                        clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>

                                    <span className="relative z-10 text-cyan-400 font-display font-bold text-lg tracking-widest uppercase group-hover:text-cyan-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                        AUTHENTICATE
                                    </span>
                                </div>
                            </motion.button>
                            {/* Hover Annotation */}
                            <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-center pointer-events-none">
                                <p className="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase bg-black/80 px-2 py-1 border-x border-cyan-500/30">
                                    // SAVE PROGRESS & STATS
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* HUD Elements */}
            <div className="absolute top-24 right-12 hidden md:flex flex-col items-end opacity-70">
                <div className="flex items-center gap-3 text-emerald-500/60 font-mono text-[10px] tracking-wider uppercase">
                    <span>Repelling</span>
                    <span>10:35</span>
                    <span>[ DEMO-0-SPECIAL ]</span>
                </div>
                <div className="h-px w-full bg-emerald-500/20 mt-1"></div>
            </div>

            {/* Honeycomb pattern decor */}
            <div className="absolute top-10 right-10 w-48 h-48 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, transparent 20%, #000 20%, #000 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #000 20%, #000 80%, transparent 80%, transparent) ',
                    backgroundSize: '30px 30px',
                    backgroundPosition: '0 0, 15px 15px'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent clip-path-polygon" />
            </div>

            {/* Bottom Right Decoration */}
            <div className="absolute bottom-10 right-10">
                <div className="relative">
                    <div className="w-8 h-8 rotate-45 border border-white/50 bg-white/10 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/80 rotate-45 blur-[2px]"></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BreachPage;
