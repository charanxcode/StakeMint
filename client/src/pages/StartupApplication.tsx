import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function StartupApplication() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '', registration_number: '', cin: '', sector: 'SaaS', stage: 'seed',
        tagline: '', description: '', problem: '', solution: '', traction: '', market_size: '', business_model: '',
        target_raise: '', equity_offered: '', valuation: '', min_investment: '5000', close_date: '', use_of_funds: '',
        arr: '', mom_growth: '', burn_rate: '',
        team: [{ name: '', role: '', linkedin_url: '' }],
    });

    const update = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));
    const updateTeam = (idx: number, field: string, value: string) => {
        const team = [...form.team];
        team[idx] = { ...team[idx], [field]: value };
        update('team', team);
    };
    const addTeam = () => update('team', [...form.team, { name: '', role: '', linkedin_url: '' }]);
    const removeTeam = (idx: number) => update('team', form.team.filter((_: any, i: number) => i !== idx));

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await api.createStartup({
                ...form,
                target_raise: Number(form.target_raise),
                equity_offered: Number(form.equity_offered),
                valuation: Number(form.valuation),
                min_investment: Number(form.min_investment),
                arr: Number(form.arr) || 0,
                mom_growth: Number(form.mom_growth) || 0,
                burn_rate: Number(form.burn_rate) || 0,
            });
            navigate('/founder/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sectors = ['SaaS', 'Fintech', 'AgriTech', 'HealthTech', 'EdTech', 'D2C', 'CleanTech', 'LogisticsTech'];
    const stages = ['pre-seed', 'seed', 'series-a', 'series-b', 'growth'];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-2">List Your Startup</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">Submit your startup for listing on StakeMint</p>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                {['Company', 'Pitch', 'Financials', 'Team'].map((s, idx) => (
                    <button key={s} onClick={() => idx < step && setStep(idx + 1)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${step === idx + 1 ? 'bg-accent-500 text-white' : step > idx + 1 ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-navy-400 text-[var(--color-text-secondary)]'}`}>
                        {step > idx + 1 ? '✓' : idx + 1}. {s}
                    </button>
                ))}
            </div>

            <div className="stat-card !p-8">
                {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600">{error}</div>}

                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">Company Details</h2>
                        <div><label className="block text-sm font-medium mb-1.5">Company Name *</label><input value={form.name} onChange={e => update('name', e.target.value)} className="input-field" required /></div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1.5">CIN</label><input value={form.cin} onChange={e => update('cin', e.target.value)} className="input-field" /></div>
                            <div><label className="block text-sm font-medium mb-1.5">Registration Number</label><input value={form.registration_number} onChange={e => update('registration_number', e.target.value)} className="input-field" /></div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1.5">Sector *</label><select value={form.sector} onChange={e => update('sector', e.target.value)} className="input-field">{sectors.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                            <div><label className="block text-sm font-medium mb-1.5">Stage *</label><select value={form.stage} onChange={e => update('stage', e.target.value)} className="input-field">{stages.map(s => <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}</select></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1.5">One-Liner Tagline *</label><input value={form.tagline} onChange={e => update('tagline', e.target.value)} className="input-field" placeholder="AI-powered analytics for SMBs" /></div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">Pitch Details</h2>
                        <div><label className="block text-sm font-medium mb-1.5">Description</label><textarea value={form.description} onChange={e => update('description', e.target.value)} className="input-field !h-24" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Problem</label><textarea value={form.problem} onChange={e => update('problem', e.target.value)} className="input-field !h-20" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Solution</label><textarea value={form.solution} onChange={e => update('solution', e.target.value)} className="input-field !h-20" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Traction</label><textarea value={form.traction} onChange={e => update('traction', e.target.value)} className="input-field !h-16" /></div>
                        <div><label className="block text-sm font-medium mb-1.5">Market Size</label><input value={form.market_size} onChange={e => update('market_size', e.target.value)} className="input-field" /></div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">Financials & Raise Details</h2>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div><label className="block text-sm font-medium mb-1.5">ARR (₹)</label><input type="number" value={form.arr} onChange={e => update('arr', e.target.value)} className="input-field font-mono" /></div>
                            <div><label className="block text-sm font-medium mb-1.5">MoM Growth (%)</label><input type="number" value={form.mom_growth} onChange={e => update('mom_growth', e.target.value)} className="input-field font-mono" /></div>
                            <div><label className="block text-sm font-medium mb-1.5">Burn Rate (₹/mo)</label><input type="number" value={form.burn_rate} onChange={e => update('burn_rate', e.target.value)} className="input-field font-mono" /></div>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div><label className="block text-sm font-medium mb-1.5">Target Raise (₹) *</label><input type="number" value={form.target_raise} onChange={e => update('target_raise', e.target.value)} className="input-field font-mono" /></div>
                            <div><label className="block text-sm font-medium mb-1.5">Equity Offered (%) *</label><input type="number" value={form.equity_offered} onChange={e => update('equity_offered', e.target.value)} className="input-field font-mono" /></div>
                            <div><label className="block text-sm font-medium mb-1.5">Valuation (₹) *</label><input type="number" value={form.valuation} onChange={e => update('valuation', e.target.value)} className="input-field font-mono" /></div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1.5">Min Investment (₹)</label><input type="number" value={form.min_investment} onChange={e => update('min_investment', e.target.value)} className="input-field font-mono" /></div>
                            <div><label className="block text-sm font-medium mb-1.5">Round Close Date</label><input type="date" value={form.close_date} onChange={e => update('close_date', e.target.value)} className="input-field" /></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1.5">Use of Funds</label><textarea value={form.use_of_funds} onChange={e => update('use_of_funds', e.target.value)} className="input-field !h-16" placeholder="Product (40%), Marketing (30%)..." /></div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">Founding Team</h2>
                            <button onClick={addTeam} className="btn-secondary text-xs !py-1.5 !px-3">+ Add Member</button>
                        </div>
                        {form.team.map((m: any, idx: number) => (
                            <div key={idx} className="p-4 bg-gray-50 dark:bg-navy-400/50 rounded-xl space-y-3">
                                <div className="flex justify-between items-center"><span className="text-sm font-semibold">Member {idx + 1}</span>{idx > 0 && <button onClick={() => removeTeam(idx)} className="text-xs text-red-500">Remove</button>}</div>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <input value={m.name} onChange={e => updateTeam(idx, 'name', e.target.value)} className="input-field text-sm" placeholder="Name" />
                                    <input value={m.role} onChange={e => updateTeam(idx, 'role', e.target.value)} className="input-field text-sm" placeholder="Role (CEO, CTO...)" />
                                    <input value={m.linkedin_url} onChange={e => updateTeam(idx, 'linkedin_url', e.target.value)} className="input-field text-sm" placeholder="LinkedIn URL" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 mt-8">
                    {step > 1 && <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1">← Back</button>}
                    {step < 4 ? (
                        <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">Continue →</button>
                    ) : (
                        <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Application'}</button>
                    )}
                </div>
            </div>
        </div>
    );
}
