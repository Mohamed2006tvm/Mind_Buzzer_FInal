import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Code, Coffee, Server, Cpu } from 'lucide-react';

const Round2Selection: React.FC = () => {
    const { setRound2Mode } = useGameStore();

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={variants}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 font-display filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    CHOOSE YOUR PROTOCOL
                </h1>
                <p className="text-xl text-blue-200 font-mono tracking-widest uppercase">
                    / Round 2 specialization interface /
                </p>
            </motion.div>

            <div className="flex flex-wrap gap-8 justify-center items-stretch max-w-5xl w-full">
                {/* JAVA OPTION */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: '#f59e0b' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRound2Mode('java')}
                    className="flex-1 min-w-[300px] bg-black/60 backdrop-blur-md border px-8 py-12 rounded-2xl border-gray-700 cursor-pointer shadow-[0_0_50px_rgba(0,0,0,0.5)] group relative overflow-hidden transition-colors"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                        <div className="w-24 h-24 rounded-full bg-orange-900/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-shadow">
                            <Coffee size={48} className="text-orange-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 font-heading group-hover:text-orange-400 transition-colors">JAVA BACKEND</h2>
                        <div className="h-1 w-20 bg-orange-500/50 rounded-full mb-6" />
                        <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed">
                            Analyze and repair critical server-side algorithms. Optimize logic flow and ensure system stability.
                        </p>
                        <div className="mt-auto flex gap-2 text-xs font-mono text-orange-300 bg-orange-900/20 px-3 py-1 rounded border border-orange-500/30">
                            <Server size={14} />
                            <span>HARDCORE LOGIC</span>
                        </div>
                    </div>
                </motion.div>

                {/* REACT OPTION */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRound2Mode('react')}
                    className="flex-1 min-w-[300px] bg-black/60 backdrop-blur-md border px-8 py-12 rounded-2xl border-gray-700 cursor-pointer shadow-[0_0_50px_rgba(0,0,0,0.5)] group relative overflow-hidden transition-colors"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                        <div className="w-24 h-24 rounded-full bg-blue-900/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-shadow">
                            <Code size={48} className="text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 font-heading group-hover:text-blue-400 transition-colors">REACT FRONTEND</h2>
                        <div className="h-1 w-20 bg-blue-500/50 rounded-full mb-6" />
                        <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed">
                            Debug and implement interactive UI components. Fix rendering issues and restore visual systems.
                        </p>
                        <div className="mt-auto flex gap-2 text-xs font-mono text-blue-300 bg-blue-900/20 px-3 py-1 rounded border border-blue-500/30">
                            <Cpu size={14} />
                            <span>VISUAL DEBUGGING</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="mt-12 text-gray-500 font-mono text-xs">
                Select a specialization to begin Round 2. This choice is final.
            </div>
        </div>
    );
};

export default Round2Selection;
