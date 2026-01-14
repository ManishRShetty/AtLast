import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/types';
import { getLeaderboard } from '@/services/apiService';
import { Trophy, Medal, User } from 'lucide-react';

export default function Leaderboard() {
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLB() {
            try {
                const res = await getLeaderboard();
                setData(res);
            } catch (e) {
                console.error("Failed to load leaderboard", e);
            } finally {
                setLoading(false);
            }
        }
        fetchLB();
    }, []);

    return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white tracking-wider uppercase">Global Intelligence Rankings</h2>
            </div>

            {loading ? (
                <div className="text-center py-8 text-green-500/50 animate-pulse font-mono">
                    DECRYPTING DATABASE...
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 font-mono">
                    NO INTELLIGENCE GATHERED YET.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-mono">
                        <thead>
                            <tr className="text-zinc-500 border-b border-white/5">
                                <th className="pb-3 pl-4">RANK</th>
                                <th className="pb-3">AGENT ID</th>
                                <th className="pb-3 text-right">OPS</th>
                                <th className="pb-3 text-right pr-4">SCORE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.map((entry, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-3 pl-4 font-bold text-zinc-400 group-hover:text-white">
                                        {idx === 0 ? <Medal className="w-4 h-4 text-yellow-500" /> :
                                            idx === 1 ? <Medal className="w-4 h-4 text-gray-400" /> :
                                                idx === 2 ? <Medal className="w-4 h-4 text-amber-700" /> :
                                                    `#${idx + 1}`}
                                    </td>
                                    <td className="py-3 text-white flex items-center gap-2">
                                        <User className="w-3 h-3 text-indigo-400" />
                                        {entry.username}
                                    </td>
                                    <td className="py-3 text-right text-zinc-400">{entry.games_played}</td>
                                    <td className="py-3 text-right pr-4 font-bold text-green-400">{entry.total_score.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
