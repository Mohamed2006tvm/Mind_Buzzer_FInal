import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, User, LogOut, Zap, Activity } from 'lucide-react';
import MatrixRain from './MatrixRain';
import NetworkStatus from './NetworkStatus';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { teamName, score, timeLeft, timerActive, phase, resetGame } = useGameStore();

    const isLogin = phase === 'login';

    // Keyboard shortcut to reset game: Ctrl+Shift+R
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                const confirmed = window.confirm(
                    '🔄 RESET ENTIRE GAME?\n\n' +
                    'This will:\n' +
                    '• Clear all progress\n' +
                    '• Clear localStorage\n' +
                    '• Reset competition access\n' +
                    '• Return to login screen\n\n' +
                    'Are you sure?'
                );
                if (confirmed) {
                    resetGame();
                    window.location.reload();
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [resetGame]);

    const timerColor =
        timeLeft < 30 ? 'red' : timeLeft < 120 ? 'yellow' : 'green';

    const timerClasses: Record<string, string> = {
        red:    'border-red-500/70 bg-red-950/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]',
        yellow: 'border-yellow-500/70 bg-yellow-950/40 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]',
        green:  'border-green-500/50 bg-green-950/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.15)]',
    };

    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden text-white font-main selection:bg-cyan-500 selection:text-black bg-[#030407]">
            <MatrixRain />

            {/* ────────────────── HUD HEADER ────────────────── */}
            <AnimatePresence>
                {!isLogin && (
                    <motion.header
                        key="hud"
                        initial={{ y: -80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -80, opacity: 0 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
                        className="fixed top-0 left-0 w-full z-50"
                    >
                        {/* glass bar */}
                        <div className="relative flex items-center justify-between px-5 py-2.5 bg-black/75 backdrop-blur-xl border-b border-white/[0.06]">

                            {/* subtle top-line glow */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                            {/* ── LEFT: team + score + logout ── */}
                            <div className="flex items-center gap-1">
                                {/* Team */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                                    <User size={11} className="text-cyan-500" />
                                    <span className="font-mono font-bold text-[11px] tracking-[0.18em] text-cyan-400 uppercase">
                                        {teamName || 'GUEST'}
                                    </span>
                                </div>

                                {/* divider */}
                                <div className="w-px h-5 bg-white/[0.07] mx-1.5" />

                                {/* Score */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                    <Zap size={11} className="text-yellow-400" />
                                    <span className="font-mono font-bold text-[11px] tracking-[0.18em] text-yellow-400 uppercase">
                                        {score.toString().padStart(4, '0')} pts
                                    </span>
                                </div>

                                {/* divider */}
                                <div className="w-px h-5 bg-white/[0.07] mx-1.5" />

                                {/* Logout */}
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to LOGOUT?\nThis will clear your current session progress.')) {
                                            resetGame();
                                            window.location.reload();
                                        }
                                    }}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/50 transition-all duration-200 text-[10px] font-mono tracking-wider"
                                >
                                    <LogOut size={11} />
                                    LOGOUT
                                </button>
                            </div>

                            {/* ── CENTER: timer ── */}
                            <div className="absolute left-1/2 -translate-x-1/2">
                                <AnimatePresence>
                                    {timerActive && (
                                        <motion.div
                                            key="timer"
                                            initial={{ scale: 0.7, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.7, opacity: 0 }}
                                            transition={{ type: 'spring', bounce: 0.4 }}
                                            className={`flex items-center gap-2.5 px-5 py-1.5 rounded-xl border backdrop-blur-md font-mono
                                                ${timerClasses[timerColor]}
                                                ${timerColor === 'red' ? 'animate-pulse' : ''}
                                            `}
                                        >
                                            {timerColor === 'red' ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <Activity size={14} />
                                                </motion.div>
                                            ) : (
                                                <Timer size={14} />
                                            )}
                                            <span className="text-lg font-black tracking-[0.15em]">
                                                {mins}:{secs}
                                            </span>
                                            {timeLeft < 60 && (
                                                <motion.div
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                >
                                                    <Zap size={12} className="text-red-400" />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* ── RIGHT: network status ── */}
                            <motion.div
                                initial={{ x: 16, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center"
                            >
                                <NetworkStatus />
                            </motion.div>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>

            {/* ────────────────── MAIN CONTENT ────────────────── */}
            <main
                className={`relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4
                    ${!isLogin ? 'pt-20' : ''}
                `}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;