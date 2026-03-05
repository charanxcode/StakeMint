import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function AdminInvestors() {
    const [investors, setInvestors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        api.getAdminInvestors().then(setInvestors).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const updateKyc = async (userId: number, status: string) => {
        try {
            await api.updateKycStatus(userId, status);
            load();
        } catch { }
    };

    const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
    const kycColors: Record<string, string> = { approved: 'badge-success', submitted: 'badge-warning', pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', rejected: 'badge-danger' };

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse"><div className="h-64 bg-gray-200 dark:bg-navy-400 rounded-2xl" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-8">Investor Management</h1>

            <div className="stat-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b border-[var(--color-border)]">
                            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Investor</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Contact</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">KYC Status</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">KYC Details</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Investments</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Total Invested</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {investors.map(inv => (
                                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-navy-400/50">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{inv.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-semibold text-sm text-[var(--color-text)]">{inv.name}</p>
                                                <p className="text-xs text-[var(--color-text-secondary)]">Joined {new Date(inv.created_at).toLocaleDateString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-[var(--color-text-secondary)]">
                                        <div>{inv.email}</div>
                                        <div className="text-xs">{inv.phone}</div>
                                    </td>
                                    <td className="py-4 px-4 text-center"><span className={`badge ${kycColors[inv.kyc_status] || 'badge-info'}`}>{inv.kyc_status}</span></td>
                                    <td className="py-4 px-4 text-center text-xs font-mono text-[var(--color-text-secondary)]">
                                        {inv.kyc ? <div><div>PAN: {inv.kyc.pan_number}</div><div>Aadhaar: ...{inv.kyc.aadhaar_number?.slice(-4)}</div></div> : '—'}
                                    </td>
                                    <td className="py-4 px-4 text-right font-mono text-sm font-semibold">{inv.investment_count}</td>
                                    <td className="py-4 px-4 text-right font-mono text-sm font-semibold">{formatCurrency(inv.total_invested)}</td>
                                    <td className="py-4 px-4 text-center">
                                        {inv.kyc_status === 'submitted' && (
                                            <div className="flex gap-2 justify-center">
                                                <button onClick={() => updateKyc(inv.id, 'approved')} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-medium hover:bg-emerald-100">Approve</button>
                                                <button onClick={() => updateKyc(inv.id, 'rejected')} className="text-xs px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 font-medium hover:bg-red-100">Reject</button>
                                            </div>
                                        )}
                                        {inv.kyc_status === 'approved' && <span className="text-xs text-emerald-500">✅ Verified</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
