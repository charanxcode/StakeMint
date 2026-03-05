import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Notification, Startup } from '../types';

export default function InvestorDashboard() {
    const { user } = useAuth();
    const [portfolio, setPortfolio] = useState<any>(null);
    const [watchlist, setWatchlist] = useState<Startup[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.getPortfolio(),
            api.getWatchlist(),
            api.getNotifications(),
        ]).then(([p, w, n]) => {
            setPortfolio(p);
            setWatchlist(w);
            setNotifications(n.notifications || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-navy-400 rounded w-48" />
                <div className="grid md:grid-cols-4 gap-6">{[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-navy-400 rounded-2xl" />)}</div>
            </div>
        </div>
    );

    const stats = portfolio?.summary || { total_invested: 0, portfolio_value: 0, total_startups: 0, return_percentage: 0 };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Here's your investment overview</p>
                </div>
                <Link to="/startups" className="btn-primary text-sm hidden md:flex">
                    Explore Startups →
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[var(--color-text-secondary)]">Total Invested</span>
                        <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-[var(--color-text)]">{formatCurrency(stats.total_invested)}</p>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[var(--color-text-secondary)]">Portfolio Value</span>
                        <span className="text-2xl">📈</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-emerald-500">{formatCurrency(stats.portfolio_value)}</p>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[var(--color-text-secondary)]">Startups</span>
                        <span className="text-2xl">🚀</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-[var(--color-text)]">{stats.total_startups}</p>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[var(--color-text-secondary)]">Returns</span>
                        <span className="text-2xl">🎯</span>
                    </div>
                    <p className={`text-2xl font-bold font-mono ${stats.return_percentage >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stats.return_percentage >= 0 ? '+' : ''}{stats.return_percentage}%
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Investments */}
                <div className="lg:col-span-2">
                    <div className="stat-card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-[var(--color-text)]">Recent Investments</h2>
                            <Link to="/portfolio" className="text-sm text-accent-500 hover:text-accent-600 font-medium">View All →</Link>
                        </div>
                        {portfolio?.investments?.length > 0 ? (
                            <div className="space-y-3">
                                {portfolio.investments.slice(0, 5).map((inv: any) => (
                                    <Link key={inv.id} to={`/startups/${inv.startup_id}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy-400/50 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-400 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-accent-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center text-sm font-bold text-accent-500">
                                                {inv.startup_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-[var(--color-text)]">{inv.startup_name}</p>
                                                <p className="text-xs text-[var(--color-text-secondary)]">{new Date(inv.created_at).toLocaleDateString('en-IN')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-semibold text-sm text-[var(--color-text)]">{formatCurrency(inv.amount)}</p>
                                            <span className="badge-success text-[10px]">{inv.payment_status}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-[var(--color-text-secondary)] mb-4">No investments yet</p>
                                <Link to="/startups" className="btn-primary text-sm">Start Investing</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="stat-card">
                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Notifications</h3>
                        {notifications.length > 0 ? (
                            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                                {notifications.slice(0, 5).map(n => (
                                    <div key={n.id} className={`p-3 rounded-lg text-sm ${n.read ? 'bg-gray-50 dark:bg-navy-400/30' : 'bg-accent-50 dark:bg-accent-900/10 border border-accent-100 dark:border-accent-800'}`}>
                                        <p className="font-medium text-[var(--color-text)]">{n.title}</p>
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">{n.message}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-[var(--color-text-secondary)]">No notifications</p>}
                    </div>

                    {/* Watchlist */}
                    <div className="stat-card">
                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Watchlist</h3>
                        {watchlist.length > 0 ? (
                            <div className="space-y-3">
                                {watchlist.slice(0, 4).map(s => (
                                    <Link key={s.id} to={`/startups/${s.id}`} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-navy-400/50 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-400 transition-colors">
                                        <div className="w-8 h-8 bg-gradient-to-br from-accent-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-accent-500">{s.name.charAt(0)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[var(--color-text)] truncate">{s.name}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)]">{s.sector}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : <p className="text-sm text-[var(--color-text-secondary)]">No items in watchlist</p>}
                    </div>

                    {/* KYC Status */}
                    <div className="stat-card">
                        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">KYC Status</h3>
                        <div className={`flex items-center gap-2 ${user?.kyc_status === 'approved' ? 'text-emerald-500' : user?.kyc_status === 'submitted' ? 'text-amber-500' : 'text-red-500'}`}>
                            <span className="text-lg">{user?.kyc_status === 'approved' ? '✅' : user?.kyc_status === 'submitted' ? '⏳' : '❌'}</span>
                            <span className="text-sm font-medium capitalize">{user?.kyc_status}</span>
                        </div>
                        {user?.kyc_status !== 'approved' && (
                            <Link to="/onboarding" className="btn-primary text-xs mt-3 w-full">Complete KYC</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
