import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = (email: string, pass: string) => { setEmail(email); setPassword(pass); };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">Welcome Back</h1>
                    <p className="text-[var(--color-text-secondary)] mt-2">Sign in to your StakeMint account</p>
                </div>

                <div className="stat-card !p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-50">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-accent-500 hover:text-accent-600 font-medium">Create one</Link>
                    </div>
                </div>

                {/* Quick login buttons */}
                <div className="mt-6 stat-card !p-4">
                    <p className="text-xs text-[var(--color-text-secondary)] mb-3 text-center font-medium">Demo Accounts</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => quickLogin('priya@example.com', 'Investor@123')} className="text-xs px-3 py-2 rounded-lg bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/30 font-medium transition-colors">
                            Investor
                        </button>
                        <button onClick={() => quickLogin('vikram@example.com', 'Founder@123')} className="text-xs px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 font-medium transition-colors">
                            Founder
                        </button>
                        <button onClick={() => quickLogin('admin@platform.com', 'Admin@123')} className="text-xs px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 font-medium transition-colors">
                            Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
