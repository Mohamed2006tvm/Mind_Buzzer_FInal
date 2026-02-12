import React from 'react';
import { useGameStore } from '../store/gameStore';

const Leaderboard: React.FC = () => {
    const { setPhase, score, teamName } = useGameStore();

    // Consolidate Scores from LocalStorage
    const round1 = JSON.parse(localStorage.getItem('round1_teams') || '[]');
    const round2 = JSON.parse(localStorage.getItem('round2_teams') || '[]');

    const teamScores: Record<string, { name: string, r1: number, r2: number, total: number, status: string }> = {};

    // Process Round 1
    round1.forEach((t: any) => {
        if (!teamScores[t.name]) teamScores[t.name] = { name: t.name, r1: 0, r2: 0, total: 0, status: 'PENDING' };
        teamScores[t.name].r1 = t.score || 0;
        teamScores[t.name].total += t.score || 0;
        teamScores[t.name].status = t.status || 'PENDING';
    });

    // Process Round 2
    round2.forEach((t: any) => {
        if (!teamScores[t.name]) teamScores[t.name] = { name: t.name, r1: 0, r2: 0, total: 0, status: 'PENDING' };
        teamScores[t.name].r2 = t.score || 0;
        teamScores[t.name].total += (t.score || 0);
        // Status from R2 overrides R1 if set
        if (t.status) teamScores[t.name].status = t.status;
    });

    // Add Current User Live if not in storage yet (e.g. playing)
    if (teamName && !teamScores[teamName]) {
        teamScores[teamName] = { name: teamName, r1: 0, r2: 0, total: score, status: 'PLAYING' };
    } else if (teamName && teamScores[teamName]) {
        // Update total with live score if it's potentially higher/different?
        // Actually, store is source of truth for current user.
        // Let's trust local storage for "Submitted" rounds, but maybe show current score?
        // Simpler: Just rely on what's in storage + current state
    }

    const allData = Object.values(teamScores).sort((a, b) => b.total - a.total);

    return (
        <div className="w-full max-w-4xl p-8 flex flex-col items-center gap-8 relative z-20">
            <h1 className="text-4xl font-heading text-yellow-400 tracking-widest drop-shadow-lg">GLOBAL RANKINGS</h1>

            <div className="w-full bg-black/60 border border-yellow-500/30 rounded-xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-yellow-500/10 text-yellow-500 uppercase font-mono text-sm border-b border-yellow-500/20">
                            <th className="p-4">Rank</th>
                            <th className="p-4">Team Identity</th>
                            <th className="p-4 text-center">R1</th>
                            <th className="p-4 text-center">R2</th>
                            <th className="p-4 text-center">Total</th>
                            <th className="p-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 font-mono">
                        {allData.map((t, i) => (
                            <tr key={i} className={`border-b border-gray-800 hover:bg-white/5 transition-colors ${t.name === teamName ? 'bg-neon-cyan/10' : ''} ${i < 3 ? 'shadow-[inset_0_0_20px_rgba(255,215,0,0.1)]' : ''}`}>
                                <td className={`p-4 font-bold ${i === 0 ? 'text-yellow-400 text-xl' : i === 1 ? 'text-gray-300 text-lg' : i === 2 ? 'text-orange-400 text-lg' : 'text-gray-500'}`}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                </td>
                                <td className={`p-4 font-bold ${t.name === teamName ? 'text-neon-cyan' : 'text-white'}`}>{t.name} {t.name === teamName && '(YOU)'}</td>
                                <td className="p-4 text-center text-gray-500">{t.r1}</td>
                                <td className="p-4 text-center text-gray-500">{t.r2}</td>
                                <td className="p-4 text-center font-bold text-yellow-400">{t.total}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs ${t.status === 'QUALIFIED' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button onClick={() => setPhase('dashboard')} className="cyber-button w-48 text-yellow-400 border-yellow-400 hover:bg-yellow-400">
                CLOSE
            </button>
        </div>
    );
};

export default Leaderboard;
