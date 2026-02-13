import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
// import { supabase } from '../lib/supabase';
import { Crown, Trophy, Medal } from 'lucide-react';

interface Team {
    name: string;
    score: number;
    status: string;
}

const Leaderboard: React.FC = () => {
    const { setPhase, teamName } = useGameStore();
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchLeaderboard = () => {
            try {
                const raw1 = localStorage.getItem('round1_teams');
                // Could also merge with round2 if available
                const data = raw1 ? JSON.parse(raw1) : [];

                // Sort by score
                // Cast to Team interface
                const sorted: Team[] = data
                    .map((t: any) => ({
                        name: t.name,
                        score: t.score || 0,
                        status: t.status || 'playing'
                    }))
                    .sort((a: Team, b: Team) => b.score - a.score);

                setTeams(sorted);
            } catch (e) {
                console.error("Failed to load leaderboard");
            }
        };

        fetchLeaderboard();

        // Poll every few seconds to simulate realtime
        const interval = setInterval(fetchLeaderboard, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-4xl p-8 flex flex-col items-center gap-8 relative z-20">
            <h1 className="text-4xl font-heading text-yellow-400 tracking-widest drop-shadow-lg flex items-center gap-4">
                <Trophy size={40} className="text-yellow-500" />
                GLOBAL RANKINGS
            </h1>

            <div className="w-full bg-black/60 border border-yellow-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(255,215,0,0.15)]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-yellow-900/20 text-yellow-500 uppercase font-mono text-sm border-b border-yellow-500/20">
                            <th className="p-4 w-24 text-center">Rank</th>
                            <th className="p-4">Team Identity</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Total Score</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 font-mono">
                        {teams.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                                    INITIALIZING UPLINK...
                                </td>
                            </tr>
                        ) : (
                            teams.map((t, i) => (
                                <tr
                                    key={i}
                                    className={`border-b border-gray-800 hover:bg-white/5 transition-colors 
                                        ${t.name === teamName ? 'bg-cyan-900/20 border-cyan-500/30' : ''}
                                        ${i === 0 ? 'bg-yellow-900/10' : ''}
                                    `}
                                >
                                    <td className="p-4 text-center py-6">
                                        {i === 0 ? <Crown size={24} className="mx-auto text-yellow-400" /> :
                                            i === 1 ? <Medal size={24} className="mx-auto text-gray-300" /> :
                                                i === 2 ? <Medal size={24} className="mx-auto text-orange-400" /> :
                                                    <span className="text-gray-500 font-bold">#{i + 1}</span>}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-lg flex items-center gap-2">
                                            <span className={t.name === teamName ? 'text-cyan-400' : 'text-white'}>
                                                {t.name}
                                            </span>
                                            {t.name === teamName &&
                                                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30">YOU</span>
                                            }
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs border ${t.status === 'promoted' ? 'border-green-500 text-green-400 bg-green-900/20' :
                                            t.status === 'eliminated' ? 'border-red-500 text-red-400 bg-red-900/20' :
                                                t.status === 'banned' ? 'border-red-600 text-red-600 bg-black line-through' :
                                                    'border-gray-600 text-gray-400'
                                            }`}>
                                            {t.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="font-bold text-2xl text-yellow-400 font-display tracking-wider">
                                            {t.score}
                                        </span>
                                        <span className="text-gray-600 text-xs ml-1">PTS</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <button onClick={() => setPhase('dashboard')} className="px-8 py-3 bg-black border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all font-bold tracking-widest rounded shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                CLOSE RANKINGS
            </button>
        </div>
    );
};

export default Leaderboard;
