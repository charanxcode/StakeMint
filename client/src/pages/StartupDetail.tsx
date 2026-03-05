import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Startup } from '../types';
import { useAuth } from '../context/AuthContext';

export default function StartupDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [startup, setStartup] = useState<Startup | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview');
    const [watchlisted, setWatchlisted] = useState(false);

    useEffect(() => {
        if (!id) return;
        api.getStartup(Number(id)).then(data => {
            setStartup(data);
            setWatchlisted(data.is_watchlisted);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    const toggleWatch = async () => {
        if (!user) return navigate('/login');
        try {
            const res = await api.toggleWatchlist(Number(id));
            setWatchlisted(res.watchlisted);
        } catch { }
    };

    if (loading) return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-6">
                <div className="h-48 bg-gray-200 dark:bg-navy-400 rounded-2xl" />
                <div className="h-8 bg-gray-200 dark:bg-navy-400 rounded w-1/3" />
                <div className="h-4 bg-gray-200 dark:bg-navy-400 rounded w-2/3" />
            </div>
        </div>
    );

    if (!startup) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Startup not found</h2></div>;

    const progress = startup.target_raise > 0 ? (startup.raised_amount / startup.target_raise) * 100 : 0;
    const daysLeft = startup.close_date ? Math.max(0, Math.ceil((new Date(startup.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

    const formatCurrency = (n: number) => {
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
        if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
        return `₹${n.toLocaleString('en-IN')}`;
    };

    const tabs = ['overview', 'team', 'financials', 'documents'];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="stat-card !p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center text-4xl font-bold text-accent-500 shrink-0">
                        {startup.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">{startup.name}</h1>
                            <span className="badge-info">{startup.sector}</span>
                            <span className="badge-success capitalize">{startup.stage}</span>
                        </div>
                        <p className="text-[var(--color-text-secondary)] text-lg">{startup.tagline}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={toggleWatch} className={`btn-secondary !py-2 !px-4 text-sm ${watchlisted ? '!border-red-500 !text-red-500' : ''}`}>
                            {watchlisted ? '❤️ Saved' : '🤍 Save'}
                        </button>
                        {user?.role === 'investor' ? (
                            <Link to={`/invest/${startup.id}`} className="btn-primary !py-2 !px-6 text-sm">Invest Now</Link>
                        ) : !user ? (
                            <Link to="/login" className="btn-primary !py-2 !px-6 text-sm">Sign In to Invest</Link>
                        ) : null}
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-8 p-6 bg-gray-50 dark:bg-navy-400/50 rounded-xl">
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">Raised</p>
                            <p className="text-2xl font-bold font-mono text-emerald-500">{formatCurrency(startup.raised_amount)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-[var(--color-text-secondary)]">Target</p>
                            <p className="text-lg font-semibold font-mono text-[var(--color-text)]">{formatCurrency(startup.target_raise)}</p>
                        </div>
                    </div>
                    <div className="progress-bar !h-4 mb-4">
                        <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div className="p-3 bg-white dark:bg-navy-500 rounded-xl">
                            <p className="text-xs text-[var(--color-text-secondary)]">Valuation</p>
                            <p className="text-sm font-bold font-mono text-[var(--color-text)]">{formatCurrency(startup.valuation)}</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-navy-500 rounded-xl">
                            <p className="text-xs text-[var(--color-text-secondary)]">Min Investment</p>
                            <p className="text-sm font-bold font-mono text-[var(--color-text)]">{formatCurrency(startup.min_investment)}</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-navy-500 rounded-xl">
                            <p className="text-xs text-[var(--color-text-secondary)]">Equity Offered</p>
                            <p className="text-sm font-bold font-mono text-[var(--color-text)]">{startup.equity_offered}%</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-navy-500 rounded-xl">
                            <p className="text-xs text-[var(--color-text-secondary)]">Investors</p>
                            <p className="text-sm font-bold font-mono text-[var(--color-text)]">{startup.investor_count || 0}</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-navy-500 rounded-xl">
                            <p className="text-xs text-[var(--color-text-secondary)]">Days Left</p>
                            <p className={`text-sm font-bold font-mono ${daysLeft < 14 ? 'text-red-500' : 'text-[var(--color-text)]'}`}>{daysLeft}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[var(--color-border)] mb-8 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-all ${tab === t ? 'text-accent-500 border-b-2 border-accent-500' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="stat-card !p-8">
                {tab === 'overview' && (
                    <div className="space-y-8">
                        {startup.description && <div><h3 className="text-lg font-bold mb-3">About</h3><p className="text-[var(--color-text-secondary)] leading-relaxed">{startup.description}</p></div>}
                        {startup.problem && <div><h3 className="text-lg font-bold mb-3">Problem</h3><p className="text-[var(--color-text-secondary)] leading-relaxed">{startup.problem}</p></div>}
                        {startup.solution && <div><h3 className="text-lg font-bold mb-3">Solution</h3><p className="text-[var(--color-text-secondary)] leading-relaxed">{startup.solution}</p></div>}
                        {startup.traction && <div><h3 className="text-lg font-bold mb-3">Traction</h3><p className="text-[var(--color-text-secondary)] leading-relaxed">{startup.traction}</p></div>}
                        {startup.market_size && <div><h3 className="text-lg font-bold mb-3">Market Size</h3><p className="text-[var(--color-text-secondary)] leading-relaxed">{startup.market_size}</p></div>}
                        {startup.use_of_funds && <div><h3 className="text-lg font-bold mb-3">Use of Funds</h3><p className="text-[var(--color-text-secondary)] leading-relaxed">{startup.use_of_funds}</p></div>}
                    </div>
                )}

                {tab === 'team' && (
                    <div>
                        <h3 className="text-lg font-bold mb-6">Founding Team</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {startup.team?.map(m => (
                                <div key={m.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-navy-400/50 rounded-xl">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">{m.name.charAt(0)}</div>
                                    <div>
                                        <p className="font-semibold text-[var(--color-text)]">{m.name}</p>
                                        <p className="text-sm text-[var(--color-text-secondary)]">{m.role}</p>
                                        {m.linkedin_url && <a href={`https://${m.linkedin_url}`} target="_blank" rel="noreferrer" className="text-xs text-accent-500 hover:underline">LinkedIn →</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'financials' && (
                    <div>
                        <h3 className="text-lg font-bold mb-6">Financial Metrics</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { label: 'Annual Recurring Revenue', value: formatCurrency(startup.arr || 0), icon: '💰' },
                                { label: 'Month-over-Month Growth', value: `${startup.mom_growth || 0}%`, icon: '📈' },
                                { label: 'Monthly Burn Rate', value: formatCurrency(startup.burn_rate || 0), icon: '🔥' },
                                { label: 'Valuation', value: formatCurrency(startup.valuation), icon: '🏆' },
                                { label: 'Equity Offered', value: `${startup.equity_offered}%`, icon: '📊' },
                                { label: 'Target Raise', value: formatCurrency(startup.target_raise), icon: '🎯' },
                            ].map(metric => (
                                <div key={metric.label} className="p-4 bg-gray-50 dark:bg-navy-400/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span>{metric.icon}</span>
                                        <span className="text-xs text-[var(--color-text-secondary)]">{metric.label}</span>
                                    </div>
                                    <p className="text-xl font-bold font-mono text-[var(--color-text)]">{metric.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'documents' && (
                    <div>
                        <h3 className="text-lg font-bold mb-6">Documents</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Pitch Deck', desc: 'Company overview and investment thesis', icon: '📑' },
                                { name: 'Financial Statements', desc: 'Audited financials and projections', icon: '📊' },
                                { name: 'Cap Table', desc: 'Current ownership structure', icon: '📋' },
                            ].map(doc => (
                                <div key={doc.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy-400/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{doc.icon}</span>
                                        <div>
                                            <p className="font-semibold text-[var(--color-text)]">{doc.name}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)]">{doc.desc}</p>
                                        </div>
                                    </div>
                                    <button className="btn-secondary !py-2 !px-4 text-xs">
                                        View PDF
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
