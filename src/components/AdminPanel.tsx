import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Lock, ShieldAlert, CheckCircle, XCircle, Trophy } from 'lucide-react';
import RoundScoreboard from './RoundScoreboard';

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const {
        score,
        teamName,
        setCompetitionStatus,
        competitionStatus,
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

    // Manual Tournament Management State
    const [teams, setTeams] = useState([
        { id: 1, name: 'TEAM 1', score: 0, status: 'playing' },
        { id: 2, name: 'TEAM 2', score: 0, status: 'playing' },
        { id: 3, name: 'TEAM 3', score: 0, status: 'playing' },
        { id: 4, name: 'TEAM 4', score: 0, status: 'playing' },
    ]);



    const updateTeamScore = (id: number, newScore: number) => {
        setTeams(prev => prev.map(t => t.id === id ? { ...t, score: newScore } : t));
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
            <div className="w-full max-w-5xl bg-gray-900 border border-cyan-500 rounded-xl p-8 shadow-[0_0_100px_rgba(0,240,255,0.2)] max-h-[90vh] overflow-y-auto">
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

                        {/* BANNED TEAMS WARNING */}
                        {(() => {
                            const banned = JSON.parse(localStorage.getItem('banned_users') || '[]');
                            if (banned && banned.length > 0) {
                                return (
                                    <div className="bg-red-950/30 border border-red-500/50 p-4 rounded-lg mb-8">
                                        <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                                            <ShieldAlert size={20} />
                                            BANNED USERS (TEAM NAMES)
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {banned.map((user: string) => (
                                                <span key={user} className="px-3 py-1 bg-red-900/50 border border-red-500 text-red-400 text-xs font-mono rounded">
                                                    {user}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (window.confirm("UNBAN all users?")) {
                                                    localStorage.removeItem('banned_users');
                                                    window.location.reload();
                                                }
                                            }}
                                            className="mt-3 text-[10px] text-red-500 underline hover:text-white"
                                        >
                                            [FLUSH BAN LIST]
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })()}

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
                                        onClick={() => {
                                            if (window.confirm('START the competition? All participants will be able to access the platform.')) {
                                                setCompetitionAccess(true);
                                            }
                                        }}
                                        disabled={competitionAccessEnabled}
                                        className={`px-6 py-3 font-bold tracking-widest border transition-all uppercase ${!competitionAccessEnabled
                                            ? 'bg-green-900/20 border-green-500 text-green-500 hover:bg-green-500 hover:text-black'
                                            : 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        ▶ START
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('STOP the competition? All participants will be blocked from accessing the platform.')) {
                                                setCompetitionAccess(false);
                                            }
                                        }}
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
                            <p className="text-gray-400 text-xs mb-4">
                                Manage scores and team status per round. Does not affect game state directly.
                            </p>
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
                                        Clear all localStorage and reload the page
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (window.confirm(
                                            '🔄 RESET EVERYTHING?\n\n' +
                                            'Are you absolutely sure?'
                                        )) {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    }}
                                    className="px-6 py-3 font-bold tracking-widest border bg-red-900/20 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all uppercase"
                                >
                                    🔄 RESET ALL
                                </button>
                            </div>
                        </div>

                        <div className="bg-black/50 p-6 rounded-lg border border-gray-700 mb-6">
                            <h3 className="text-cyan-500 font-mono mb-4 text-sm uppercase tracking-widest">Set Status (This Computer)</h3>

                            {competitionAccessEnabled && (
                                <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/50 rounded text-yellow-500 text-xs font-mono">
                                    ⚠️ Competition is ACTIVE - PROMOTE is disabled. Only DISQUALIFY is available.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        if (competitionAccessEnabled) {
                                            alert('❌ Cannot PROMOTE during active competition!');
                                            return;
                                        }
                                        if (window.confirm('PROMOTE this team?')) {
                                            setCompetitionStatus('promoted');
                                        }
                                    }}
                                    disabled={competitionAccessEnabled}
                                    className={`p-4 border rounded flex flex-col items-center gap-2 transition-all ${competitionAccessEnabled
                                        ? 'bg-gray-900 border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                                        : competitionStatus === 'promoted'
                                            ? 'bg-green-500/20 border-green-500 text-green-400'
                                            : 'border-gray-700 text-gray-500 hover:border-gray-500'
                                        }`}
                                >
                                    <CheckCircle size={24} />
                                    <span className="font-bold">PROMOTE</span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (window.confirm('🚨 DISQUALIFY this team?')) {
                                            setCompetitionStatus('eliminated');
                                        }
                                    }}
                                    className={`p-4 border rounded flex flex-col items-center gap-2 transition-all ${competitionStatus === 'eliminated'
                                        ? 'bg-red-500/20 border-red-500 text-red-400'
                                        : 'border-red-700 text-red-500 hover:border-red-500 hover:bg-red-900/20'
                                        }`}
                                >
                                    <XCircle size={24} />
                                    <span className="font-bold">DISQUALIFY</span>
                                </button>

                                <button
                                    onClick={() => setCompetitionStatus('playing')}
                                    className="p-4 border rounded flex flex-col items-center gap-2 transition-all border-gray-700 text-gray-500 hover:border-gray-500"
                                >
                                    <Lock size={24} />
                                    <span className="font-bold">RESET STATUS</span>
                                </button>
                                <button
                                    onClick={() => setCompetitionStatus('waiting')}
                                    className="p-4 border rounded flex flex-col items-center gap-2 transition-all border-gray-700 text-gray-500 hover:border-gray-500"
                                >
                                    <Lock size={24} />
                                    <span className="font-bold">LOCK / WAIT</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // TOURNAMENT SCOREBOARD (Manual)
                    <div className="space-y-6">
                        <div className="bg-yellow-900/10 border border-yellow-900/30 p-3 rounded text-yellow-600 text-xs italic font-mono text-center">
                            MANUAL TRACKER: Use this to track progress of all teams locally.
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {teams.map((t) => (
                                <div key={t.id} className="p-4 rounded border border-gray-700 bg-gray-900 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="font-bold text-white text-lg">{t.name}</div>
                                        <div className="text-xs font-mono text-gray-500 uppercase">{t.status}</div>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Round Scoreboard Modal */}
            {activeRoundScoreboard && (
                <RoundScoreboard
                    roundName={activeRoundScoreboard.name}
                    roundNumber={activeRoundScoreboard.number}
                    maxScore={activeRoundScoreboard.maxScore}
                    onClose={() => setActiveRoundScoreboard(null)}
                />
            )}
        </div>
    );
};

export default AdminPanel;
