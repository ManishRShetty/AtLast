import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/types';
import { getLeaderboard } from '@/services/apiService';
import { Trophy, Medal, User, Globe, MapPin } from 'lucide-react';

export default function Leaderboard() {
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState<'GLOBAL' | 'INDIA'>('GLOBAL');

    useEffect(() => {
        async function fetchLB() {
            setLoading(true);
            try {
                const res = await getLeaderboard(region);
                setData(res);
            } catch (e) {
                console.error("Failed to load leaderboard", e);
            } finally {
                setLoading(false);
            }
        }
        fetchLB();
    }, [region]);

    return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full max-w-2xl mx-auto shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-bold text-white tracking-wider uppercase">Intelligence Rankings</h2>
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => setRegion('GLOBAL')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-widest transition-all flex items-center gap-2 ${region === 'GLOBAL'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Globe size={14} />
                        GLOBAL
                    </button>
                    <button
                        onClick={() => setRegion('INDIA')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-widest transition-all flex items-center gap-2 ${region === 'INDIA'
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <MapPin size={14} />
                        INDIA
                    </button>
                </div>
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
                                <th className="pb-3 text-right text-yellow-500/80">BEST</th>
                                <th className="pb-3 text-right pr-4">TOTAL</th>
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
                                    <td className="py-3 text-right font-mono text-yellow-500/80">{entry.best_mission || 0}</td>
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
