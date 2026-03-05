import React from 'react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text)] mb-4">How StakeMint Works</h1>
                <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">We make startup investing accessible, transparent, and safe for every Indian.</p>
            </div>

            {/* For Investors */}
            <div className="mb-20">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8 flex items-center gap-3">💰 For Investors</h2>
                <div className="space-y-6">
                    {[
                        { step: '01', title: 'Create Your Account', desc: 'Sign up with your email, complete KYC with PAN & Aadhaar, and link your bank account. The entire process takes under 5 minutes.', icon: '🔐' },
                        { step: '02', title: 'Discover Opportunities', desc: 'Browse our curated list of startups. Each listing includes detailed financials, team profiles, market analysis, and investment terms. Filter by sector, stage, and investment range.', icon: '🔍' },
                        { step: '03', title: 'Due Diligence', desc: 'Access the deal room for each startup — pitch decks, financial statements, cap tables, and legal documents. Make informed decisions with complete transparency.', icon: '📊' },
                        { step: '04', title: 'Invest Securely', desc: 'Invest from as low as ₹5,000 via UPI, Net Banking, or NEFT. Your funds are held in an escrow account until the round closes. Get equity proportional to your investment.', icon: '💳' },
                        { step: '05', title: 'Track & Earn', desc: 'Monitor your portfolio performance in real-time. Receive quarterly updates from startups. Get notified about exits, secondary sales, and new funding rounds.', icon: '📈' },
                    ].map(item => (
                        <div key={item.step} className="stat-card flex gap-6">
                            <div className="shrink-0 w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-xl flex items-center justify-center text-xl">{item.icon}</div>
                            <div>
                                <div className="text-xs font-mono text-accent-500 font-bold mb-1">STEP {item.step}</div>
                                <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{item.title}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* For Startups */}
            <div className="mb-20">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8 flex items-center gap-3">🚀 For Startups</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: 'Apply', desc: 'Submit your startup details, financials, and pitch deck. Our team reviews every application within 5 business days.', icon: '📝' },
                        { title: 'Get Listed', desc: 'Once approved, your startup goes live on our platform. Set your terms — valuation, equity, minimum investment, and round close date.', icon: '✅' },
                        { title: 'Raise Capital', desc: 'Get funded by thousands of retail investors. Track commitments in real-time and close your round when target is met.', icon: '🎯' },
                    ].map(item => (
                        <div key={item.title} className="stat-card text-center">
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{item.title}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="text-center p-12 bg-hero-gradient rounded-3xl text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-navy-200 mb-8 max-w-lg mx-auto">Join thousands of Indians who are already investing in the next generation of unicorns.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/register" className="btn-primary !bg-white !text-navy-500 hover:!bg-gray-100">Start Investing</Link>
                    <Link to="/register?role=founder" className="btn-secondary !border-white/20 !text-white">List Your Startup</Link>
                </div>
            </div>
        </div>
    );
}
