import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { dark, toggle } = useTheme();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setProfileOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'founder') return '/founder/dashboard';
        return '/dashboard';
    };

    return (
        <nav className="sticky top-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/startups" className="px-4 py-2 text-sm font-sans font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                            Startups
                        </Link>
                        <Link to="/how-it-works" className="px-4 py-2 text-sm font-sans font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                            How It Works
                        </Link>
                        <Link to="/blog" className="px-4 py-2 text-sm font-sans font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                            Blog
                        </Link>
                    </div>

                    {/* Center Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                        <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
                            S
                        </div>
                        <span className="text-xl font-serif font-bold text-[var(--color-text)] tracking-tight">
                            StakeMint
                        </span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <button onClick={toggle} className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-cream-300 dark:hover:bg-charcoal-600 transition-all" title="Toggle theme">
                            {dark ? (
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            ) : (
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </button>

                        {user ? (
                            <div className="relative">
                                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-cream-300 dark:hover:bg-charcoal-600 transition-all">
                                    <div className="w-7 h-7 bg-accent-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden sm:block text-sm font-sans font-medium text-[var(--color-text)]">{user.name.split(' ')[0]}</span>
                                    <svg className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {profileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-elevated z-20 py-2 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-[var(--color-border)]">
                                                <p className="text-sm font-semibold text-[var(--color-text)] font-sans">{user.name}</p>
                                                <p className="text-xs text-[var(--color-text-secondary)] font-sans">{user.email}</p>
                                                <span className="badge-info mt-1.5">{user.role}</span>
                                            </div>
                                            <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-[var(--color-text)] hover:bg-cream-200 dark:hover:bg-charcoal-600">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                                Dashboard
                                            </Link>
                                            {user.role === 'investor' && (
                                                <>
                                                    <Link to="/portfolio" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-[var(--color-text)] hover:bg-cream-200 dark:hover:bg-charcoal-600">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                        Portfolio
                                                    </Link>
                                                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-[var(--color-text)] hover:bg-cream-200 dark:hover:bg-charcoal-600">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        Settings
                                                    </Link>
                                                </>
                                            )}
                                            <div className="border-t border-[var(--color-border)] mt-1 pt-1">
                                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link to="/login" className="text-sm font-sans font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors px-3 py-1.5">Log in</Link>
                                <Link to="/register" className="btn-primary text-sm !py-2 !px-5">Get Started</Link>
                            </div>
                        )}

                        {/* Mobile menu */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-[var(--color-text-secondary)]">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 border-t border-[var(--color-border)] pt-3 space-y-1">
                        <Link to="/startups" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm font-sans text-[var(--color-text)] hover:bg-cream-300 dark:hover:bg-charcoal-600 rounded-lg">Startups</Link>
                        <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm font-sans text-[var(--color-text)] hover:bg-cream-300 dark:hover:bg-charcoal-600 rounded-lg">How It Works</Link>
                        <Link to="/blog" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm font-sans text-[var(--color-text)] hover:bg-cream-300 dark:hover:bg-charcoal-600 rounded-lg">Blog</Link>
                        {!user && (
                            <div className="flex gap-2 pt-2 px-4">
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm flex-1 text-center !py-2">Log in</Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center !py-2">Get Started</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
