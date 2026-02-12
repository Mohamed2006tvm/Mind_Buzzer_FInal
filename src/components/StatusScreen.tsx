import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { CheckCircle, ShieldAlert, Cpu, Zap, Lock } from 'lucide-react';
import useSound from 'use-sound';

// Using consistent high-quality UI sounds
const SFX = {
    SUCCESS: '', // Placeholder - add local file if needed
    FAIL: '',    // Placeholder - add local file if needed
};

const StatusScreen: React.FC = () => {
    const { competitionStatus, setCompetitionStatus, setPhase, unlockReact, codingScore } = useGameStore();

    const [playSuccess] = useSound(SFX.SUCCESS, { volume: 0.6 });
    const [playFail] = useSound(SFX.FAIL, { volume: 0.5 });

    // Sound effects based on status
    useEffect(() => {
        if (competitionStatus === 'promoted') {
            playSuccess();
            unlockReact();
        } else if (competitionStatus === 'eliminated') {
            playFail();
        }
    }, [competitionStatus, playSuccess, playFail, unlockReact]);

    if (competitionStatus === 'waiting') {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full text-center p-8 relative z-20">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-black/90 via-yellow-900/20 to-black/90 p-12 rounded-2xl border-2 border-yellow-500/50 backdrop-blur-lg shadow-[0_0_60px_rgba(255,200,0,0.3)] relative overflow-hidden max-w-2xl"
                >
                    {/* Animated background particles */}
                    <div className="absolute inset-0 opacity-20">
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-yellow-500 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -20, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500 shadow-[0_0_10px_#fbbf24]"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500 shadow-[0_0_10px_#fbbf24]"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500 shadow-[0_0_10px_#fbbf24]"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500 shadow-[0_0_10px_#fbbf24]"></div>

                    <div className="relative z-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                            className="mb-8 inline-block p-6 bg-yellow-500/20 rounded-full border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(251,191,36,0.4)]"
                        >
                            <Cpu size={64} className="text-yellow-500 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                        </motion.div>

                        <motion.h2
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-5xl font-display text-white mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                        >
                            UPLINK ESTABLISHED
                        </motion.h2>

                        <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                            <p className="font-mono text-yellow-400 text-base leading-relaxed">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    // MISSION DATA RECEIVED.
                                </motion.span>
                                <br />
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    // AWAITING SENTINEL CLEARANCE.
                                </motion.span>
                                <br />
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.75 }}
                                    className="text-yellow-400"
                                >
                                    // ROUND 1 SCORE: {codingScore} PTS
                                </motion.span>
                                <br />
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="text-yellow-300 font-bold"
                                >
                                    // STAND BY FOR INSTRUCTION...
                                </motion.span>
                            </p>
                        </div>

                        <div className="w-full max-w-md h-2 bg-gray-800 rounded-full overflow-hidden mx-auto border border-yellow-500/30">
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                className="w-1/2 h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                            />
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ delay: 1.5 }}
                            onClick={() => {
                                if (window.confirm("WARNING: This will wipe all system data and reset the simulation. Continue?")) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="mt-8 px-6 py-2 bg-red-900/30 border border-red-500/30 text-red-500 text-xs font-mono rounded hover:bg-red-900/40 hover:border-red-500 hover:text-red-400 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                        >
                            <Zap size={14} />
                            [ SYSTEM_REBOOT ]
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (competitionStatus === 'eliminated' || competitionStatus === 'banned') {
        const isBanned = competitionStatus === 'banned';
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-full py-12 text-center relative z-20">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-black/90 via-red-900/20 to-black/90 p-8 md:p-12 rounded-2xl border-2 border-red-500/50 backdrop-blur-lg shadow-[0_0_60px_rgba(255,0,0,0.3)] max-w-2xl relative overflow-hidden my-auto"
                >
                    {/* Scanline effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-pulse"></div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500 shadow-[0_0_10px_#ef4444]"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500 shadow-[0_0_10px_#ef4444]"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500 shadow-[0_0_10px_#ef4444]"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500 shadow-[0_0_10px_#ef4444]"></div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="mb-6 inline-block p-4 bg-red-500/20 rounded-full border-2 border-red-500/50"
                        >
                            <ShieldAlert size={48} className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        </motion.div>

                        <h2 className="text-3xl md:text-4xl font-display text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {isBanned ? 'ACCESS TERMINATED' : 'THANK YOU FOR PARTICIPATING'}
                        </h2>

                        <p className="font-mono text-gray-300 text-sm md:text-base mb-6 leading-relaxed max-w-lg mx-auto">
                            {isBanned
                                ? "VIOLATION DETECTED. YOUR NEURAL LINK HAS BEEN SEVERED PERMANENTLY."
                                : "Agent, your skills have been noted. The recruitment process is highly competitive, and while you will not be advancing to the next sector, your contribution is valued."}
                        </p>

                        <div className="border-l-4 border-red-600 bg-red-900/20 p-4 text-left mb-6 rounded-r-lg backdrop-blur-sm">
                            <p className="text-red-400 font-bold font-mono text-xs mb-2 flex items-center gap-2">
                                <Lock size={14} />
                                :: SYSTEM REPORT ::
                            </p>
                            <p className="text-cyan-400 font-mono text-xs space-y-1">
                                &gt; Performance Data: <span className="text-yellow-500">{codingScore} PTS</span>.<br />
                                &gt; System Integrity: <span className="text-green-500">100%</span>.<br />
                                &gt; Status: <span className="text-white font-bold">{isBanned ? 'DISHONORABLE DISCHARGE' : 'HONORABLE DISCHARGE'}</span>.
                            </p>
                        </div>

                        {/* Motivational Quote (Only for eliminated, not banned) */}
                        {!isBanned && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mb-8 font-mono text-yellow-500/80 text-xs italic border-t border-b border-gray-800 py-3 max-w-md mx-auto bg-yellow-900/10 rounded"
                            >
                                "Failure is simply the opportunity to begin again, this time more intelligently." <br />
                                <span className="text-gray-600 not-italic text-[10px] mt-1 block">- Henry Ford</span>
                            </motion.div>
                        )}

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ delay: 1 }}
                            onClick={() => {
                                if (window.confirm("WARNING: This will wipe all system data and reset the simulation. Continue?")) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="group relative overflow-hidden px-8 py-3 bg-red-900/40 border border-red-500/50 text-red-500 text-sm font-mono font-bold tracking-wider rounded-lg hover:bg-red-900/60 hover:border-red-400 hover:text-red-400 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <Zap size={16} className="group-hover:animate-pulse" />
                            [ SYSTEM_REBOOT ]
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (competitionStatus === 'promoted') {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full text-center p-8 relative z-20">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-black/90 via-green-900/20 to-black/90 p-12 rounded-2xl border-2 border-green-500/50 backdrop-blur-lg shadow-[0_0_80px_rgba(0,255,0,0.4)] max-w-2xl relative overflow-hidden"
                >
                    {/* Animated success particles */}
                    <div className="absolute inset-0 opacity-30">
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
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500 shadow-[0_0_15px_#22c55e]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500 shadow-[0_0_15px_#22c55e]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500 shadow-[0_0_15px_#22c55e]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500 shadow-[0_0_15px_#22c55e]"></div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
                            className="mb-6 inline-block bg-green-500/20 p-8 rounded-full border-2 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.5)]"
                        >
                            <CheckCircle size={80} className="text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.9)]" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl font-display text-white mb-6 drop-shadow-[0_0_20px_rgba(0,255,0,0.8)]"
                        >
                            ACCESS GRANTED
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mb-8 p-4 bg-green-900/20 border border-green-500/30 rounded-lg backdrop-blur-sm"
                        >
                            <p className="font-mono text-green-400 text-lg">
                                // CLEARANCE LEVEL INCREASED.<br />
                                // SCORE: {codingScore} PTS.<br />
                                // NEW MODULES UNLOCKED.<br />
                                <span className="text-green-300 font-bold">// PROCEED TO NEXT SECTOR.</span>
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setCompetitionStatus('playing');
                                setPhase('dashboard');
                            }}
                            className="group relative overflow-hidden bg-gradient-to-r from-green-900/30 via-green-800/30 to-green-900/30 border-2 border-green-500 text-green-400 px-8 py-4 rounded-xl font-bold tracking-[0.3em] hover:border-green-400 transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] w-full max-w-md mx-auto"
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <Zap size={20} className="group-hover:animate-pulse" />
                                ENTER NEXT SECTOR
                                <span className="text-2xl">&gt;&gt;</span>
                            </span>
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ delay: 1 }}
                            onClick={() => {
                                if (window.confirm("WARNING: This will wipe all system data and reset the simulation. Continue?")) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="mt-6 px-6 py-2 bg-red-900/30 border border-red-500/30 text-red-500 text-xs font-mono rounded hover:bg-red-900/40 hover:border-red-500 hover:text-red-400 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                        >
                            <Zap size={14} />
                            [ SYSTEM_REBOOT ]
                        </motion.button>
                    </div>
                </motion.div >
            </div >
        );
    }

    return null;
};

export default StatusScreen;
