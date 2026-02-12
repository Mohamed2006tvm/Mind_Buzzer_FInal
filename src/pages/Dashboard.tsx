import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Zap, Lock, CheckCircle, Trophy, ChevronRight, Code, Palette, AlertTriangle, Shield, Cpu } from 'lucide-react';
import ConfirmationPopup from '../components/ConfirmationPopup';

const Dashboard: React.FC = () => {
    const {
        setPhase,
        codingCompleted,
        reactUnlocked,
        reactCompleted
    } = useGameStore();

    const [confirm, setConfirm] = React.useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    const handleConfirmClose = () => {
        setConfirm(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="w-full max-w-5xl flex flex-col items-center gap-8 px-4 pb-10">

            {/* ── ALERT BANNER ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full"
            >
                <div className="relative flex items-center gap-4 px-5 py-3.5 rounded-xl border border-red-500/40 bg-red-950/20 overflow-hidden">
                    {/* animated scan line */}
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                        <motion.div
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"
                        />
                        <AlertTriangle size={14} className="text-red-400" />
                        <span className="text-red-400 font-mono text-xs tracking-[0.18em] font-semibold uppercase">Critical Failure</span>
                    </div>
                    <div className="h-3.5 w-px bg-red-800/60" />
                    <p className="text-gray-400 font-mono text-xs leading-relaxed">
                        Two system sectors compromised —{' '}
                        <span className="text-yellow-400 font-medium">Sector 1: Logic Core</span>
                        {' '}·{' '}
                        <span className="text-blue-400 font-medium">Sector 2: Interface Matrix</span>
                    </p>
                </div>
            </motion.div>

            {/* ── TITLE ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-2 relative"
            >
                {/* corner bracket top-left */}
                <span className="absolute -top-5 -left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-500/70 rounded-tl-sm" />
                {/* corner bracket bottom-right */}
                <span className="absolute -bottom-5 -right-6 w-8 h-8 border-b-2 border-r-2 border-purple-500/70 rounded-br-sm" />

                <p className="text-[10px] tracking-[0.35em] text-cyan-500/80 font-mono uppercase">// System Interface v2.0</p>
                <h1
                    className="text-5xl md:text-6xl font-black tracking-[0.12em] uppercase"
                    style={{
                        fontFamily: '"Orbitron", "Space Grotesk", monospace',
                        background: 'linear-gradient(160deg, #ffffff 30%, #94a3b8 80%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: 'none',
                        filter: 'drop-shadow(0 0 32px rgba(255,255,255,0.12))',
                    }}
                >
                    MISSION CONTROL
                </h1>
                <p className="text-xs tracking-[0.25em] text-gray-500 font-mono uppercase">Select objective to initialize</p>
            </motion.div>

            {/* ── MISSION CARDS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">

                {/* ════ MISSION 1 ════ */}
                <MissionCard
                    index={0}
                    missionNum={1}
                    accent="green"
                    completed={codingCompleted}
                    locked={false}
                    icon={<Code size={36} />}
                    title="LOGIC LEGENDS"
                    round="Round 01"
                    tags={[
                        { label: 'Python', color: 'green' },
                        { label: 'Java', color: 'yellow' },
                        { label: 'JS', color: 'purple' },
                    ]}
                    description="Debug critical logic errors across multiple languages. Restore the core processing unit."
                    time="30 MIN"
                    points="300 PTS"
                    buttonLabel={codingCompleted ? 'MISSION COMPLETE' : 'INITIALIZE'}
                    onLaunch={() => {
                        if (!codingCompleted) {
                            setConfirm({
                                isOpen: true,
                                title: 'LAUNCH ROUND 1?',
                                message: 'This will start the timer. Are you ready to debug the Logic Core?',
                                onConfirm: () => {
                                    setPhase('coding');
                                    handleConfirmClose();
                                }
                            });
                        }
                    }}
                />

                {/* ════ MISSION 2 ════ */}
                <MissionCard
                    index={1}
                    missionNum={2}
                    accent="blue"
                    completed={reactCompleted}
                    locked={!reactUnlocked}
                    icon={<Palette size={36} />}
                    title="REACT RESCUE"
                    round="Round 02"
                    tags={[
                        { label: 'React.js', color: 'blue' },
                        { label: 'HTML/CSS', color: 'orange' },
                    ]}
                    description="Fix broken UI components. Debug event handlers and state issues with live preview."
                    time="30 MIN"
                    points="300 PTS"
                    buttonLabel={reactCompleted ? 'MISSION COMPLETE' : reactUnlocked ? 'DEPLOY' : 'LOCKED'}
                    onLaunch={() => {
                        if (reactUnlocked && !reactCompleted) {
                            setConfirm({
                                isOpen: true,
                                title: 'LAUNCH ROUND 2?',
                                message: 'Prepare for UI debugging. The timer will start immediately.',
                                onConfirm: () => {
                                    setPhase('react');
                                    handleConfirmClose();
                                }
                            });
                        }
                    }}
                />
            </div>

            {/* ── SYSTEM STATUS BAR ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="w-full flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-800 bg-gray-950/60"
            >
                <Cpu size={13} className="text-gray-500 shrink-0" />
                <div className="flex-1 flex gap-6">
                    <StatusPill label="LOGIC CORE" active={codingCompleted} />
                    <StatusPill label="INTERFACE MATRIX" active={reactCompleted} />
                </div>
                <div className="h-3 w-px bg-gray-800" />
                <Shield size={13} className="text-gray-500 shrink-0" />
                <span className="text-[10px] font-mono text-gray-600 tracking-wider">
                    {codingCompleted && reactCompleted ? 'ALL SECTORS RESTORED' : 'SECTORS COMPROMISED'}
                </span>
            </motion.div>

            {/* ── LEADERBOARD BUTTON ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setPhase('leaderboard')}
                    className="group relative flex items-center gap-3 px-10 py-3 rounded-xl border border-yellow-500/30 bg-yellow-950/10 overflow-hidden transition-all duration-300 hover:border-yellow-500/60 hover:bg-yellow-950/20"
                >
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent pointer-events-none"
                    />
                    <Trophy size={16} className="text-yellow-500 relative z-10" />
                    <span className="text-yellow-400 font-mono font-bold text-xs tracking-[0.3em] uppercase relative z-10">
                        Global Rankings
                    </span>
                    <ChevronRight size={15} className="text-yellow-600 group-hover:translate-x-1 transition-transform relative z-10" />
                </motion.button>
            </motion.div>

            <ConfirmationPopup
                isOpen={confirm.isOpen}
                title={confirm.title}
                message={confirm.message}
                onConfirm={confirm.onConfirm}
                onCancel={handleConfirmClose}
            />
        </div >
    );
};

/* ─────────────────────────────────────────────
   MISSION CARD COMPONENT
───────────────────────────────────────────── */
type TagColor = 'green' | 'yellow' | 'purple' | 'blue' | 'orange';
type AccentColor = 'green' | 'blue';

const accentMap: Record<AccentColor, {
    border: string; borderHover: string; shadow: string; badgeBg: string;
    badgeBorder: string; btnBg: string; btnBorder: string; btnShadow: string;
    gridColor: string; lockBorder: string; tagBg: string; tagBorder: string; tagText: string;
    glow: string;
}> = {
    green: {
        border: 'border-green-500/30',
        borderHover: 'hover:border-green-400/60',
        shadow: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.18)]',
        badgeBg: 'bg-green-500',
        badgeBorder: 'border-green-400',
        btnBg: 'bg-gradient-to-r from-green-600 to-green-500',
        btnBorder: 'border-green-500/80',
        btnShadow: 'shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:shadow-[0_0_35px_rgba(34,197,94,0.45)]',
        gridColor: '#22c55e',
        lockBorder: 'border-green-500/20',
        tagBg: 'bg-green-950/40',
        tagBorder: 'border-green-500/30',
        tagText: 'text-green-400',
        glow: 'rgba(34,197,94,0.06)',
    },
    blue: {
        border: 'border-blue-500/30',
        borderHover: 'hover:border-blue-400/60',
        shadow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.18)]',
        badgeBg: 'bg-blue-600',
        badgeBorder: 'border-blue-400',
        btnBg: 'bg-gradient-to-r from-blue-600 to-blue-500',
        btnBorder: 'border-blue-500/80',
        btnShadow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.45)]',
        gridColor: '#3b82f6',
        lockBorder: 'border-blue-500/20',
        tagBg: 'bg-blue-950/40',
        tagBorder: 'border-blue-500/30',
        tagText: 'text-blue-400',
        glow: 'rgba(59,130,246,0.06)',
    },
};

const tagColorMap: Record<TagColor, string> = {
    green: 'bg-green-950/40 border-green-500/30 text-green-400',
    yellow: 'bg-yellow-950/40 border-yellow-500/30 text-yellow-400',
    purple: 'bg-purple-950/40 border-purple-500/30 text-purple-400',
    blue: 'bg-blue-950/40 border-blue-500/30 text-blue-400',
    orange: 'bg-orange-950/40 border-orange-500/30 text-orange-400',
};

interface MissionCardProps {
    index: number;
    missionNum: number;
    accent: AccentColor;
    completed: boolean;
    locked: boolean;
    icon: React.ReactNode;
    title: string;
    round: string;
    tags: { label: string; color: TagColor }[];
    description: string;
    time: string;
    points: string;
    buttonLabel: string;
    onLaunch: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
    index, missionNum, accent, completed, locked,
    icon, title, round, tags, description, time, points, buttonLabel, onLaunch
}) => {
    const a = accentMap[accent];
    const isInteractive = !locked && !completed;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative overflow-hidden rounded-2xl border bg-gray-950/80 backdrop-blur-md transition-all duration-400
                ${completed ? `${a.border} opacity-75` : locked ? 'border-gray-800' : `${a.border} ${a.borderHover} ${a.shadow} cursor-pointer`}
            `}
        >
            {/* subtle dot-grid background */}
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(${a.gridColor} 1px, transparent 1px)`,
                    backgroundSize: '22px 22px',
                }}
            />

            {/* top-edge glow line */}
            {!locked && (
                <div
                    className="absolute top-0 left-0 right-0 h-px opacity-60"
                    style={{ background: `linear-gradient(90deg, transparent 0%, ${a.gridColor} 50%, transparent 100%)` }}
                />
            )}

            {/* hover inner glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${a.glow}, transparent 70%)` }}
            />

            {/* ── LOCK OVERLAY ── */}
            <AnimatePresence>
                {locked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl gap-3"
                    >
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Lock size={40} className="text-gray-600" />
                        </motion.div>
                        <div className="text-center space-y-0.5">
                            <p className="text-gray-400 font-mono text-xs tracking-[0.25em] uppercase font-semibold">Locked</p>
                            <p className="text-gray-600 font-mono text-[10px] tracking-wider">Complete Round 1 to unlock</p>
                        </div>
                        <div className="w-16 h-0.5 bg-gray-800 rounded-full overflow-hidden mt-1">
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                className="w-1/2 h-full bg-gray-600"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 p-6 flex flex-col gap-5">

                {/* ── HEADER ROW ── */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {/* number badge */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg font-mono border
                            ${locked ? 'bg-gray-900 border-gray-700 text-gray-600' : `${a.badgeBg} ${a.badgeBorder} text-white`}
                        `}>
                            {String(missionNum).padStart(2, '0')}
                        </div>
                        <div>
                            <p className="text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase">{round}</p>
                            <h2 className={`text-lg font-black tracking-wider uppercase leading-none mt-0.5
                                ${locked ? 'text-gray-600' : completed ? 'text-gray-400' : 'text-white'}
                            `}
                                style={{ fontFamily: '"Orbitron", monospace' }}>
                                {title}
                            </h2>
                        </div>
                    </div>

                    {/* status badge */}
                    <div className="shrink-0">
                        {completed ? (
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', bounce: 0.5 }}
                                className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                            >
                                <CheckCircle size={18} className="text-black" />
                            </motion.div>
                        ) : !locked ? (
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono tracking-wider
                                ${a.tagBg} ${a.tagBorder} ${a.tagText}`}>
                                <motion.div
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-current"
                                />
                                ACTIVE
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* ── ICON + TAGS ── */}
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border bg-black/40 ${locked ? 'border-gray-800 text-gray-700' : `${a.tagBorder} ${a.tagText}`}`}>
                        {icon}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map(t => (
                            <span
                                key={t.label}
                                className={`px-2.5 py-1 border rounded-md text-[10px] font-mono font-semibold tracking-wider ${tagColorMap[t.color]}`}
                            >
                                {t.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── DESCRIPTION ── */}
                <p className="text-gray-500 text-sm font-mono leading-relaxed">
                    {description}
                </p>

                {/* ── STATS ── */}
                <div className={`flex items-center gap-5 pt-4 border-t ${locked ? 'border-gray-800' : a.lockBorder}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-base">⏱</span>
                        <span className="text-yellow-400 font-mono font-bold text-xs tracking-wider">{time}</span>
                    </div>
                    <div className="w-px h-3 bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <Zap size={12} className="text-cyan-400" />
                        <span className="text-cyan-400 font-mono font-bold text-xs tracking-wider">{points}</span>
                    </div>
                </div>

                {/* ── CTA BUTTON ── */}
                <motion.button
                    whileHover={{ scale: isInteractive ? 1.02 : 1 }}
                    whileTap={{ scale: isInteractive ? 0.97 : 1 }}
                    onClick={onLaunch}
                    disabled={!isInteractive}
                    className={`relative w-full py-3.5 rounded-xl font-black text-sm tracking-[0.25em] uppercase border overflow-hidden transition-all duration-300
                        ${completed
                            ? 'bg-transparent border-gray-700/50 text-gray-600 cursor-default'
                            : locked
                                ? 'bg-transparent border-gray-800 text-gray-700 cursor-default'
                                : `${a.btnBg} ${a.btnBorder} text-white ${a.btnShadow}`
                        }
                    `}
                    style={{ fontFamily: '"Orbitron", monospace' }}
                >
                    {isInteractive && (
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: 'linear', repeatDelay: 1.5 }}
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                        />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {completed ? (
                            <><CheckCircle size={15} /> {buttonLabel}</>
                        ) : locked ? (
                            <><Lock size={15} /> {buttonLabel}</>
                        ) : (
                            <><Zap size={15} /> {buttonLabel}</>
                        )}
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   STATUS PILL
───────────────────────────────────────────── */
const StatusPill: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
    <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 shadow-[0_0_6px_#22c55e]' : 'bg-gray-700'}`} />
        <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${active ? 'text-green-400' : 'text-gray-600'}`}>
            {label}
        </span>
    </div>
);

export default Dashboard;