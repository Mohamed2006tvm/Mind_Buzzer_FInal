import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define Types
export type GamePhase = 'login' | 'dashboard' | 'coding' | 'react' | 'results' | 'leaderboard';

export interface Question {
    id: string | number;
    title: string;
    buggy_code?: string;
    starter_code?: string;
    expected_output?: string;
    description?: string;
    hint?: string;
    language?: 'python';
    success_condition?: string; // For React round
    test_cases?: { input: string; output: string }[];
}

interface GameState {
    teamName: string;
    score: number;
    phase: GamePhase;

    // Round 1: Mixed Coding (Python, Java, JS)
    codingQuestionIndex: number;
    codingCompleted: boolean;
    codingScore: number;
    codingSolvedCount: number; // Track how many questions solved

    // Round 2: React Debugging
    reactUnlocked: boolean;
    reactCompleted: boolean;
    reactQuestionIndex: number;
    reactScore: number;
    reactSolvedCount: number; // Track how many questions solved

    // Round 2 Config
    round2Mode: 'java' | 'react' | null;

    // Timer
    timeLeft: number;
    timerActive: boolean;

    // Competition Status
    competitionStatus: 'playing' | 'waiting' | 'promoted' | 'eliminated' | 'banned';
    roundInProgress: boolean;
    competitionAccessEnabled: boolean;
    cheated: boolean;

    // Actions
    setTeamName: (name: string) => void;
    setPhase: (phase: GamePhase) => void;
    addScore: (points: number, round: 'coding' | 'react') => void;

    // Coding Round Actions
    nextCodingQuestion: () => void;
    incrementCodingSolved: () => void;
    markCodingComplete: () => void;

    // React Round Actions
    unlockReact: () => void;
    nextReactQuestion: () => void;
    incrementReactSolved: () => void;
    markReactComplete: () => void;

    // Round 2 Actions
    setRound2Mode: (mode: 'java' | 'react') => void;
    markJavaComplete: () => void;

    // Cheat
    setCheated: (cheated: boolean) => void;


    // Timer & Status
    setRoundInProgress: (inProgress: boolean) => void;
    setCompetitionAccess: (enabled: boolean) => void;
    setTimer: (seconds: number) => void;
    tickTimer: () => void;
    stopTimer: () => void;
    resetGame: () => void;
    setCompetitionStatus: (status: 'playing' | 'waiting' | 'promoted' | 'eliminated' | 'banned') => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            teamName: '',
            score: 0,
            phase: 'login',
            competitionStatus: 'playing',

            // Initial State for Rounds
            codingQuestionIndex: 0,
            codingCompleted: false,
            codingScore: 0,
            codingSolvedCount: 0,

            reactUnlocked: false, // Locked initially
            reactCompleted: false,
            reactQuestionIndex: 0,
            reactScore: 0,
            reactSolvedCount: 0,
            round2Mode: null,

            timeLeft: 0,
            timerActive: false,
            roundInProgress: false,
            competitionAccessEnabled: true,
            cheated: false,

            // Actions
            setTeamName: (name) => set({ teamName: name }),
            setPhase: (phase) => set({ phase }),

            addScore: (points, round) => set((state) => {
                const newScore = state.score + points;
                if (round === 'coding') return { score: newScore, codingScore: state.codingScore + points };
                if (round === 'react') return { score: newScore, reactScore: state.reactScore + points };
                return { score: newScore };
            }),

            // Coding Round Logic
            nextCodingQuestion: () => set((state) => ({ codingQuestionIndex: state.codingQuestionIndex + 1 })),
            incrementCodingSolved: () => set((state) => ({ codingSolvedCount: state.codingSolvedCount + 1 })),
            markCodingComplete: () => set({ codingCompleted: true, roundInProgress: false, reactUnlocked: true }), // Unlocks Round 2

            // React Round Logic
            unlockReact: () => set({ reactUnlocked: true }),
            nextReactQuestion: () => set((state) => ({ reactQuestionIndex: state.reactQuestionIndex + 1 })),
            incrementReactSolved: () => set((state) => ({ reactSolvedCount: state.reactSolvedCount + 1 })),
            markReactComplete: () => set({ reactCompleted: true, roundInProgress: false }),

            setRound2Mode: (mode) => set({ round2Mode: mode }),
            markJavaComplete: () => set({ reactCompleted: true, roundInProgress: false }), // Reuse reactCompleted flag or add javaCompleted if needed

            setCheated: (cheated) => {
                // If cheated, set status to banned
                set({ cheated, competitionStatus: 'banned' });
            },

            setRoundInProgress: (inProgress) => set({ roundInProgress: inProgress }),
            setCompetitionAccess: (enabled) => {
                localStorage.setItem('COMPETITION_ACCESS', enabled ? 'ENABLED' : 'DISABLED');
                set({ competitionAccessEnabled: enabled });
            },

            setTimer: (seconds) => set({ timeLeft: seconds, timerActive: true }),
            tickTimer: () => set((state) => {
                if (state.timeLeft <= 0) return { timeLeft: 0, timerActive: false };
                return { timeLeft: state.timeLeft - 1 };
            }),
            stopTimer: () => set({ timerActive: false }),

            setCompetitionStatus: (status) => set({ competitionStatus: status }),

            resetGame: () => {
                // reset state first
                set({
                    teamName: '',
                    score: 0,
                    phase: 'login',
                    competitionStatus: 'playing',
                    codingQuestionIndex: 0,
                    codingCompleted: false,
                    codingScore: 0,
                    codingSolvedCount: 0,
                    reactUnlocked: false,
                    reactCompleted: false,
                    reactQuestionIndex: 0,
                    reactScore: 0,
                    reactSolvedCount: 0,
                    round2Mode: null,
                    timeLeft: 0,
                    timerActive: false,
                    roundInProgress: false,
                    competitionAccessEnabled: false,
                    cheated: false
                });

                // Clear persistence
                setTimeout(() => {
                    localStorage.clear();
                    window.location.reload();
                }, 100);
            }
        }),
        {
            name: 'mind-buzzer-storage',
            partialize: (state) => ({
                teamName: state.teamName,
                score: state.score,
                phase: state.phase,
                competitionStatus: state.competitionStatus,
                codingQuestionIndex: state.codingQuestionIndex,
                codingCompleted: state.codingCompleted,
                codingScore: state.codingScore,
                codingSolvedCount: state.codingSolvedCount,
                reactUnlocked: state.reactUnlocked,
                reactCompleted: state.reactCompleted,
                reactQuestionIndex: state.reactQuestionIndex,
                reactScore: state.reactScore,
                reactSolvedCount: state.reactSolvedCount,
                round2Mode: state.round2Mode,
                competitionAccessEnabled: state.competitionAccessEnabled,
                cheated: state.cheated
            })
        }
    )
);
