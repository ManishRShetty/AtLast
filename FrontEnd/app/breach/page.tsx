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
        <div className="relative w-full h-[calc(100vh-60px)] overflow-hidden">
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

            {/* Full Background Image - Fixed to cover entire viewport including behind navbar */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat -mt-[60px]"
                style={{ backgroundImage: "url('/atlastbg.png')" }}
            />

            {/* Subtle Overlay for better contrast */}
            <div className="fixed inset-0 bg-black/20 -mt-[60px]" />

            {/* Login Status & Button */}
            <div className="absolute top-4 right-4 z-50">
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <span className="text-green-500 font-mono text-sm tracking-wider">
                            AGENT: {username?.toUpperCase()}
                        </span>
                        <button
                            onClick={logout}
                            className="text-red-500 text-xs hover:text-red-400 font-mono border border-red-500/50 px-2 py-1 rounded"
                        >
                            LOGOUT
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-green-900/40 border border-green-500/50 text-green-400 px-4 py-2 font-mono text-sm hover:bg-green-500/20 transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                    >
                        ACCESS TERMINAL
                    </button>
                )}
            </div>

            {/* Main Content - Centered */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">

                {/* Logo and Text Container */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex items-center gap-4 md:gap-6"
                >
                    {/* Alien Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
                    >
                        <Image
                            src="/logo.png"
                            alt="AtLast Logo"
                            width={180}
                            height={220}
                            className="w-32 h-40 md:w-44 md:h-56 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                            priority
                        />
                    </motion.div>

                    {/* Text Logo - ATLAST */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Image
                            src="/Text.png"
                            alt="ATLAST"
                            width={400}
                            height={100}
                            className="w-64 md:w-96 h-auto object-contain"
                            priority
                        />
                    </motion.div>
                </motion.div>

                {/* Start Game Button */}
                <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartGame}
                    className="mt-8 md:mt-12 relative group"
                >
                    {/* Button Background - Skewed Red Rectangle */}
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-red-600/40 blur-xl skew-x-[-8deg] group-hover:bg-red-500/50 transition-colors duration-300" />

                        {/* Main Button */}
                        <div className="relative bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-12 py-4 md:px-16 md:py-5 skew-x-[-8deg] shadow-lg shadow-red-900/50 group-hover:from-red-700 group-hover:via-red-600 group-hover:to-red-700 transition-all duration-300 border-t border-red-500/30">
                            {/* Button Text */}
                            <span
                                className="block text-white text-2xl md:text-3xl font-bold tracking-wider skew-x-[8deg] drop-shadow-lg"
                                style={{ fontFamily: "'Road Rage', cursive" }}
                            >
                                START GAME
                            </span>
                        </div>
                    </div>

                    {/* Dark Rectangle Below Button */}
                    <div className="mt-2 w-full h-3 bg-black/60 skew-x-[-8deg] border border-neutral-800/50" />
                </motion.button>
            </div>
        </div>
    );
};

export default BreachPage;
