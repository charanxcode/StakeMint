import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Transaction } from '../types';

export default function Settings() {
    const { user, kyc, refreshUser } = useAuth();
    const [tab, setTab] = useState('profile');
    const [form, setForm] = useState({ name: '', phone: '', dob: '', bank_account: '', bank_ifsc: '', bank_name: '' });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) setForm({ name: user.name, phone: user.phone || '', dob: (user as any).dob || '', bank_account: user.bank_account || '', bank_ifsc: user.bank_ifsc || '', bank_name: user.bank_name || '' });
        api.getAdminTransactions?.({}).then(setTransactions).catch(() => { });
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateProfile(form);
            await refreshUser();
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setSaving(false);
        }
    };

    const update = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-8">Settings</h1>

            <div className="flex gap-1 border-b border-[var(--color-border)] mb-8">
                {['profile', 'kyc', 'bank', 'notifications'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-medium capitalize ${tab === t ? 'text-accent-500 border-b-2 border-accent-500' : 'text-[var(--color-text-secondary)]'}`}>{t}</button>
                ))}
            </div>

            {message && <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-600 dark:text-emerald-400">{message}</div>}

            <div className="stat-card !p-8">
                {tab === 'profile' && (
                    <div className="space-y-4 max-w-md">
                        <h2 className="text-lg font-bold mb-4">Personal Information</h2>
                        <div><label className="block text-sm font-medium mb-1.5">Full Name</label><input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="input-field" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Email</label><input type="email" value={user?.email} className="input-field opacity-50" disabled /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Phone</label><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Date of Birth</label><input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} className="input-field" /></div>
                        <button onClick={handleSave} disabled={saving} className="btn-primary !py-2.5 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                )}

                {tab === 'kyc' && (
                    <div className="max-w-md">
                        <h2 className="text-lg font-bold mb-4">KYC Status</h2>
                        <div className={`p-4 rounded-xl mb-4 ${user?.kyc_status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-900/20' : user?.kyc_status === 'submitted' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                            <p className="font-semibold capitalize">{user?.kyc_status === 'approved' ? '✅ KYC Verified' : user?.kyc_status === 'submitted' ? '⏳ Under Review' : '❌ Not Submitted'}</p>
                        </div>
                        {kyc && (
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-[var(--color-border)]"><span className="text-sm text-[var(--color-text-secondary)]">PAN</span><span className="text-sm font-mono font-semibold">{kyc.pan_number}</span></div>
                                <div className="flex justify-between py-2 border-b border-[var(--color-border)]"><span className="text-sm text-[var(--color-text-secondary)]">Aadhaar</span><span className="text-sm font-mono font-semibold">XXXX XXXX {kyc.aadhaar_number?.slice(-4)}</span></div>
                            </div>
                        )}
                    </div>
                )}

                {tab === 'bank' && (
                    <div className="space-y-4 max-w-md">
                        <h2 className="text-lg font-bold mb-4">Bank Account</h2>
                        <div><label className="block text-sm font-medium mb-1.5">Bank Name</label><input type="text" value={form.bank_name} onChange={e => update('bank_name', e.target.value)} className="input-field" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Account Number</label><input type="text" value={form.bank_account} onChange={e => update('bank_account', e.target.value)} className="input-field font-mono" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">IFSC Code</label><input type="text" value={form.bank_ifsc} onChange={e => update('bank_ifsc', e.target.value.toUpperCase())} className="input-field font-mono" /></div>
                        <button onClick={handleSave} disabled={saving} className="btn-primary !py-2.5 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                )}

                {tab === 'notifications' && (
                    <div className="max-w-md">
                        <h2 className="text-lg font-bold mb-4">Notification Preferences</h2>
                        {['Email notifications', 'New startup alerts', 'Portfolio updates', 'Marketing emails'].map(pref => (
                            <label key={pref} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] cursor-pointer">
                                <span className="text-sm text-[var(--color-text)]">{pref}</span>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
