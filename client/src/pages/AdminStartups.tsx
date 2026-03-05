import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Startup } from '../types';

export default function AdminStartups() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const load = (status?: string) => {
        setLoading(true);
        api.getAdminStartups(status !== 'all' ? status : undefined).then(setStartups).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { load(filter); }, [filter]);

    const updateStatus = async (id: number, status: string) => {
        try {
            await api.updateStartupStatus(id, { status });
            load(filter);
        } catch { }
    };

    const toggleFeatured = async (id: number, featured: boolean) => {
        try {
            await api.updateStartupStatus(id, { featured });
            load(filter);
        } catch { }
    };

    const formatCurrency = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;
    const statusColors: Record<string, string> = { pending: 'badge-warning', live: 'badge-success', approved: 'badge-info', rejected: 'badge-danger', closed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Startup Management</h1>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'pending', 'live', 'approved', 'rejected', 'closed'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${filter === s ? 'bg-accent-500 text-white' : 'bg-gray-100 dark:bg-navy-400 text-[var(--color-text-secondary)]'}`}>{s}</button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-navy-400 rounded-2xl animate-pulse" />)}</div>
            ) : startups.length === 0 ? (
                <div className="text-center py-20"><p className="text-[var(--color-text-secondary)]">No startups found for this filter</p></div>
            ) : (
                <div className="space-y-4">
                    {startups.map(s => (
                        <div key={s.id} className="stat-card !p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center text-lg font-bold text-accent-500">{s.name.charAt(0)}</div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-[var(--color-text)]">{s.name}</h3>
                                            <span className={`badge ${statusColors[s.status] || 'badge-info'}`}>{s.status}</span>
                                            {s.featured ? <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">⭐ Featured</span> : null}
                                        </div>
                                        <p className="text-sm text-[var(--color-text-secondary)]">{s.tagline} · {s.sector} · by {s.founder_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right mr-4 hidden sm:block">
                                        <p className="text-xs text-[var(--color-text-secondary)]">Raise</p>
                                        <p className="font-mono font-semibold text-sm">{formatCurrency(s.raised_amount)} / {formatCurrency(s.target_raise)}</p>
                                    </div>
                                    {s.status === 'pending' && (
                                        <>
                                            <button onClick={() => updateStatus(s.id, 'live')} className="btn-success text-xs !py-1.5 !px-3">Approve & Go Live</button>
                                            <button onClick={() => updateStatus(s.id, 'rejected')} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 font-medium">Reject</button>
                                        </>
                                    )}
                                    {s.status === 'live' && (
                                        <>
                                            <button onClick={() => toggleFeatured(s.id, !s.featured)} className="btn-secondary text-xs !py-1.5 !px-3">{s.featured ? 'Unfeature' : '⭐ Feature'}</button>
                                            <button onClick={() => updateStatus(s.id, 'closed')} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-navy-400 text-[var(--color-text-secondary)] hover:bg-gray-200 font-medium">Close</button>
                                        </>
                                    )}
                                    {s.status === 'rejected' && (
                                        <button onClick={() => updateStatus(s.id, 'live')} className="btn-success text-xs !py-1.5 !px-3">Re-approve</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
