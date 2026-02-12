import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Fingerprint, Lock, Zap } from 'lucide-react';

const CheatScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center p-8 fixed inset-0 z-50 bg-black">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl border-4 border-red-600 bg-red-950/90 p-12 rounded-none shadow-[0_0_100px_rgba(255,0,0,0.6)] relative overflow-hidden"
            >
                {/* Glitch Overlay */}
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>

                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="mb-8 inline-block"
                >
                    <ShieldAlert size={100} className="text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,1)]" />
                </motion.div>

                <h1 className="text-6xl font-black text-red-500 font-display mb-2 tracking-tighter drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
                    TERMINATED
                </h1>

                <h2 className="text-2xl text-white font-mono bg-red-600 inline-block px-4 py-1 mb-8">
                    ANTI-CHEAT TRIGGERED
                </h2>

                <div className="font-mono text-red-400 text-left bg-black/50 p-6 border border-red-500/30 rounded mb-8 space-y-2">
                    <p className="flex items-center gap-2">
                        <Lock size={16} />
                        <span>VIOLATION DETECTED: <span className="text-white">FOCUS_LOST_EVENT</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                        <Fingerprint size={16} />
                        <span>USER ID: <span className="text-white">Unknown</span></span>
                    </p>
                    <p className="text-xs text-red-500/70 mt-4 border-t border-red-500/30 pt-2">
                        System access has been permanently revoked.
                        This incident has been logged.
                    </p>
                </div>

                <div className="flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(220, 38, 38, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="px-8 py-3 border border-red-500 text-red-500 font-mono text-sm tracking-widest hover:text-white transition-colors flex items-center gap-2"
                    >
                        <Zap size={16} />
                        SYSTEM_RESET()
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default CheatScreen;
