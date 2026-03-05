import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Startup, Notification } from '../types';
import { useAuth } from '../context/AuthContext';

export default function FounderDashboard() {
    const { user } = useAuth();
    const [startups, setStartups] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.getFounderStartups(), api.getNotifications()])
            .then(([s, n]) => { setStartups(s); setNotifications(n.notifications || []); })
            .catch(() => { }).finally(() => setLoading(false));
    }, []);

    const statusColors: Record<string, string> = {
        pending: 'badge-warning', approved: 'badge-info', live: 'badge-success', rejected: 'badge-danger', closed: 'bg-gray-100 text-gray-600',
    };

    const formatCurrency = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse"><div className="h-8 bg-gray-200 dark:bg-navy-400 rounded w-48 mb-6" /><div className="grid md:grid-cols-3 gap-6">{[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-navy-400 rounded-2xl" />)}</div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Founder Dashboard</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Welcome back, {user?.name.split(' ')[0]}</p>
                </div>
                <Link to="/founder/apply" className="btn-primary text-sm">+ New Application</Link>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card"><p className="text-sm text-[var(--color-text-secondary)] mb-2">Applications</p><p className="text-3xl font-bold font-mono text-[var(--color-text)]">{startups.length}</p></div>
                <div className="stat-card"><p className="text-sm text-[var(--color-text-secondary)] mb-2">Live Campaigns</p><p className="text-3xl font-bold font-mono text-emerald-500">{startups.filter(s => s.status === 'live').length}</p></div>
                <div className="stat-card"><p className="text-sm text-[var(--color-text-secondary)] mb-2">Total Investor Interest</p><p className="text-3xl font-bold font-mono text-accent-500">{startups.reduce((sum: number, s: any) => sum + (s.investor_count || 0), 0)}</p></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Startups */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Your Startups</h2>
                    {startups.length > 0 ? (
                        <div className="space-y-4">
                            {startups.map(s => (
                                <div key={s.id} className="stat-card !p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-[var(--color-text)]">{s.name}</h3>
                                            <p className="text-sm text-[var(--color-text-secondary)]">{s.tagline}</p>
                                        </div>
                                        <span className={`badge ${statusColors[s.status] || 'badge-info'}`}>{s.status}</span>
                                    </div>
                                    {s.status === 'live' && (
                                        <>
                                            <div className="progress-bar mb-2">
                                                <div className="progress-fill" style={{ width: `${Math.min((s.raised_amount / s.target_raise) * 100, 100)}%` }} />
                                            </div>
                                            <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-4">
                                                <span>{formatCurrency(s.raised_amount)} raised</span>
                                                <span>{Math.round((s.raised_amount / s.target_raise) * 100)}% of {formatCurrency(s.target_raise)}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 text-center">
                                                <div className="p-2 bg-gray-50 dark:bg-navy-400/50 rounded-lg"><p className="text-xs text-[var(--color-text-secondary)]">Investors</p><p className="text-sm font-bold font-mono">{s.investor_count || 0}</p></div>
                                                <div className="p-2 bg-gray-50 dark:bg-navy-400/50 rounded-lg"><p className="text-xs text-[var(--color-text-secondary)]">Valuation</p><p className="text-sm font-bold font-mono">{formatCurrency(s.valuation)}</p></div>
                                                <div className="p-2 bg-gray-50 dark:bg-navy-400/50 rounded-lg"><p className="text-xs text-[var(--color-text-secondary)]">Equity</p><p className="text-sm font-bold font-mono">{s.equity_offered}%</p></div>
                                            </div>
                                        </>
                                    )}
                                    {s.status === 'pending' && (
                                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl text-sm text-amber-700 dark:text-amber-400">⏳ Your application is under review. We'll notify you once the team has reviewed it.</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="stat-card text-center py-12">
                            <p className="text-[var(--color-text-secondary)] mb-4">You haven't applied yet</p>
                            <Link to="/founder/apply" className="btn-primary text-sm">Submit Your Startup</Link>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div>
                    <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Messages & Updates</h2>
                    <div className="stat-card space-y-3">
                        {notifications.length > 0 ? notifications.slice(0, 8).map(n => (
                            <div key={n.id} className={`p-3 rounded-lg text-sm ${n.read ? 'bg-gray-50 dark:bg-navy-400/30' : 'bg-accent-50 dark:bg-accent-900/10 border border-accent-100 dark:border-accent-800'}`}>
                                <p className="font-medium text-[var(--color-text)]">{n.title}</p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{n.message}</p>
                            </div>
                        )) : <p className="text-sm text-[var(--color-text-secondary)]">No messages yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
