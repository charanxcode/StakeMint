import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Transaction } from '../types';

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        setLoading(true);
        const params: Record<string, string> = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (typeFilter !== 'all') params.type = typeFilter;
        api.getAdminTransactions(params).then(setTransactions).catch(() => { }).finally(() => setLoading(false));
    }, [statusFilter, typeFilter]);

    const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
    const total = transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-2">Transaction Log</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">All platform transactions</p>

            {/* Summary */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card"><p className="text-sm text-[var(--color-text-secondary)] mb-2">Total Transactions</p><p className="text-2xl font-bold font-mono">{transactions.length}</p></div>
                <div className="stat-card"><p className="text-sm text-[var(--color-text-secondary)] mb-2">Total Volume</p><p className="text-2xl font-bold font-mono text-emerald-500">{formatCurrency(total)}</p></div>
                <div className="stat-card"><p className="text-sm text-[var(--color-text-secondary)] mb-2">Completed</p><p className="text-2xl font-bold font-mono">{transactions.filter(t => t.status === 'completed').length}</p></div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field !w-auto">
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field !w-auto">
                    <option value="all">All Types</option>
                    <option value="investment">Investment</option>
                    <option value="refund">Refund</option>
                </select>
            </div>

            {/* Table */}
            <div className="stat-card overflow-hidden">
                {loading ? (
                    <div className="animate-pulse space-y-3 p-6">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-gray-200 dark:bg-navy-400 rounded" />)}</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12"><p className="text-[var(--color-text-secondary)]">No transactions found</p></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b border-[var(--color-border)]">
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Reference</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">User</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Startup</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Type</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Amount</th>
                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Date</th>
                            </tr></thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {transactions.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-navy-400/50">
                                        <td className="py-3 px-4 font-mono text-xs text-[var(--color-text-secondary)]">{t.reference}</td>
                                        <td className="py-3 px-4 text-sm font-medium">{t.user_name}</td>
                                        <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">{t.startup_name || '—'}</td>
                                        <td className="py-3 px-4"><span className="badge-info capitalize">{t.type}</span></td>
                                        <td className="py-3 px-4 text-right font-mono text-sm font-semibold">{formatCurrency(t.amount)}</td>
                                        <td className="py-3 px-4 text-center"><span className={`badge ${t.status === 'completed' ? 'badge-success' : t.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{t.status}</span></td>
                                        <td className="py-3 px-4 text-right text-sm text-[var(--color-text-secondary)]">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
