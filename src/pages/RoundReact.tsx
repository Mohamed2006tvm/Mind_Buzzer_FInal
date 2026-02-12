import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { REACT_QUESTIONS } from '../data/questions';
import Editor from '@monaco-editor/react';
import {
    Play, AlertTriangle, CheckCircle, Code,
    RefreshCw, Lock, FileCode, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
// @ts-ignore
import confetti from 'canvas-confetti';

const RoundReact: React.FC = () => {
    const {
        reactQuestionIndex, nextReactQuestion, addScore,
        setTimer, tickTimer, timeLeft, stopTimer,
        setPhase, setRoundInProgress,
        incrementReactSolved, reactSolvedCount,
        timerActive,
        setCheated,
        cheated
    } = useGameStore();

    const [code, setCode] = useState('');
    const [previewStatus, setPreviewStatus] = useState<'broken' | 'fixed'>('broken');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isReloading, setIsReloading] = useState(false);

    const question = REACT_QUESTIONS[reactQuestionIndex];
    const timerRef = useRef<any>(null);

    // Qualification threshold: 60% = 2 out of 3 questions
    const QUALIFICATION_THRESHOLD = 0.6;
    const MIN_SOLVED = Math.ceil(REACT_QUESTIONS.length * QUALIFICATION_THRESHOLD);

    // Initialize
    useEffect(() => {
        if (!question) {
            const state = useGameStore.getState();
            state.markReactComplete();

            // 1. Persist Score (Round 2)
            const storageKey = 'round2_teams';
            try {
                const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const teamName = state.teamName || 'UNKNOWN';

                // Update entry
                const filtered = existing.filter((t: any) => t.name !== teamName);

                filtered.push({
                    id: Date.now(),
                    name: teamName,
                    score: state.reactScore,
                    status: 'waiting' // Needs final review
                });

                localStorage.setItem(storageKey, JSON.stringify(filtered));
            } catch (e) {
                console.error("Score save failed", e);
            }

            // 2. Set Status (Triggers StatusScreen: Mission Accomplished)
            state.setCompetitionStatus('waiting');
            return;
        }

        setRoundInProgress(true);
        // AUTOSAVE RESTORE (Round 3)
        const savedCode = localStorage.getItem(`autosave_react_q${question.id}`);
        if (savedCode) {
            setCode(savedCode);
        } else {
            setCode(question.buggy_code || '');
        }

        setPreviewStatus('broken');
        setErrorMsg('Runtime Error: Component failed to mount properly.');
        setTimer(600); // 10 minutes per challenge

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
        if (timeLeft <= 0 && question && timerActive) {
            const state = useGameStore.getState();

            // Check if qualified (solved at least 60% of questions)
            const isQualified = reactSolvedCount >= MIN_SOLVED;

            // Save score to localStorage
            const storageKey = 'round2_teams';
            try {
                const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const teamName = state.teamName || 'UNKNOWN';
                const filtered = existing.filter((t: any) => t.name !== teamName);

                filtered.push({
                    id: Date.now(),
                    name: teamName,
                    score: state.reactScore,
                    solved: reactSolvedCount,
                    total: REACT_QUESTIONS.length,
                    status: isQualified ? 'waiting' : 'eliminated'
                });

                localStorage.setItem(storageKey, JSON.stringify(filtered));
            } catch (e) {
                console.error("Score save failed", e);
            }

            // Mark round complete and set status
            state.markReactComplete();
            state.setCompetitionStatus(isQualified ? 'waiting' : 'eliminated');

            // Clean up timer
            if (timerRef.current) clearInterval(timerRef.current);
            stopTimer();
        }
    }, [timeLeft, question, reactSolvedCount, MIN_SOLVED, stopTimer, timerActive]);

    // Anti-Cheat System
    useEffect(() => {
        if (cheated || !question) return;

        const handleViolation = () => {
            setCheated(true);
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
    }, [cheated, question, setCheated]);

    // Validation Logic (Smart Mock)
    const validateTimeoutRef = useRef<any>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (validateTimeoutRef.current) clearTimeout(validateTimeoutRef.current);
        };
    }, []);

    const validateCode = (currentCode: string) => {
        setIsReloading(true);

        if (validateTimeoutRef.current) clearTimeout(validateTimeoutRef.current);

        // Simulate "Hot Reload" delay
        validateTimeoutRef.current = setTimeout(() => {
            let isFixed = false;
            // Simple heuristics for testing
            if (question.id === 1) {
                // Button onClick fix
                if (currentCode.includes('onClick={handleClick}') || currentCode.includes('onClick={() => handleClick()}')) {
                    isFixed = true;
                }
            } else if (question.id === 2) {
                // State setter fix
                if (currentCode.includes('setCount(count + 1)') || currentCode.includes('setCount(prev => prev + 1)')) {
                    isFixed = true;
                }
            } else if (question.id === 3) {
                // Conditional rendering fix
                if (currentCode.includes('show &&') || currentCode.includes('show?') || currentCode.includes('show ?')) {
                    isFixed = true;
                }
            }

            if (isFixed) {
                setPreviewStatus('fixed');
                setErrorMsg(null);
                handleSuccess();
            } else {
                setPreviewStatus('broken');
                setErrorMsg('Compiling... Error: Interaction handlers invalid.');
            }
            setIsReloading(false);
        }, 800);
    };

    const handleSuccess = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#61dafb', '#ffffff'] // React colors
        });

        const bonus = Math.max(10, Math.floor(timeLeft / 2));
        addScore(150 + bonus, 'react');

        // Increment solved count
        incrementReactSolved();

        // Clear autosave
        localStorage.removeItem(`autosave_react_q${question.id}`);

        setTimeout(() => {
            nextReactQuestion();
        }, 3000);
    };

    if (!question) return <div>Loading...</div>;

    return (
        <div className="w-full h-full max-w-[1600px] flex flex-col gap-4 p-4 z-10 relative">
            {/* Enhanced Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-black/80 via-blue-900/20 to-black/80 p-6 border border-blue-500/30 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(0,100,255,0.15)] relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>

                <div className="relative z-10 flex items-center gap-6 flex-1">
                    <div className="p-3 bg-blue-900/30 rounded-xl border border-blue-500/50 backdrop-blur">
                        <Code className="text-blue-400" size={28} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white tracking-wide font-display mb-1">ROUND 2: REACT RESCUE</h2>
                        <p className="text-blue-400 font-mono text-sm">:: {question.title} ::</p>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs text-gray-500 font-mono">PROGRESS:</span>
                            <div className="flex-1 h-2 bg-black/60 rounded-full overflow-hidden border border-gray-700">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((reactQuestionIndex) / REACT_QUESTIONS.length) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(0,100,255,0.5)]"
                                />
                            </div>
                            <span className="text-xs text-blue-400 font-mono font-bold">
                                {reactQuestionIndex} / {REACT_QUESTIONS.length}
                            </span>
                        </div>

                        {/* Solved Count & Qualification Status */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500 font-mono">SOLVED:</span>
                            <span className={`text-xs font-mono font-bold ${reactSolvedCount >= MIN_SOLVED ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                {reactSolvedCount} / {MIN_SOLVED} (Min to Qualify)
                            </span>
                            {reactSolvedCount >= MIN_SOLVED && (
                                <span className="text-xs text-green-400 font-mono">✓ QUALIFIED</span>
                            )}
                        </div>
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
                                stroke={timeLeft < 60 ? "#ff0000" : "#61dafb"}
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - timeLeft / 600)}`}
                                className="transition-all duration-1000"
                                style={{ filter: `drop-shadow(0 0 8px ${timeLeft < 60 ? '#ff0000' : '#61dafb'})` }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-xl font-bold font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                            <span className="text-[8px] text-gray-500 uppercase">Time</span>
                        </div>
                    </div>

                    {/* Score Display */}
                    <div className="bg-black/60 px-6 py-3 rounded-xl border border-yellow-500/30 backdrop-blur">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Potential</div>
                        <div className="text-2xl font-bold text-yellow-400 font-mono">
                            {150 + Math.max(10, Math.floor(timeLeft / 2))} <span className="text-sm text-gray-500">PTS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Screen Workspace */}
            <div className="flex-1 flex gap-0 overflow-hidden bg-[#1e1e1e] rounded-b-lg border border-gray-800 shadow-2xl relative">

                {/* LEFT: VS Code Editor */}
                <div className="flex-1 flex flex-col border-r border-black relative group">
                    {/* File Tabs */}
                    <div className="flex bg-[#252526] text-sm overflow-x-auto">
                        <div className="px-4 py-2 bg-[#1e1e1e] text-white border-t-2 border-blue-500 flex items-center gap-2 min-w-[120px]">
                            <FileCode size={14} className="text-blue-400" />
                            <span>App.jsx</span>
                            <span className="ml-auto text-gray-500 hover:text-white cursor-pointer">×</span>
                        </div>
                        <div className="px-4 py-2 text-gray-500 hover:bg-[#2a2a2b] cursor-pointer flex items-center gap-2 min-w-[120px]">
                            <span className="text-yellow-400">#</span>
                            <span>styles.css</span>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language="javascript"
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => {
                                const newCode = val || '';
                                setCode(newCode);
                                localStorage.setItem(`autosave_react_q${question.id}`, newCode);
                            }}
                            options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                lineNumbers: 'on',
                                padding: { top: 16 }
                            }}
                        />


                        {/* Run Button Overlay */}
                        <div className="absolute bottom-6 right-6 z-10">
                            <button
                                onClick={() => validateCode(code)}
                                disabled={previewStatus === 'fixed' || isReloading}
                                className={`relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-2xl transition-all group ${previewStatus === 'fixed'
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                {isReloading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="tracking-wider">COMPILING...</span>
                                    </>
                                ) : previewStatus === 'fixed' ? (
                                    <>
                                        <Check size={20} />
                                        <span className="tracking-wider">FIXED</span>
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} />
                                        <span className="tracking-wider">RUN & PREVIEW</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* VS Code Status Bar */}
                    <div className="bg-[#007acc] text-white text-[10px] px-2 py-1 flex justify-between items-center font-sans">
                        <div className="flex gap-4">
                            <span>main*</span>
                            <span>0 errors</span>
                        </div>
                        <div className="flex gap-4">
                            <span>Ln {code.split('\n').length}, Col 1</span>
                            <span>UTF-8</span>
                            <span>JavaScript JSX</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Live Browser Preview */}
                <div className="w-[45%] flex flex-col bg-white overflow-hidden relative">
                    {/* Browser Address Bar */}
                    <div className="bg-[#f0f0f0] border-b border-[#cccccc] p-2 flex items-center gap-2">
                        <div className="flex gap-1.5 ml-2 mr-4">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d8a100]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
                        </div>
                        <div className="flex-1 bg-white border border-[#e0e0e0] rounded-md px-3 py-1.5 flex items-center gap-2 text-xs font-sans text-gray-700 shadow-sm">
                            <Lock size={10} className="text-green-600" />
                            <span className="opacity-50">https://</span>
                            <span>localhost:3000</span>
                            <span className="opacity-50">/preview</span>
                        </div>
                        <button
                            onClick={() => validateCode(code)}
                            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                            title="Hot Reload"
                        >
                            <RefreshCw size={14} className={isReloading ? "animate-spin text-blue-500" : ""} />
                        </button>
                    </div>

                    {/* Web Content */}
                    <div className="flex-1 bg-white relative flex flex-col">
                        {/* Compilation Overlay */}
                        {isReloading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <span className="text-lg text-gray-700 font-bold font-mono">Compiling...</span>
                                    <div className="flex gap-1 mt-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Success Celebration Overlay */}
                        {previewStatus === 'fixed' && !isReloading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-gradient-to-br from-green-500/95 via-blue-500/95 to-cyan-500/95 z-30 flex items-center justify-center backdrop-blur-sm"
                            >
                                <div className="text-center text-white">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", duration: 0.8 }}
                                    >
                                        <CheckCircle size={80} className="mx-auto mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]" />
                                    </motion.div>
                                    <motion.h3
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-4xl font-bold font-display mb-3"
                                    >
                                        COMPONENT FIXED!
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-xl font-mono mb-6"
                                    >
                                        +{150 + Math.max(10, Math.floor(timeLeft / 2))} POINTS
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        <span className="text-sm">Proceeding to next challenge...</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex-1 p-8 flex flex-col items-center justify-center">
                            {/* Simulated App UI */}
                            {question.id === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <h3 className="text-2xl font-bold text-gray-800">Button Click Handler</h3>
                                    <p className="text-gray-500 mb-4 max-w-sm">The button below expects an event handler to trigger the alert.</p>

                                    <button
                                        className={`px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all transform ${previewStatus === 'fixed'
                                            ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                                            : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        {previewStatus === 'fixed' ? '✅ CLICK ME (FIXED)' : '🚫 BROKEN BUTTON'}
                                    </button>
                                </motion.div>
                            )}

                            {question.id === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center p-8 border rounded-xl shadow-sm bg-gray-50 max-w-sm w-full"
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-6">Counter App</h3>
                                    <div className="text-6xl font-black text-gray-800 mb-8 font-mono">
                                        {previewStatus === 'fixed' ? '1' : '0'}
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <button className={`px-4 py-2 rounded font-bold text-white transition-all ${previewStatus === 'fixed' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'
                                            }`}>
                                            INCREMENT +
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Error Console / Success Message */}
                        <div className={`border-t transition-all duration-300 ${errorMsg ? 'bg-red-50 p-4 border-red-200 h-32' : previewStatus === 'fixed' ? 'bg-green-50 p-4 border-green-200 h-20' : 'h-0 overflow-hidden'}`}>
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-3 text-red-600 font-mono text-sm items-start"
                                >
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    <div>
                                        <span className="font-bold">Uncaught Error:</span> {errorMsg}
                                        <div className="text-xs text-red-400 mt-1">at App (App.tsx:12:4)</div>
                                    </div>
                                </motion.div>
                            )}
                            {previewStatus === 'fixed' && !errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 text-green-700 font-bold"
                                >
                                    <CheckCircle size={20} />
                                    <span>Compiled successfully! Proceeding to next challenge...</span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoundReact;
