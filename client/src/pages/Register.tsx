import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [searchParams] = useSearchParams();
    const defaultRole = searchParams.get('role') === 'founder' ? 'founder' : 'investor';
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: defaultRole });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
            navigate(form.role === 'founder' ? '/founder/dashboard' : '/onboarding');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const update = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">Create Your Account</h1>
                    <p className="text-[var(--color-text-secondary)] mt-2">Join 10,000+ investors on StakeMint</p>
                </div>

                <div className="stat-card !p-8">
                    {/* Role selector */}
                    <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-navy-400 rounded-xl">
                        {(['investor', 'founder'] as const).map(r => (
                            <button key={r} onClick={() => update('role', r)} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${form.role === r ? 'bg-white dark:bg-navy-500 text-[var(--color-text)] shadow-sm' : 'text-[var(--color-text-secondary)]'}`}>
                                {r === 'investor' ? '💰 Investor' : '🚀 Founder'}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Full Name</label>
                            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="input-field" placeholder="Priya Sharma" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email</label>
                            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field" placeholder="priya@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Phone Number</label>
                            <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Password</label>
                            <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="input-field" placeholder="Min 6 characters" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Confirm Password</label>
                            <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="input-field" placeholder="••••••••" required />
                        </div>
                        <div className="flex items-start gap-2">
                            <input type="checkbox" required className="mt-1 rounded border-gray-300" />
                            <label className="text-xs text-[var(--color-text-secondary)]">I agree to the <a href="#" className="text-accent-500">Terms of Service</a> and <a href="#" className="text-accent-500">Privacy Policy</a></label>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-50">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent-500 hover:text-accent-600 font-medium">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
