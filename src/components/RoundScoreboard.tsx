import React, { useState, useEffect } from 'react';
import { Crown, CheckCircle, XCircle, RotateCcw, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Team {
    id: number;
    name: string;
    score: number;
    status: 'playing' | 'promoted' | 'eliminated' | 'waiting' | 'banned';
}

interface RoundScoreboardProps {
    roundName: string;
    roundNumber: number;
    maxScore: number;
    onClose: () => void;
}

const RoundScoreboard: React.FC<RoundScoreboardProps> = ({ roundName, roundNumber, maxScore, onClose }) => {
    // Supabase Teams State
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const { data } = await supabase.from('teams').select('*').order('score', { ascending: false });
            if (data) setTeams(data as Team[]);
        };

        fetchTeams();

        const channel = supabase
            .channel(`scoreboard_${roundNumber}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
                fetchTeams();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [roundNumber]);


    /* ADMIN ACTIONS */
    const updateTeamScore = async (id: number, newScore: number) => {
        const safeScore = Math.max(0, Math.min(newScore, maxScore));
        await supabase.from('teams').update({ score: safeScore }).eq('id', id);
    };

    const updateTeamStatus = async (id: number, status: string) => {
        await supabase.from('teams').update({ status }).eq('id', id);
    };

    const deleteTeam = async (id: number) => {
        if (window.confirm('Delete this team?')) {
            await supabase.from('teams').delete().eq('id', id);
        }
    };


    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'promoted': return 'text-green-500 bg-green-900/20 border-green-500';
            case 'eliminated': return 'text-red-500 bg-red-900/20 border-red-500';
            case 'waiting': return 'text-yellow-500 bg-yellow-900/20 border-yellow-500';
            default: return 'text-cyan-500 bg-cyan-900/20 border-cyan-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'promoted': return <CheckCircle size={16} />;
            case 'eliminated': return <XCircle size={16} />;
            case 'waiting': return <RotateCcw size={16} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-gray-900 border-2 border-cyan-500 rounded-xl p-8 shadow-[0_0_100px_rgba(0,240,255,0.3)] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <div>
                        <h2 className="text-3xl font-display text-cyan-400 mb-2">
                            {roundName} SCOREBOARD
                        </h2>
                        <p className="text-gray-400 text-sm font-mono">
                            Round {roundNumber} • Max Score: {maxScore} pts
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-all font-mono"
                    >
                        [CLOSE]
                    </button>
                </div>

                {/* Teams List */}
                <div className="space-y-4">
                    {teams.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-lg">
                            <p className="text-gray-500 font-mono">NO TEAMS REGISTERED</p>
                        </div>
                    ) : (
                        sortedTeams.map((team, index) => (
                            <div
                                key={team.id}
                                className={`bg-black/60 border-2 rounded-lg p-6 transition-all ${index === 0 ? 'border-yellow-500 shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'border-gray-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    {/* Rank & Team Name */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${index === 0 ? 'bg-yellow-500 text-black' :
                                            index === 1 ? 'bg-gray-400 text-black' :
                                                index === 2 ? 'bg-orange-600 text-white' :
                                                    'bg-gray-700 text-gray-400'
                                            }`}>
                                            {index === 0 ? <Crown size={24} /> : `#${index + 1}`}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white max-w-[200px] truncate" title={team.name}>{team.name}</h3>
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border ${getStatusColor(team.status)}`}>
                                                {getStatusIcon(team.status)}
                                                <span>{team.status.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score Input */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <label className="text-gray-500 text-xs font-mono block mb-1">SCORE</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max={maxScore}
                                                value={team.score}
                                                onChange={(e) => updateTeamScore(team.id, parseInt(e.target.value) || 0)}
                                                className="w-24 bg-gray-800 border border-gray-600 text-yellow-400 text-2xl font-bold text-center p-2 rounded focus:border-cyan-500 focus:outline-none"
                                            />
                                            <p className="text-gray-600 text-xs mt-1">/ {maxScore}</p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateTeamStatus(team.id, 'promoted')}
                                                    disabled={team.status === 'promoted'}
                                                    className={`flex-1 px-3 py-2 border rounded text-xs font-bold transition-all ${team.status === 'promoted'
                                                        ? 'bg-green-900/20 border-green-500 text-green-500 cursor-not-allowed'
                                                        : 'border-gray-700 text-gray-500 hover:border-green-500 hover:text-green-500'
                                                        }`}
                                                    title="Promote Team"
                                                >
                                                    <CheckCircle size={14} className="mx-auto" />
                                                </button>
                                                <button
                                                    onClick={() => updateTeamStatus(team.id, 'eliminated')}
                                                    disabled={team.status === 'eliminated'}
                                                    className={`flex-1 px-3 py-2 border rounded text-xs font-bold transition-all ${team.status === 'eliminated'
                                                        ? 'bg-red-900/20 border-red-500 text-red-500 cursor-not-allowed'
                                                        : 'border-gray-700 text-gray-500 hover:border-red-500 hover:text-red-500'
                                                        }`}
                                                    title="Disqualify Team"
                                                >
                                                    <XCircle size={14} className="mx-auto" />
                                                </button>
                                                <button
                                                    onClick={() => deleteTeam(team.id)}
                                                    className="px-3 py-2 border border-gray-700 text-gray-500 hover:border-red-500 hover:text-red-500 rounded transition-all"
                                                    title="Remove Team"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoundScoreboard;


