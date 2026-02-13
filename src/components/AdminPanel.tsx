import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { ShieldAlert, Trophy, Trash2 } from 'lucide-react';
// import { supabase } from '../lib/supabase';
import RoundScoreboard from './RoundScoreboard';

interface Team {
    id: number;
    name: string;
    score: number;
    status: 'playing' | 'promoted' | 'eliminated' | 'waiting' | 'banned';
    coding_completed: boolean;
    react_completed: boolean;
}

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const {
        score,
        teamName,
        competitionAccessEnabled,
        setCompetitionAccess
    } = useGameStore();

    const [password, setPassword] = useState('');
    const [access, setAccess] = useState(false);
    const [tab, setTab] = useState<'control' | 'tournament'>('control');
    const [activeRoundScoreboard, setActiveRoundScoreboard] = useState<{
        name: string;
        number: number;
        maxScore: number;
    } | null>(null);

    const [teams, setTeams] = useState<Team[]>([]);

    // Local Storage Data Management
    // We will aggregate data from 'round1_teams' and 'round2_teams' etc.
    // For the main scoreboard, we can just look at 'round1_teams' for now or a merged view.

    const refreshTeams = () => {
        try {
            const raw1 = localStorage.getItem('round1_teams');
            // const raw2 = localStorage.getItem('round2_teams');
            const data1 = raw1 ? JSON.parse(raw1) : [];
            // Map to Team interface
            // Note: round1_teams structure might be slightly different [ { name, score, time } ]
            // We adapt it here.

            const adaptedTeams: Team[] = data1.map((t: any, idx: number) => ({
                id: idx, // generate a temporary ID
                name: t.name,
                score: t.score,
                status: t.status || 'playing', // We might need to guess status or add it to storage
                coding_completed: true,
                react_completed: false
            })).sort((a: Team, b: Team) => b.score - a.score);

            setTeams(adaptedTeams);
        } catch (e) {
            console.error("Failed to parse local teams", e);
        }
    };

    // Poll for updates (since we don't have realtime subscription anymore)
    useEffect(() => {
        if (!access) return;
        refreshTeams();
        const interval = setInterval(refreshTeams, 2000);
        return () => clearInterval(interval);
    }, [access]);

    const updateTeamScore = async (id: number, newScore: number) => {
        // Update in localStorage
        // This is tricky because we generated IDs on the fly.
        // We find by name.
        const teamToUpdate = teams.find(t => t.id === id);
        if (!teamToUpdate) return;

        const raw1 = localStorage.getItem('round1_teams');
        if (raw1) {
            const data1 = JSON.parse(raw1);
            const index = data1.findIndex((t: any) => t.name === teamToUpdate.name);
            if (index !== -1) {
                data1[index].score = newScore;
                localStorage.setItem('round1_teams', JSON.stringify(data1));
                refreshTeams();
            }
        }
    };

    const deleteTeam = async (id: number) => {
        if (window.confirm("Are you sure you want to DELETE this team?")) {
            const teamToDelete = teams.find(t => t.id === id);
            if (!teamToDelete) return;

            const raw1 = localStorage.getItem('round1_teams');
            if (raw1) {
                const data1 = JSON.parse(raw1);
                const newData = data1.filter((t: any) => t.name !== teamToDelete.name);
                localStorage.setItem('round1_teams', JSON.stringify(newData));
                refreshTeams();
            }
        }
    };

    const resetAllTeams = async () => {
        if (window.confirm("RESET scores and status for ALL teams?")) {
            if (window.confirm("This will WIPE all localStorage data. Are you sure?")) {
                localStorage.clear(); // Wipes everything including config
                window.location.reload();
            }
        }
    };

    // Global toggle
    const toggleCompetitionAccess = async (enabled: boolean) => {
        const confirmMsg = enabled
            ? 'START the competition? All participants will be able to access the platform.'
            : 'STOP the competition? All participants will be blocked from accessing the platform.';

        if (window.confirm(confirmMsg)) {
            setCompetitionAccess(enabled);
            // setCompetitionAccess in store already persists to localStorage
        }
    };


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'ADMIN') {
            setAccess(true);
        }
    };

    if (!access) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center">
                <div className="bg-black border border-red-500 p-8 rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.5)] text-center">
                    <ShieldAlert size={48} className="text-red-500 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-2xl font-display text-red-500 mb-4">RESTRICTED ACCESS</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            className="bg-gray-900 border border-red-900 text-red-500 p-2 text-center font-mono outline-none focus:border-red-500 w-full mb-4"
                            placeholder="ENTER UPLINK CODE"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-700 text-gray-500 hover:bg-gray-800">CANCEL</button>
                            <button type="submit" className="flex-1 py-2 bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all">ACCESS</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-gray-900 border border-cyan-500 rounded-xl p-8 shadow-[0_0_100px_rgba(0,240,255,0.2)] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <div className="flex gap-6 items-baseline">
                        <h2 className="text-3xl font-display text-cyan-400">ADMIN CONSOLE</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTab('control')}
                                className={`text-sm tracking-widest px-3 py-1 rounded transition-colors ${tab === 'control' ? 'bg-cyan-900 text-cyan-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                [ LIVE CONTROL ]
                            </button>
                            <button
                                onClick={() => setTab('tournament')}
                                className={`text-sm tracking-widest px-3 py-1 rounded transition-colors ${tab === 'tournament' ? 'bg-cyan-900 text-cyan-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                [ SCOREBOARD ]
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white font-mono">[CLOSE PANEL]</button>
                </div>

                {tab === 'control' ? (
                    <>
                        {/* LIVE CONTROL PANEL */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="bg-black p-4 rounded border border-gray-700 relative group">
                                <label className="text-gray-500 text-xs font-mono">TARGET ID (THIS COMPUTER)</label>
                                <div className="text-2xl text-white font-bold truncate" title={teamName}>{teamName || 'NO ACTIVE SESSION'}</div>
                            </div>
                            <div className="bg-black p-4 rounded border border-gray-700">
                                <label className="text-gray-500 text-xs font-mono">CURRENT SCORE</label>
                                <div className="text-2xl text-yellow-400 font-bold">{score} PTS</div>
                            </div>
                        </div>

                        {/* GLOBAL COMPETITION CONTROL */}
                        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 rounded-lg border-2 border-purple-500/50 mb-6">
                            <h3 className="text-purple-400 font-mono mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                                <ShieldAlert size={16} />
                                Global Competition Control
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-bold mb-1">
                                        Competition Status: {competitionAccessEnabled ?
                                            <span className="text-green-500">🟢 ACTIVE</span> :
                                            <span className="text-red-500">🔴 STOPPED</span>
                                        }
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {competitionAccessEnabled ?
                                            'All participants can access the platform' :
                                            'Access is blocked for all participants'}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => toggleCompetitionAccess(true)}
                                        disabled={competitionAccessEnabled}
                                        className={`px-6 py-3 font-bold tracking-widest border transition-all uppercase ${!competitionAccessEnabled
                                            ? 'bg-green-900/20 border-green-500 text-green-500 hover:bg-green-500 hover:text-black'
                                            : 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        ▶ START
                                    </button>
                                    <button
                                        onClick={() => toggleCompetitionAccess(false)}
                                        disabled={!competitionAccessEnabled}
                                        className={`px-6 py-3 font-bold tracking-widest border transition-all uppercase ${competitionAccessEnabled
                                            ? 'bg-red-900/20 border-red-500 text-red-500 hover:bg-red-500 hover:text-black'
                                            : 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        ⏹ STOP
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ROUND SCOREBOARDS */}
                        <div className="bg-gradient-to-r from-cyan-900/10 to-blue-900/10 p-6 rounded-lg border-2 border-cyan-500/30 mb-6">
                            <h3 className="text-cyan-400 font-mono mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                                <Trophy size={16} />
                                Round Scoreboards
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setActiveRoundScoreboard({ name: 'LOGIC LEGENDS', number: 1, maxScore: 600 })}
                                    className="p-4 bg-green-900/20 border-2 border-green-500/50 rounded-lg hover:border-green-500 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)] transition-all group"
                                >
                                    <div className="text-3xl mb-2">🐍</div>
                                    <h4 className="text-green-400 font-bold mb-1">ROUND 1: CODE</h4>
                                    <p className="text-gray-500 text-xs text-center">Python • Java • JS</p>
                                </button>

                                <button
                                    onClick={() => setActiveRoundScoreboard({ name: 'REACT RESCUE', number: 2, maxScore: 500 })}
                                    className="p-4 bg-blue-900/20 border-2 border-blue-500/50 rounded-lg hover:border-blue-500 hover:shadow-[0_0_20px_rgba(0,100,255,0.2)] transition-all group"
                                >
                                    <div className="text-3xl mb-2">⚛️</div>
                                    <h4 className="text-blue-400 font-bold mb-1">ROUND 2: REACT</h4>
                                    <p className="text-gray-500 text-xs text-center">Web Debugging</p>
                                </button>
                            </div>
                        </div>

                        {/* RESET ALL BUTTON */}
                        <div className="bg-red-900/10 p-6 rounded-lg border-2 border-red-500/30 mb-6">
                            <h3 className="text-red-400 font-mono mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                                ⚠️ Danger Zone
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-bold mb-1">Reset Everything</p>
                                    <p className="text-gray-400 text-xs">
                                        Clear all database scores and reset status to 'playing'
                                    </p>
                                </div>
                                <button
                                    onClick={resetAllTeams}
                                    className="px-6 py-3 font-bold tracking-widest border bg-red-900/20 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all uppercase"
                                >
                                    🔄 RESET ALL
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // TOURNAMENT SCOREBOARD (Live from Supabase)
                    <div className="space-y-6">
                        <div className="bg-green-900/10 border border-green-900/30 p-3 rounded text-green-500 text-xs italic font-mono text-center">
                            LIVE DATABASE CONNECTION ACTIVE
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {teams.length === 0 ? (
                                <div className="text-center p-8 text-gray-500 font-mono">NO TEAMS FOUND</div>
                            ) : teams.map((t) => (
                                <div key={t.id} className="p-4 rounded border border-gray-700 bg-gray-900 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="font-bold text-white text-lg">{t.name}</div>
                                        <div className={`text-xs font-mono uppercase px-2 py-1 rounded border ${t.status === 'promoted' ? 'border-green-500 text-green-500 bg-green-900/20' :
                                            t.status === 'eliminated' ? 'border-red-500 text-red-500 bg-red-900/20' :
                                                'border-gray-500 text-gray-400'
                                            }`}>{t.status}</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <label className="text-[10px] text-gray-500 font-mono">SCORE</label>
                                            <input
                                                type="number"
                                                value={t.score}
                                                onChange={(e) => updateTeamScore(t.id, parseInt(e.target.value) || 0)}
                                                className="bg-black border border-gray-700 w-20 text-right p-1 text-cyan-400 font-bold outline-none"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            {/* Admin features removed as requested - Scoreboard only */}
                                            <button onClick={() => deleteTeam(t.id)} className="text-red-700 hover:bg-red-900/20 p-2 rounded border border-transparent hover:border-red-700" title="Delete Team">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Round Scoreboard Modal */}
            {
                activeRoundScoreboard && (
                    <RoundScoreboard
                        roundName={activeRoundScoreboard.name}
                        roundNumber={activeRoundScoreboard.number}
                        maxScore={activeRoundScoreboard.maxScore}
                        onClose={() => setActiveRoundScoreboard(null)}
                    />
                )
            }
        </div >
    );
};

export default AdminPanel;

