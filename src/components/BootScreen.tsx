import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameSounds } from '../hooks/useGameSounds';
import useSound from 'use-sound';

// A powerful dramatic boot sound
const BOOT_SFX = ''; // Disabled external link to prevent 403 errors

interface BootScreenProps {
    onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    const { playType } = useGameSounds();
    const [playBoot] = useSound(BOOT_SFX, { volume: 0.8 });

    useEffect(() => {
        playBoot();

        const bootSequence = [
            "BIOS DATE 02/09/2026 11:29:38 VER 2.6.0",
            "CPUID: 0XF2026... OK",
            "CHECKING MEMORY... 64GB OK",
            "LOADING KERNEL... SUCCESS",
            "INITIALIZING SECURITY PROTOCOLS...",
            "> ACCESSING SECURE SERVER...",
            "> CONNECTED.",
            "SYSTEM READY."
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < bootSequence.length) {
                setLines(prev => [...prev, bootSequence[index]]);
                playType();
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    onComplete();
                }, 1000);
            }
        }, 300);

        return () => clearInterval(interval);
    }, [onComplete, playType, playBoot]);

    return (
        <div className="fixed inset-0 bg-black text-green-500 font-mono z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer" onClick={onComplete}>
            {/* Click to skip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-8 right-8 px-4 py-2 border border-gray-800 text-gray-500 text-xs tracking-widest hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 rounded-lg backdrop-blur-sm"
            >
                [ CLICK TO SKIP ]
            </motion.div>

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.08)_0%,transparent_70%)] pointer-events-none"></div>
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.03) 0px, rgba(0,255,0,0.03) 1px, transparent 1px, transparent 3px)',
            }}></div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-green-500 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.15,
                        }}
                    />
                ))}
            </div>

            {/* Center Content */}
            <div className="relative z-20 flex flex-col items-center w-full max-w-2xl px-4">
                {/* Rotating HUD Circle */}
                <div className="relative mb-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="w-28 h-28 border-t-4 border-l-4 border-green-500 rounded-full shadow-[0_0_30px_rgba(0,255,0,0.5)]"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-3 border-b-4 border-r-4 border-cyan-500 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_rgba(0,255,0,0.8)]"></div>
                    </motion.div>
                </div>

                {/* Text Output */}
                <div className="h-52 w-full flex flex-col items-center justify-end mb-8 space-y-2">
                    {lines.slice(-5).map((line, i) => (
                        <motion.div
                            key={`${line}-${i}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`${i === lines.slice(-5).length - 1
                                    ? 'text-white text-xl md:text-2xl font-bold bg-green-900/30 px-6 py-2 rounded-lg border border-green-500/30 shadow-[0_0_15px_rgba(0,255,0,0.2)]'
                                    : 'text-green-600/80 text-sm md:text-base'
                                }`}
                        >
                            <span className="text-green-400 mr-2">&gt;</span>
                            {line}
                        </motion.div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden relative border border-green-500/30 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-600 shadow-[0_0_20px_#0f0] relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </motion.div>
                </div>
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-3 text-xs text-green-500 tracking-[0.5em] font-bold flex items-center gap-2"
                >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#0f0]"></span>
                    SYSTEM INITIALIZATION
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#0f0]"></span>
                </motion.div>
            </div>
        </div>
    );
};

export default BootScreen;
