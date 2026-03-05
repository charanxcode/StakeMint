import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getAdminStats().then(setStats).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const formatCurrency = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n?.toLocaleString('en-IN')}`;

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse"><div className="grid md:grid-cols-4 gap-6">{[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-navy-400 rounded-2xl" />)}</div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
                <p className="text-[var(--color-text-secondary)] mt-1">Platform overview and management</p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Users', value: stats?.total_users || 0, icon: '👥', color: 'text-[var(--color-text)]' },
                    { label: 'Total Invested', value: formatCurrency(stats?.total_invested || 0), icon: '💰', color: 'text-emerald-500' },
                    { label: 'Active Startups', value: stats?.active_startups || 0, icon: '🚀', color: 'text-accent-500' },
                    { label: 'Total Transactions', value: stats?.total_transactions || 0, icon: '📊', color: 'text-[var(--color-text)]' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="flex items-center justify-between mb-3"><span className="text-sm text-[var(--color-text-secondary)]">{s.label}</span><span className="text-xl">{s.icon}</span></div>
                        <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Action Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link to="/admin/startups" className="stat-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 block">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[var(--color-text)]">Startup Applications</h3>
                        {Number(stats?.pending_startups) > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{stats.pending_startups}</span>}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Review, approve, or reject startup applications</p>
                </Link>
                <Link to="/admin/investors" className="stat-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 block">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[var(--color-text)]">KYC Approvals</h3>
                        {Number(stats?.pending_kyc) > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{stats.pending_kyc}</span>}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Manage investor KYC verifications</p>
                </Link>
                <Link to="/admin/transactions" className="stat-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 block">
                    <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Transaction Log</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">View all platform transactions</p>
                </Link>
            </div>

            {/* Recent Transactions */}
            <div className="stat-card">
                <h2 className="text-lg font-bold text-[var(--color-text)] mb-6">Recent Transactions</h2>
                {stats?.recent_transactions?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b border-[var(--color-border)]">
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">User</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Type</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Amount</th>
                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Date</th>
                            </tr></thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {stats.recent_transactions.map((t: any) => (
                                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-navy-400/50">
                                        <td className="py-3 px-4 text-sm font-medium">{t.user_name}</td>
                                        <td className="py-3 px-4"><span className="badge-info capitalize">{t.type}</span></td>
                                        <td className="py-3 px-4 text-right font-mono text-sm font-semibold">{formatCurrency(t.amount)}</td>
                                        <td className="py-3 px-4 text-center"><span className={`badge ${t.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span></td>
                                        <td className="py-3 px-4 text-right text-sm text-[var(--color-text-secondary)]">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="text-[var(--color-text-secondary)]">No transactions yet</p>}
            </div>
        </div>
    );
}
