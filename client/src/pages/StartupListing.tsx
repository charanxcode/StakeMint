import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Startup } from '../types';

const sectorColors: Record<string, string> = {
    SaaS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Fintech: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    AgriTech: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    HealthTech: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    EdTech: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    D2C: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    CleanTech: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    LogisticsTech: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

export default function StartupListing() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('all');
    const [stage, setStage] = useState('all');
    const [sort, setSort] = useState('trending');

    useEffect(() => {
        setLoading(true);
        const params: Record<string, string> = { sort };
        if (sector !== 'all') params.sector = sector;
        if (stage !== 'all') params.stage = stage;
        if (search) params.search = search;
        api.getStartups(params).then(setStartups).catch(() => { }).finally(() => setLoading(false));
    }, [sector, stage, sort, search]);

    const sectors = ['all', 'SaaS', 'Fintech', 'AgriTech', 'HealthTech', 'EdTech', 'D2C', 'CleanTech', 'LogisticsTech'];
    const stages = ['all', 'pre-seed', 'seed', 'series-a', 'series-b'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">Explore Startups</h1>
                <p className="text-[var(--color-text-secondary)] mt-2">Discover vetted high-growth startups across sectors</p>
            </div>

            {/* Filters */}
            <div className="stat-card !p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input type="text" placeholder="Search startups..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10" />
                    </div>
                    <select value={sector} onChange={e => setSector(e.target.value)} className="input-field !w-auto min-w-[140px]">
                        {sectors.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sectors' : s}</option>)}
                    </select>
                    <select value={stage} onChange={e => setStage(e.target.value)} className="input-field !w-auto min-w-[140px]">
                        {stages.map(s => <option key={s} value={s}>{s === 'all' ? 'All Stages' : s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                    </select>
                    <select value={sort} onChange={e => setSort(e.target.value)} className="input-field !w-auto min-w-[160px]">
                        <option value="trending">🔥 Trending</option>
                        <option value="newest">🆕 Newest</option>
                        <option value="closing-soon">⏰ Closing Soon</option>
                        <option value="most-funded">💰 Most Funded</option>
                    </select>
                </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">{startups.length} startup{startups.length !== 1 ? 's' : ''} found</p>

            {/* Grid */}
            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="stat-card animate-pulse">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-gray-200 dark:bg-navy-400 rounded-2xl" />
                                <div className="w-16 h-6 bg-gray-200 dark:bg-navy-400 rounded-full" />
                            </div>
                            <div className="h-5 bg-gray-200 dark:bg-navy-400 rounded w-2/3 mb-2" />
                            <div className="h-4 bg-gray-200 dark:bg-navy-400 rounded w-full mb-4" />
                            <div className="h-3 bg-gray-200 dark:bg-navy-400 rounded-full mb-4" />
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-border)]">
                                {[1, 2, 3].map(j => <div key={j}><div className="h-3 bg-gray-200 dark:bg-navy-400 rounded w-12 mb-1" /><div className="h-4 bg-gray-200 dark:bg-navy-400 rounded w-10" /></div>)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : startups.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No startups found</h3>
                    <p className="text-[var(--color-text-secondary)]">Try adjusting your filters or search terms</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {startups.map(startup => {
                        const progress = startup.target_raise > 0 ? (startup.raised_amount / startup.target_raise) * 100 : 0;
                        return (
                            <Link key={startup.id} to={`/startups/${startup.id}`} className="glass-card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group block">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-accent-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl font-bold text-accent-500">
                                        {startup.name.charAt(0)}
                                    </div>
                                    <span className={`badge ${sectorColors[startup.sector || ''] || 'badge-info'}`}>{startup.sector}</span>
                                </div>
                                <h3 className="text-lg font-bold text-[var(--color-text)] group-hover:text-accent-500 transition-colors mb-1">{startup.name}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">{startup.tagline}</p>

                                <div className="progress-bar mb-2">
                                    <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                                </div>
                                <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-4">
                                    <span className="font-mono font-semibold text-emerald-500">₹{(startup.raised_amount / 100000).toFixed(1)}L raised</span>
                                    <span>{Math.round(progress)}% of ₹{(startup.target_raise / 100000).toFixed(0)}L</span>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-border)]">
                                    <div><div className="text-xs text-[var(--color-text-secondary)]">Min Invest</div><div className="text-sm font-semibold font-mono">₹{(startup.min_investment / 1000).toFixed(0)}K</div></div>
                                    <div><div className="text-xs text-[var(--color-text-secondary)]">Equity</div><div className="text-sm font-semibold font-mono">{startup.equity_offered}%</div></div>
                                    <div><div className="text-xs text-[var(--color-text-secondary)]">Investors</div><div className="text-sm font-semibold font-mono">{startup.investor_count || 0}</div></div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
