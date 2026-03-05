import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', dob: '', pan_number: '', aadhaar_number: '', bank_account: '', bank_ifsc: '', bank_name: '', risk_acknowledged: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const update = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));

    const handleNext = async () => {
        setError('');
        setLoading(true);
        try {
            if (step === 1) {
                await api.updateProfile({ name: form.name, phone: form.phone, dob: form.dob });
                setStep(2);
            } else if (step === 2) {
                if (!form.pan_number || !form.aadhaar_number) { setError('PAN and Aadhaar are required'); setLoading(false); return; }
                await api.submitKyc({ pan_number: form.pan_number, aadhaar_number: form.aadhaar_number });
                setStep(3);
            } else if (step === 3) {
                await api.updateProfile({ bank_account: form.bank_account, bank_ifsc: form.bank_ifsc, bank_name: form.bank_name });
                setStep(4);
            } else if (step === 4) {
                if (!form.risk_acknowledged) { setError('Please acknowledge the risk'); setLoading(false); return; }
                setStep(5);
            }
            if (step < 5) await refreshUser();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Basic Info', 'KYC', 'Bank Account', 'Risk', 'Welcome'];

    return (
        <div className="max-w-lg mx-auto px-4 py-8 md:py-12">
            {/* Progress */}
            <div className="flex items-center justify-between mb-10">
                {steps.map((s, idx) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step > idx + 1 ? 'bg-emerald-500 text-white' : step === idx + 1 ? 'bg-accent-500 text-white' : 'bg-gray-200 dark:bg-navy-400 text-[var(--color-text-secondary)]'}`}>
                            {step > idx + 1 ? '✓' : idx + 1}
                        </div>
                        {idx < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 ${step > idx + 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-navy-400'}`} />}
                    </div>
                ))}
            </div>

            <div className="stat-card !p-8">
                {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">{error}</div>}

                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[var(--color-text)]">📋 Basic Information</h2>
                        <div><label className="block text-sm font-medium mb-1.5">Full Name</label><input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="input-field" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Phone</label><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field" placeholder="+91 98765 43210" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Date of Birth</label><input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} className="input-field" /></div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[var(--color-text)]">🪪 KYC Verification</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">We need your PAN and Aadhaar for SEBI compliance.</p>
                        <div><label className="block text-sm font-medium mb-1.5">PAN Number</label><input type="text" value={form.pan_number} onChange={e => update('pan_number', e.target.value.toUpperCase())} className="input-field font-mono" placeholder="ABCDE1234F" maxLength={10} /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Aadhaar Number</label><input type="text" value={form.aadhaar_number} onChange={e => update('aadhaar_number', e.target.value.replace(/\D/g, ''))} className="input-field font-mono" placeholder="1234 5678 9012" maxLength={12} /></div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">🔒 Your documents are encrypted and stored securely. We never share your data with third parties.</div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[var(--color-text)]">🏦 Bank Account</h2>
                        <div><label className="block text-sm font-medium mb-1.5">Bank Name</label><input type="text" value={form.bank_name} onChange={e => update('bank_name', e.target.value)} className="input-field" placeholder="HDFC Bank" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Account Number</label><input type="text" value={form.bank_account} onChange={e => update('bank_account', e.target.value)} className="input-field font-mono" placeholder="1234567890" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">IFSC Code</label><input type="text" value={form.bank_ifsc} onChange={e => update('bank_ifsc', e.target.value.toUpperCase())} className="input-field font-mono" placeholder="HDFC0001234" /></div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[var(--color-text)]">⚠️ Risk Acknowledgment</h2>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400 space-y-2">
                            <p className="font-semibold">Please read carefully:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Startup investments are high-risk and illiquid</li>
                                <li>You may lose your entire investment</li>
                                <li>Returns are not guaranteed</li>
                                <li>Investments may be locked for 3-7 years</li>
                                <li>Only invest what you can afford to lose</li>
                            </ul>
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.risk_acknowledged} onChange={e => update('risk_acknowledged', e.target.checked)} className="mt-1 rounded" />
                            <span className="text-sm text-[var(--color-text)]">I understand and acknowledge the risks associated with startup investing.</span>
                        </label>
                    </div>
                )}

                {step === 5 && (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Welcome to StakeMint!</h2>
                        <p className="text-[var(--color-text-secondary)] mb-8">Your account is set up. Your KYC is being reviewed and will be approved shortly.</p>
                        <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard →</button>
                    </div>
                )}

                {step < 5 && (
                    <div className="flex gap-3 mt-8">
                        {step > 1 && <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">← Back</button>}
                        <button onClick={handleNext} disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                            {loading ? 'Saving...' : step === 4 ? 'Complete Setup' : 'Continue →'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
