import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { User, Zap, Lock } from 'lucide-react';
import useSound from 'use-sound';

// Using consistent high-quality UI sounds
const SFX = {
    CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Affirmative click
};

const Login: React.FC = () => {
    const setTeamName = useGameStore((state) => state.setTeamName);
    const setPhase = useGameStore((state) => state.setPhase);
    const competitionAccessEnabled = useGameStore((state) => state.competitionAccessEnabled);
    const unlockReact = useGameStore((state) => state.unlockReact); // Updated to unlockReact

    const [name, setName] = useState('');
    const [playClick] = useSound(SFX.CLICK, { volume: 0.5 });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const upperName = name.trim().toUpperCase();

        // 1. Validation
        if (!upperName) return;

        // Check for Banned Users
        const banned = JSON.parse(localStorage.getItem('banned_users') || '[]');
        if (banned.includes(upperName)) {
            alert("ACCESS DENIED: ACCOUNT TERMINATED DUE TO VIOLATION.");
            playClick();
            return;
        }

        playClick();

        // Cheat Code
        if (upperName === 'NEO') {
            unlockReact();
        }

        setTeamName(upperName); // Use the formatted name
        setPhase('dashboard');
    };

    return (
        <div className="relative w-full h-screen flex items-center justify-center backdrop-blur-sm p-4 overflow-y-auto">

            {/* Hex Tech Background Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[80vw] h-[80vh] border border-cyan-500/20 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-cyan-500 rounded-tl-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-cyan-500 rounded-br-3xl"></div>
                </div>
            </div>

            {/* Competition Access Gate */}
            {!competitionAccessEnabled ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="z-10 flex flex-col items-center w-full max-w-2xl my-auto"
                >
                    <div className="bg-black/60 border-2 border-red-500/50 rounded-xl p-12 text-center backdrop-blur-md shadow-[0_0_50px_rgba(255,0,0,0.3)]">
                        <div className="mb-6">
                            <div className="inline-block p-6 bg-red-900/30 rounded-full mb-4">
                                <Lock size={64} className="text-red-500" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-display text-red-500 mb-4 tracking-widest">
                            COMPETITION NOT STARTED
                        </h1>
                        <p className="text-gray-300 font-mono text-lg mb-6">
                            The competition has not been initiated yet.
                        </p>
                        <p className="text-gray-500 text-sm font-mono">
                            Please wait for the administrator to start the event.
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-500 text-xs font-mono">STANDBY MODE</span>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="z-10 w-full max-w-4xl my-auto"
                >
                    <div className="max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-transparent px-4">
                        {/* Compact Logo Section */}
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Compact Alert Banner */}
                                <motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4 p-3 bg-gradient-to-r from-red-900/40 via-orange-900/40 to-red-900/40 border border-red-500/50 rounded-lg backdrop-blur-md relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent animate-pulse"></div>
                                    <div className="relative z-10 flex items-center justify-center gap-2 mb-1">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ff0000]"
                                        ></motion.div>
                                        <span className="text-red-500 font-mono text-xs tracking-wider font-bold">⚠️ SYSTEM CRITICAL FAILURE</span>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                            className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ff0000]"
                                        ></motion.div>
                                    </div>
                                    <p className="text-gray-300 text-xs font-mono">
                                        Elite teams needed to <span className="text-cyan-400 font-bold">DEBUG</span> and restore operations
                                    </p>
                                </motion.div>

                                {/* Logo */}
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                    className="relative"
                                >
                                    <h1 className="text-5xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2 tracking-wider drop-shadow-[0_0_20px_rgba(0,243,255,0.6)]">
                                        MIND BUZZER
                                    </h1>
                                    <motion.div
                                        animate={{
                                            textShadow: [
                                                "0 0 10px #ff003c",
                                                "0 0 20px #ff003c",
                                                "0 0 10px #ff003c"
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-2xl font-bold text-neon-pink tracking-[0.4em] mb-3"
                                    >
                                        2K26
                                    </motion.div>

                                    {/* Animated Corner Brackets */}
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-cyan-500 shadow-[0_0_8px_#00f0ff]"
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                        className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-purple-500 shadow-[0_0_8px_#7000ff]"
                                    />
                                </motion.div>

                                {/* Mission Badge */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/50 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.2)] relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    <span className="text-cyan-400 font-mono text-sm tracking-widest font-bold relative z-10">
                                        CODE RESCUE MISSION
                                    </span>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Two Column Layout for Objectives and Login */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            {/* Mission Objectives - Compact */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="p-4 bg-black/60 border border-cyan-500/30 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.1)] relative overflow-hidden"
                            >
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}></div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-cyan-400 font-mono text-xs mb-3 tracking-wider font-bold flex items-center gap-2">
                                        <span>📋</span> OBJECTIVES
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2 p-2 bg-green-900/20 border border-green-500/30 rounded-lg">
                                            <span className="text-green-500 text-lg">✓</span>
                                            <div>
                                                <p className="text-white font-bold text-sm">ROUND 1</p>
                                                <p className="text-gray-400 text-xs font-mono">Logic Legends</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2 p-2 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                                            <span className="text-purple-500 text-lg">⚡</span>
                                            <div>
                                                <p className="text-white font-bold text-sm">ROUND 2</p>
                                                <p className="text-gray-400 text-xs font-mono">React Rescue</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                                        <p className="text-yellow-400 text-xs font-mono flex items-center gap-1">
                                            <span>⚠️</span>
                                            Only <span className="font-bold">TOP TEAMS</span> advance
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Login Card - Compact */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="p-6 bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 border-2 border-gray-700 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-500"
                            >
                                {/* Animated particles */}
                                <div className="absolute inset-0 opacity-10">
                                    {[...Array(10)].map((_, i) => (
                                        <motion.div 
                                            key={i}
                                            className="absolute w-1 h-1 bg-cyan-500 rounded-full"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                            }}
                                            animate={{
                                                y: [0, -15, 0],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 shadow-[0_0_8px_#00f0ff]"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 shadow-[0_0_8px_#00f0ff]"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 shadow-[0_0_8px_#00f0ff]"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 shadow-[0_0_8px_#00f0ff]"></div>

                                <form onSubmit={handleLogin} className="space-y-4 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-cyan-400 font-mono text-xs uppercase tracking-wider pl-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_5px_#00f0ff]"></span>
                                            Team Protocol
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-all duration-300" size={18} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="ENTER TEAM NAME..."
                                                className="w-full bg-gray-900/70 border-2 border-gray-700 text-white pl-11 pr-4 py-3 rounded-lg outline-none focus:border-cyan-500 focus:bg-gray-900/90 focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300 font-mono text-base placeholder:text-gray-700"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-900/30 via-cyan-800/30 to-cyan-900/30 border-2 border-cyan-500/50 text-cyan-400 py-3 rounded-lg font-bold tracking-widest hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                                            <Zap size={18} className="group-hover:animate-pulse" />
                                            INITIALIZE SEQUENCE
                                            <Zap size={18} className="group-hover:animate-pulse" />
                                        </span>
                                    </motion.button>
                                </form>
                            </motion.div>
                        </div>

                        {/* Footer Status - Compact */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap justify-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-wider pb-4"
                        >
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#0f0]"></span>
                                Server: <span className="text-green-500 font-bold">Online</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#0f0]"></span>
                                Secure: <span className="text-green-500 font-bold">True</span>
                            </span>
                            <button
                                onClick={() => {
                                    const promptCode = prompt("SECURITY CLEARANCE CODE:");
                                    if (promptCode === 'ADMIN') {
                                        alert("ACCESS GRANTED.\nPress 'Ctrl + Shift + X' whenever you need to open the panel.");
                                        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'X', ctrlKey: true, shiftKey: true }));
                                    }
                                }}
                                className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
                            >
                                <span className="text-xs">🔐</span>
                                [ ADMIN ]
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Hidden Admin Trigger */}
            <div
                className="fixed bottom-0 right-0 w-10 h-10 z-[100]"
                onDoubleClick={() => {
                    const promptCode = prompt("ADMIN CODE:");
                    if (promptCode === 'ADMIN') {
                        alert("Use Ctrl + Shift + X to toggle the full panel.");
                    }
                }}
            />
        </div>
    );
};

export default Login;
