import React, { useState, useEffect, useRef } from 'react';
import { useGameStore, type Question } from '../store/gameStore';
import { CODING_QUESTIONS } from '../data/questions';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play, AlertTriangle, CheckCircle, Terminal, Terminal as TerminalIcon } from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';

declare global {
    interface Window {
        Sk: any;
    }
}

const RoundCoding: React.FC = () => {
    const {
        codingQuestionIndex, nextCodingQuestion, addScore,
        setTimer, tickTimer, timeLeft, stopTimer,
        setPhase, setRoundInProgress, competitionStatus,
        incrementCodingSolved, codingSolvedCount,
        timerActive, setCheated, cheated, roundInProgress
    } = useGameStore();

    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

    const question = CODING_QUESTIONS[codingQuestionIndex] as Question;
    const timerRef = useRef<any>(null);

    // Qualification threshold: 60% = 3 out of 5 questions
    const QUALIFICATION_THRESHOLD = 0.6;
    const MIN_SOLVED = Math.ceil(CODING_QUESTIONS.length * QUALIFICATION_THRESHOLD);

    // Initialize & Completion Check
    useEffect(() => {
        // If no more questions, round is complete
        if (!question) {
            const state = useGameStore.getState();
            state.markCodingComplete();

            // 1. Persist Score for Admin Scoreboard (Round 1)
            const storageKey = 'round1_teams';
            try {
                const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const teamName = state.teamName || 'UNKNOWN';

                // Remove existing entry for this team if any to update it
                const filtered = existing.filter((t: any) => t.name !== teamName);

                filtered.push({
                    id: Date.now(),
                    name: teamName,
                    score: state.codingScore,
                    status: 'waiting' // Needs admin to promote
                });

                localStorage.setItem(storageKey, JSON.stringify(filtered));
            } catch (e) {
                console.error("Score save failed", e);
            }

            // 2. Set Status to WAITING (Triggers StatusScreen)
            state.setCompetitionStatus('waiting');

            return;
        }

        setRoundInProgress(true);

        // AUTOSAVE RESTORE
        const savedCode = localStorage.getItem(`autosave_coding_${question.id}`);
        if (savedCode) {
            setCode(savedCode);
            setOutput(`// RESTORED SESSION FOR Q${question.id}_`);
        } else {
            setCode(question.buggy_code || question.starter_code || '');
            setOutput(`// ${question.language?.toUpperCase()} TERMINAL READY_`);
        }

        setStatus('idle');
        setTimer(180); // 3 minutes per question

        timerRef.current = setInterval(() => {
            tickTimer();
        }, 1000);

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Round in progress!';
            return e.returnValue;
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            stopTimer();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [question, setTimer, tickTimer, stopTimer, setPhase, setRoundInProgress]);

    // Auto-exit when timer hits 0
    useEffect(() => {
        if (timeLeft <= 0 && question && timerActive) { // Added timerActive check
            const state = useGameStore.getState();

            // Check if qualified (solved at least 60% of questions)
            const isQualified = codingSolvedCount >= MIN_SOLVED;

            // Save score to localStorage
            const storageKey = 'round1_teams';
            try {
                const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const teamName = state.teamName || 'UNKNOWN';
                const filtered = existing.filter((t: any) => t.name !== teamName);

                filtered.push({
                    id: Date.now(),
                    name: teamName,
                    score: state.codingScore,
                    solved: codingSolvedCount,
                    total: CODING_QUESTIONS.length,
                    status: isQualified ? 'waiting' : 'eliminated'
                });

                localStorage.setItem(storageKey, JSON.stringify(filtered));
            } catch (e) {
                console.error("Score save failed", e);
            }

            // Mark round complete and set status
            state.markCodingComplete();
            state.setCompetitionStatus(isQualified ? 'waiting' : 'eliminated');

            // Clean up timer
            if (timerRef.current) clearInterval(timerRef.current);
            stopTimer();
        }
    }, [timeLeft, question, codingSolvedCount, MIN_SOLVED, stopTimer, timerActive]);

    // Anti-Cheat System (Active only during coding)
    useEffect(() => {
        // Only active if cheated is false, question exists, round is in progress, and status is not success
        if (cheated || !question || !roundInProgress || status === 'success') return;

        const handleViolation = () => {
            // Second check inside event just in case state changed
            const currentState = useGameStore.getState();
            if (currentState.competitionStatus === 'playing' && currentState.roundInProgress) {
                setCheated(true);
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) handleViolation();
        };

        window.addEventListener('blur', handleViolation);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('blur', handleViolation);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [cheated, question, setCheated, roundInProgress, status]);

    // Disqualification Check

    // Disqualification Check
    useEffect(() => {
        if (competitionStatus === 'eliminated') {
            setRoundInProgress(false);
            if (timerRef.current) clearInterval(timerRef.current);
            stopTimer();
            setPhase('dashboard');
        }
    }, [competitionStatus, setPhase, setRoundInProgress, stopTimer]);

    const handleSuccess = () => {
        setStatus('success');
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0aff00', '#00f3ff']
        });

        // Time Based Scoring (Max 100)
        // Formula: Base 50 + (TimeLeft/180 * 50) -> capped at 100
        // Or simpler: Math.ceil( (TimeLeft / 180) * 100 ) ?
        // User said: "MARKS ARE REWARD BASED ON THAT TIME" (implied fast = more points)
        // I will use: Math.max(10, Math.ceil((timeLeft / 180) * 100))
        const score = Math.max(10, Math.ceil((timeLeft / 180) * 100));
        addScore(score, 'coding');

        // Increment solved count
        incrementCodingSolved();

        // Clear autosave
        localStorage.removeItem(`autosave_coding_${question.id}`);

        setTimeout(() => {
            nextCodingQuestion();
        }, 2000);
    };

    const runPython = async () => {
        let buffer = "";
        const builtinRead = (x: string) => {
            if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
            return window.Sk.builtinFiles["files"][x];
        };

        window.Sk.pre = "output";
        window.Sk.configure({
            output: (text: string) => { buffer += text; setOutput(buffer); },
            read: builtinRead
        });

        try {
            await window.Sk.misceval.asyncToPromise(() =>
                window.Sk.importMainWithBody("<stdin>", false, code, true)
            );
            checkOutput(buffer);
        } catch (err: any) {
            setOutput(prev => prev + '\n' + err.toString());
            setStatus('error');
        }
    };



    const checkOutput = (actual: string) => {
        const expected = (question?.expected_output || question?.test_cases?.[0]?.output || "---").trim();
        if (actual.trim().includes(expected)) {
            handleSuccess();
        } else {
            setStatus('error');
            setOutput(prev => prev + `\n\n[SYSTEM]: Output Mismatch.\nExpected: ${expected}\nActual: ${actual.trim()}`);
        }
    };

    const handleRun = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setStatus('running');
        setOutput('');

        if (question.language === 'python') {
            await runPython();
        } else {
            // Fallback/Safety
            setOutput("Error: Only Python is supported in this round.");
            setStatus('error');
        }

        setIsRunning(false);
    };

    if (!question) return <div>Loading...</div>;

    return (
        <div className="w-full h-full max-w-[1600px] flex flex-col gap-4 p-4">
            {/* Enhanced Header with Progress */}
            <div className="flex justify-between items-center bg-gradient-to-r from-black/60 via-green-900/20 to-black/60 p-6 border border-neon-green/30 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(0,255,0,0.1)] relative overflow-hidden">
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent animate-pulse"></div>

                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/50 backdrop-blur">
                            <Terminal size={24} className="text-neon-green" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display text-neon-green tracking-wider">{question.title}</h2>
                            <p className="text-gray-400 font-mono text-sm mt-1">{question.description}</p>
                        </div>
                        <span className="px-3 py-1.5 bg-gray-900/80 rounded-lg text-xs text-white uppercase border border-gray-600 font-bold tracking-wider">
                            {question.language}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 font-mono">PROGRESS:</span>
                        <div className="flex-1 h-2 bg-black/60 rounded-full overflow-hidden border border-gray-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((codingQuestionIndex) / CODING_QUESTIONS.length) * 100}%` }}
                                className="h-full bg-gradient-to-r from-green-500 to-cyan-500 shadow-[0_0_10px_rgba(0,255,0,0.5)]"
                            />
                        </div>
                        <span className="text-xs text-neon-green font-mono font-bold">
                            {codingQuestionIndex} / {CODING_QUESTIONS.length}
                        </span>
                    </div>

                    {/* Solved Count & Qualification Status */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 font-mono">SOLVED:</span>
                        <span className={`text-xs font-mono font-bold ${codingSolvedCount >= MIN_SOLVED ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                            {codingSolvedCount} / {MIN_SOLVED} (Min to Qualify)
                        </span>
                        {codingSolvedCount >= MIN_SOLVED && (
                            <span className="text-xs text-green-400 font-mono">✓ QUALIFIED</span>
                        )}
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="relative z-10 flex gap-4">
                    {/* Circular Timer */}
                    <div className="relative w-24 h-24">
                        <svg className="transform -rotate-90 w-24 h-24">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="6"
                                fill="none"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke={timeLeft < 60 ? "#ff0000" : "#0aff00"}
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - timeLeft / 600)}`}
                                className="transition-all duration-1000"
                                style={{ filter: `drop-shadow(0 0 8px ${timeLeft < 60 ? '#ff0000' : '#0aff00'})` }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-xl font-bold font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-neon-green'}`}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                            <span className="text-[8px] text-gray-500 uppercase">Time</span>
                        </div>
                    </div>

                    {/* Score Display */}
                    <div className="bg-black/60 px-6 py-3 rounded-xl border border-yellow-500/30 backdrop-blur">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Potential</div>
                        <div className="text-2xl font-bold text-yellow-400 font-mono">
                            {Math.max(10, Math.ceil((timeLeft / 180) * 100))} <span className="text-sm text-gray-500">PTS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workspace */}
            <div className="flex-1 flex gap-4 min-h-[500px]">
                {/* Code Editor */}
                <div className={`flex-1 flex flex-col rounded-xl overflow-hidden border-2 ${status === 'error' ? 'border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.3)]' :
                    status === 'success' ? 'border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.3)]' :
                        'border-gray-700'
                    } shadow-2xl transition-all duration-300 relative group`}>
                    {/* Editor Header */}
                    <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-gray-400 text-xs font-mono ml-3">solution.{question.language === 'python' ? 'py' : question.language === 'java' ? 'java' : 'js'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                            <span>Lines: {code.split('\n').length}</span>
                            <span>•</span>
                            <span>UTF-8</span>
                        </div>
                    </div>

                    <Editor
                        height="100%"
                        language={question.language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => {
                            const newCode = value || '';
                            setCode(newCode);
                            localStorage.setItem(`autosave_coding_${question.id}`, newCode);
                        }}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 16,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            automaticLayout: true,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            padding: { top: 16, bottom: 16 }
                        }}
                    />

                    {/* Status Indicator */}
                    {status !== 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`absolute top-20 right-4 px-4 py-2 rounded-lg backdrop-blur-md border ${status === 'running' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                                status === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                                    'bg-green-500/20 border-green-500/50 text-green-400'
                                } font-mono text-sm flex items-center gap-2 shadow-lg`}>
                            {status === 'running' && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
                            {status === 'error' && <AlertTriangle size={16} />}
                            {status === 'success' && <CheckCircle size={16} />}
                            {status === 'running' ? 'EXECUTING...' : status === 'error' ? 'FAILED' : 'SUCCESS'}
                        </motion.div>
                    )}
                </div>

                {/* Terminal */}
                <div className="w-[35%] flex flex-col bg-black/90 border-2 border-gray-700 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
                    {/* Terminal Header */}
                    <div className="bg-gradient-to-r from-gray-900 via-green-900/20 to-gray-900 p-3 border-b border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TerminalIcon size={16} className="text-neon-green" />
                            <span className="text-neon-green text-xs font-mono font-bold tracking-wider">
                                OUTPUT // {question.language?.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#0f0]"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                        </div>
                    </div>

                    {/* Terminal Content */}
                    <div className="flex-1 p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap overflow-auto relative bg-[#0a0e14] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {output ? (
                            <div className="space-y-1">
                                {output.split('\n').map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        className={
                                            line.includes('Error') || line.includes('FAILED') ? 'text-red-400' :
                                                line.includes('SUCCESS') || line.includes('SOLVED') ? 'text-green-400' :
                                                    line.includes('[SYSTEM]') ? 'text-cyan-400' :
                                                        'text-gray-300'
                                        }
                                    >
                                        {line}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-600 italic">
                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                                <span>Awaiting execution...</span>
                            </div>
                        )}

                        {/* Success Overlay */}
                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-black/95 to-cyan-900/95 flex items-center justify-center backdrop-blur-sm"
                            >
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: 360 }}
                                        transition={{ type: "spring", duration: 0.8 }}
                                    >
                                        <CheckCircle size={64} className="text-neon-green mx-auto mb-4 drop-shadow-[0_0_20px_rgba(0,255,0,0.8)]" />
                                    </motion.div>
                                    <h3 className="text-3xl text-neon-green font-bold font-display mb-2">CHALLENGE SOLVED!</h3>
                                    <p className="text-cyan-400 font-mono text-sm">+{100 + Math.max(10, Math.floor(timeLeft / 2))} POINTS</p>
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                        <span className="text-gray-400 text-xs">Loading next challenge...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Run Button */}
                    <button
                        onClick={handleRun}
                        disabled={isRunning || status === 'success'}
                        className={`p-4 font-bold flex items-center justify-center gap-3 transition-all border-t-2 relative overflow-hidden group ${status === 'success'
                            ? 'bg-green-900/40 border-green-500 text-green-400 cursor-default'
                            : isRunning
                                ? 'bg-blue-900/40 border-blue-500 text-blue-400'
                                : 'bg-gray-900 border-neon-cyan text-neon-cyan hover:bg-cyan-900/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                            } disabled:opacity-50`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        {isRunning ? (
                            <>
                                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                <span className="tracking-wider">EXECUTING...</span>
                            </>
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle size={18} />
                                <span className="tracking-wider">COMPLETED</span>
                            </>
                        ) : (
                            <>
                                <Play size={18} />
                                <span className="tracking-wider">RUN CODE</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoundCoding;
