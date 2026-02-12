import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { JAVA_QUESTIONS } from '../data/questions';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Check, X, Cpu } from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';

const Round3Java: React.FC = () => {
    const {
        setPhase,
        addScore,
        setTimer,
        tickTimer,
        timeLeft,
        setRoundInProgress,
        competitionStatus,
        markJavaComplete,
        setCompetitionStatus,
        setCheated,
        cheated
    } = useGameStore();

    const [selectedQ, setSelectedQ] = useState<number | null>(null);
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'selecting' | 'coding' | 'compiling' | 'testing' | 'success' | 'failed'>('selecting');
    const [logs, setLogs] = useState<string[]>([]);
    const [testResults, setTestResults] = useState<{ input: string, output: string, passed: boolean }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'coding') tickTimer();
        }, 1000);

        // Prevent accidental navigation during round
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (status === 'coding' || status === 'compiling' || status === 'testing') {
                e.preventDefault();
                e.returnValue = 'You are in the middle of a round! Your progress will be lost.';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [status, tickTimer]);

    // Handle Time Out
    useEffect(() => {
        if (timeLeft <= 0 && status === 'coding') {
            finalizeRound(false);
        }
    }, [timeLeft, status]);

    // Monitor for disqualification - kick out immediately
    useEffect(() => {
        if (competitionStatus === 'eliminated') {
            // User has been disqualified by admin
            setRoundInProgress(false);
            setPhase('dashboard'); // Kick them out (StatusScreen will show disqualified message)
        }
    }, [competitionStatus, setPhase, setRoundInProgress]);

    // Anti-Cheat System
    useEffect(() => {
        if (cheated || status !== 'coding') return;

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
    }, [status, setCheated, cheated]);

    const handleSelect = (idx: number) => {
        setSelectedQ(idx);
        setCode(JAVA_QUESTIONS[idx].starter_code || '');
        setStatus('coding');
        setTimer(300); // 5 mins
        setLogs(['// SYSTEM READY', '// JDK 17.0.2 LOADED']);
        setTestResults([]);
        setRoundInProgress(true); // Lock user in round
    };

    const compileTimeoutRef = useRef<any>(null);
    const testIntervalRef = useRef<any>(null);

    // Cleanup all timers on unmount
    useEffect(() => {
        return () => {
            if (compileTimeoutRef.current) clearTimeout(compileTimeoutRef.current);
            if (testIntervalRef.current) clearInterval(testIntervalRef.current);
        };
    }, []);

    const validateLogic = (qId: string, code: string): boolean => {
        // Simple heuristic checks for target logic
        if (qId === 'java1') return code.includes('%') || code.includes('& 1'); // Modulus or Bitwise
        if (qId === 'java2') return code.includes('for') || code.includes('while') || code.includes('StringBuilder'); // Loop or Builder
        if (qId === 'java3') return code.includes('for') || code.includes('while'); // Loop
        if (qId === 'java4') return (code.includes('%') && code.includes('/')) || code.includes('String'); // Mod/Div or String parsing
        return true;
    };

    const runTests = () => {
        if (selectedQ === null) return;

        // 1. Logic Validation
        const question = JAVA_QUESTIONS[selectedQ];
        if (!validateLogic(question.id as string, code)) {
            setStatus('failed');
            setLogs(prev => [...prev, '>> LOGIC CHECK FAILED: Code does not follow expected logic structure.', '>> Please use the required operators/loops.']);
            return;
        }

        setStatus('compiling');
        setLogs(prev => [...prev, '>> javac Solution.java', '>> Compiling...']);

        // Clear any existing timers
        if (compileTimeoutRef.current) clearTimeout(compileTimeoutRef.current);
        if (testIntervalRef.current) clearInterval(testIntervalRef.current);

        compileTimeoutRef.current = setTimeout(() => {
            setLogs(prev => [...prev, '>> Compilation Successful.', '>> Running JUnit Tests...']);
            setStatus('testing');

            let passedCount = 0;
            const totalTests = question.test_cases?.length || 0;
            const newResults: any[] = [];

            let currentTest = 0;

            testIntervalRef.current = setInterval(() => {
                // Determine if we should stop based on currentTest or accidental unmount
                if (currentTest >= totalTests) {
                    if (testIntervalRef.current) clearInterval(testIntervalRef.current);
                    finalizeRound(passedCount === totalTests);
                    return;
                }

                const tc = question.test_cases![currentTest];
                // Check if code has changed at all
                const isModified = code.trim() !== (question.starter_code || '').trim();
                // Check if not empty
                const isNotEmpty = code.trim().length > 20;

                // "Mock" Java Runtime evaluation simulation
                const isPass = isModified && isNotEmpty;

                setLogs(prev => [...prev, `>> Test Case ${currentTest + 1}: ${isPass ? 'PASS' : 'FAIL'}`]);
                newResults.push({ ...tc, passed: isPass });
                setTestResults([...newResults]);

                if (isPass) passedCount++;
                currentTest++;

            }, 800);

        }, 1500);
    };

    const finalizeRound = (allPassed: boolean) => {
        if (allPassed) {
            setStatus('success');
            setLogs(prev => [...prev, '>> ALL TESTS PASSED. SYSTEM SECURED.']);
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });

            // Speed Based Scoring
            // Base 100 + Speed Bonus (Max 100 based on 5 mins/300s)
            const speedBonus = Math.ceil((timeLeft / 300) * 100);
            const totalScore = 100 + speedBonus;
            addScore(totalScore, 'react'); // Attribute to Round 2

            // Persist Score for Round 2
            const state = useGameStore.getState();
            const storageKey = 'round2_teams';
            try {
                const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const tName = state.teamName || 'UNKNOWN';
                const filtered = existing.filter((t: any) => t.name !== tName);

                filtered.push({
                    id: Date.now(),
                    name: tName,
                    score: state.reactScore + totalScore, // Manually add current score since state update might be async
                    status: 'waiting',
                    mode: 'java'
                });
                localStorage.setItem(storageKey, JSON.stringify(filtered));
            } catch (e) {
                console.error("Score save failed", e);
            }

            setCompetitionStatus('waiting');
            markJavaComplete();
        } else {
            setStatus('failed');
            setLogs(prev => [...prev, '>> CRITICAL FAILURE. SEGMENTATION FAULT.']);
        }
    };

    return (
        <div className="w-full h-full max-w-[1400px] flex flex-col gap-4 p-4 z-10 relative">
            {status === 'selecting' && (
                <div className="flex flex-col items-center gap-8">
                    <h2 className="text-3xl font-heading text-neon-pink">ROUND 2: JAVA PROTOCOL - SELECT MODULE</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {JAVA_QUESTIONS.map((q, idx) => (
                            <motion.div
                                key={q.id}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => handleSelect(idx)}
                                className="w-64 h-auto min-h-[16rem] bg-black/60 border border-neon-pink/30 rounded-xl p-4 cursor-pointer hover:border-neon-pink hover:bg-neon-pink/10 transition-all flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-neon-pink font-bold">{q.difficulty}</span>
                                    <Cpu size={20} className="text-gray-500" />
                                </div>
                                <div className="mt-auto">
                                    <h3 className="text-xl font-bold text-white">{q.title}</h3>
                                    <p className="text-gray-400 text-xs mt-2 line-clamp-3 overflow-hidden">{q.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <button onClick={() => setPhase('dashboard')} className="cyber-button text-sm">BACK TO DASHBOARD</button>
                </div>
            )}

            {status !== 'selecting' && selectedQ !== null && (
                <>
                    <div className="flex justify-between items-center bg-black/40 p-4 border border-neon-pink/30 rounded-lg backdrop-blur">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStatus('selecting')} className="text-gray-500 hover:text-white">&larr; BACK</button>
                            <div>
                                <h2 className="text-2xl font-heading text-neon-pink">{JAVA_QUESTIONS[selectedQ].title}</h2>
                                <p className="text-gray-400 font-mono text-sm mt-1">{JAVA_QUESTIONS[selectedQ].description}</p>
                            </div>
                        </div>
                        <div className="font-mono text-neon-pink text-xl">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                    </div>

                    <div className="flex-1 flex gap-4 min-h-[500px]">
                        {/* Editor */}
                        <div className="flex-1 rounded-lg overflow-hidden border border-neon-pink/30 shadow-2xl">
                            <Editor
                                height="100%"
                                defaultLanguage="java"
                                theme="vs-dark"
                                value={code}
                                onChange={(val) => setCode(val || '')}
                                options={{
                                    fontSize: 14,
                                    fontFamily: "'Share Tech Mono', monospace",
                                    minimap: { enabled: false }
                                }}
                            />
                        </div>

                        {/* Terminal / Tests */}
                        <div className="w-1/3 flex flex-col gap-4">
                            <div className="flex-1 bg-black/90 border border-gray-700 rounded-lg p-4 font-mono text-sm text-green-400 overflow-y-auto font-bold shadow-inner">
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-1">{log}</div>
                                ))}
                            </div>

                            <div className="h-1/3 bg-gray-900 border border-gray-700 rounded-lg p-2 overflow-auto">
                                <h4 className="text-gray-500 text-xs mb-2 uppercase">Test Cases</h4>
                                {JAVA_QUESTIONS[selectedQ].test_cases?.map((tc, i) => {
                                    const res = testResults[i];
                                    return (
                                        <div key={i} className="flex justify-between items-center bg-black/50 p-2 mb-1 rounded border border-gray-800">
                                            <span className="text-gray-300 text-xs truncate max-w-[150px]">{tc.input}</span>
                                            {res ? (
                                                res.passed ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />
                                            ) : <span className="text-gray-600">...</span>}
                                        </div>
                                    )
                                })}
                            </div>

                            <button
                                onClick={runTests}
                                disabled={status === 'compiling' || status === 'testing' || status === 'success'}
                                className="cyber-button w-full border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black"
                            >
                                {status === 'success' ? 'SYSTEM SECURED' : 'COMPILE & RUN'}
                            </button>

                            {(status === 'success' || status === 'failed') && (
                                <button
                                    onClick={() => setPhase('dashboard')}
                                    className="cyber-button w-full border-white text-white hover:bg-white hover:text-black mt-4"
                                >
                                    RETURN TO BASE
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Round3Java;
