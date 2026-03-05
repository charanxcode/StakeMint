import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Startup } from '../types';
import { useAuth } from '../context/AuthContext';

export default function InvestModal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [startup, setStartup] = useState<Startup | null>(null);
    const [amount, setAmount] = useState(5000);
    const [customAmount, setCustomAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [agreed, setAgreed] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (id) api.getStartup(Number(id)).then(setStartup).catch(() => navigate('/startups'));
    }, [id]);

    const presets = [5000, 10000, 25000, 50000];
    const activeAmount = customAmount ? Number(customAmount) : amount;
    const equityReceived = startup ? (activeAmount / startup.valuation) * 100 : 0;

    const handleInvest = async () => {
        if (!agreed) return setError('Please agree to the terms');
        if (activeAmount < (startup?.min_investment || 5000)) return setError(`Minimum investment is ₹${startup?.min_investment?.toLocaleString()}`);
        if (user?.kyc_status !== 'approved') return setError('Your KYC must be approved before investing');

        setLoading(true);
        setError('');
        try {
            const res = await api.invest({ startup_id: Number(id), amount: activeAmount, payment_method: paymentMethod });
            setResult(res);
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Investment failed');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    if (!startup) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
            {/* Steps */}
            <div className="flex items-center justify-center gap-8 mb-10">
                {['Amount', 'Review', 'Confirm'].map((s, idx) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > idx + 1 ? 'bg-emerald-500 text-white' : step === idx + 1 ? 'bg-accent-500 text-white' : 'bg-gray-200 dark:bg-navy-400 text-[var(--color-text-secondary)]'}`}>
                            {step > idx + 1 ? '✓' : idx + 1}
                        </div>
                        <span className={`text-sm font-medium ${step === idx + 1 ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>{s}</span>
                    </div>
                ))}
            </div>

            <div className="stat-card !p-8">
                {/* Startup info */}
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-[var(--color-border)]">
                    <div className="w-14 h-14 bg-gradient-to-br from-accent-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl font-bold text-accent-500">{startup.name.charAt(0)}</div>
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text)]">{startup.name}</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">{startup.tagline}</p>
                    </div>
                </div>

                {error && <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">{error}</div>}

                {step === 1 && (
                    <div>
                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Select Investment Amount</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            {presets.map(p => (
                                <button key={p} onClick={() => { setAmount(p); setCustomAmount(''); }}
                                    className={`py-3 rounded-xl font-mono font-semibold text-sm transition-all ${!customAmount && amount === p ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25' : 'bg-gray-100 dark:bg-navy-400 text-[var(--color-text)] hover:bg-accent-50 dark:hover:bg-accent-900/20'}`}>
                                    ₹{(p / 1000).toFixed(0)}K
                                </button>
                            ))}
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Custom Amount</label>
                            <input type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder={`Min ₹${startup.min_investment?.toLocaleString()}`} className="input-field font-mono" />
                        </div>

                        {/* Equity preview */}
                        <div className="p-4 bg-gray-50 dark:bg-navy-400/50 rounded-xl mb-6">
                            <p className="text-sm text-[var(--color-text-secondary)] mb-3">What you'll receive for {formatCurrency(activeAmount)}:</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-[var(--color-text-secondary)]">Equity</p><p className="text-lg font-bold font-mono text-[var(--color-text)]">{equityReceived.toFixed(4)}%</p></div>
                                <div><p className="text-xs text-[var(--color-text-secondary)]">At valuation</p><p className="text-lg font-bold font-mono text-[var(--color-text)]">{formatCurrency(startup.valuation)}</p></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                                <p className="text-xs text-[var(--color-text-secondary)] mb-2">Projected returns:</p>
                                <div className="flex gap-4 text-sm">
                                    <span className="font-mono"><span className="text-[var(--color-text-secondary)]">3x:</span> <span className="text-emerald-500 font-semibold">{formatCurrency(activeAmount * 3)}</span></span>
                                    <span className="font-mono"><span className="text-[var(--color-text-secondary)]">5x:</span> <span className="text-emerald-500 font-semibold">{formatCurrency(activeAmount * 5)}</span></span>
                                    <span className="font-mono"><span className="text-[var(--color-text-secondary)]">10x:</span> <span className="text-emerald-500 font-semibold">{formatCurrency(activeAmount * 10)}</span></span>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setStep(2)} className="btn-primary w-full" disabled={activeAmount < (startup.min_investment || 5000)}>Continue →</button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">Review & Confirm</h3>

                        <div className="space-y-3 mb-6">
                            {[
                                { label: 'Investment Amount', value: formatCurrency(activeAmount) },
                                { label: 'Startup', value: startup.name },
                                { label: 'Equity Received', value: `${equityReceived.toFixed(4)}%` },
                                { label: 'Valuation', value: formatCurrency(startup.valuation) },
                            ].map(row => (
                                <div key={row.label} className="flex justify-between py-2 border-b border-[var(--color-border)]">
                                    <span className="text-sm text-[var(--color-text-secondary)]">{row.label}</span>
                                    <span className="text-sm font-semibold font-mono text-[var(--color-text)]">{row.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Payment method */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-3">Payment Method</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[{ id: 'upi', label: 'UPI', icon: '📱' }, { id: 'netbanking', label: 'Net Banking', icon: '🏦' }, { id: 'neft', label: 'Bank Transfer', icon: '💳' }].map(m => (
                                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                                        className={`p-3 rounded-xl text-center text-sm transition-all ${paymentMethod === m.id ? 'bg-accent-50 dark:bg-accent-900/20 border-2 border-accent-500' : 'bg-gray-50 dark:bg-navy-400/50 border-2 border-transparent'}`}>
                                        <div className="text-xl mb-1">{m.icon}</div>
                                        <div className="font-medium">{m.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="flex items-start gap-3 mb-6 cursor-pointer">
                            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 rounded" />
                            <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">I understand that startup investments are high-risk and illiquid. I have read the risk disclosure and agree to the terms of investment.</span>
                        </label>

                        <div className="flex gap-3">
                            <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                            <button onClick={handleInvest} disabled={loading || !agreed} className="btn-primary flex-1 disabled:opacity-50">
                                {loading ? 'Processing...' : `Invest ${formatCurrency(activeAmount)}`}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && result && (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Investment Successful!</h3>
                        <p className="text-[var(--color-text-secondary)] mb-6">Your investment of {formatCurrency(result.amount)} in {startup.name} is confirmed.</p>
                        <div className="p-4 bg-gray-50 dark:bg-navy-400/50 rounded-xl text-sm font-mono text-[var(--color-text-secondary)] mb-8">
                            Transaction ID: {result.transaction_id}
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Link to="/portfolio" className="btn-primary">View Portfolio</Link>
                            <Link to="/startups" className="btn-secondary">Explore More</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
