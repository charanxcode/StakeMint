import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Portfolio() {
    const [portfolio, setPortfolio] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.getPortfolio(), api.getPortfolioChart()])
            .then(([p, c]) => { setPortfolio(p); setChartData(c); })
            .catch(() => { }).finally(() => setLoading(false));
    }, []);

    const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-navy-400 rounded w-48" />
            <div className="h-64 bg-gray-200 dark:bg-navy-400 rounded-2xl" />
        </div>
    );

    const stats = portfolio?.summary || {};

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">My Portfolio</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Track your investment performance</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Invested', value: formatCurrency(stats.total_invested || 0), color: 'text-[var(--color-text)]', icon: '💰' },
                    { label: 'Portfolio Value', value: formatCurrency(stats.portfolio_value || 0), color: 'text-emerald-500', icon: '📈' },
                    { label: 'Total Returns', value: formatCurrency(stats.total_returns || 0), color: stats.total_returns >= 0 ? 'text-emerald-500' : 'text-red-500', icon: '🎯' },
                    { label: 'Return %', value: `${stats.return_percentage >= 0 ? '+' : ''}${stats.return_percentage || 0}%`, color: stats.return_percentage >= 0 ? 'text-emerald-500' : 'text-red-500', icon: '📊' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-[var(--color-text-secondary)]">{s.label}</span>
                            <span className="text-xl">{s.icon}</span>
                        </div>
                        <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
                <div className="stat-card !p-6 mb-8">
                    <h2 className="text-lg font-bold text-[var(--color-text)] mb-6">Portfolio Performance</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="month" stroke="var(--color-text-secondary)" fontSize={12} />
                                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Area type="monotone" dataKey="invested" stroke="#2563EB" fill="url(#investedGrad)" strokeWidth={2} name="Invested" />
                                <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#valueGrad)" strokeWidth={2} name="Value" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Investment List */}
            <div className="stat-card">
                <h2 className="text-lg font-bold text-[var(--color-text)] mb-6">All Investments</h2>
                {portfolio?.investments?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Startup</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Sector</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Invested</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Equity</th>
                                    <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Status</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {portfolio.investments.map((inv: any) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-navy-400/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <Link to={`/startups/${inv.startup_id}`} className="flex items-center gap-3 hover:text-accent-500">
                                                <div className="w-8 h-8 bg-gradient-to-br from-accent-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-accent-500">{inv.startup_name?.charAt(0)}</div>
                                                <span className="font-semibold text-sm">{inv.startup_name}</span>
                                            </Link>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-[var(--color-text-secondary)]">{inv.sector}</td>
                                        <td className="py-4 px-4 text-right font-mono text-sm font-semibold">{formatCurrency(inv.amount)}</td>
                                        <td className="py-4 px-4 text-right font-mono text-sm">{inv.equity_received?.toFixed(4)}%</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`badge ${inv.payment_status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{inv.payment_status}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right text-sm text-[var(--color-text-secondary)]">{new Date(inv.created_at).toLocaleDateString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-[var(--color-text-secondary)] mb-4">Start building your portfolio</p>
                        <Link to="/startups" className="btn-primary text-sm">Explore Startups</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
