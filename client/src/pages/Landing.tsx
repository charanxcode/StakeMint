import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Startup } from '../types';

function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        const duration = 2000;
        const steps = 60;
        const increment = end / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(current));
        }, duration / steps);
        return () => clearInterval(timer);
    }, [visible, end]);

    return <div ref={ref} className="font-serif text-5xl md:text-6xl font-bold text-[var(--color-text)]">{prefix}{count.toLocaleString('en-IN')}{suffix}</div>;
}

function StartupCard({ startup }: { startup: Startup }) {
    const progress = startup.target_raise > 0 ? (startup.raised_amount / startup.target_raise) * 100 : 0;

    return (
        <Link to={`/startups/${startup.id}`} className="stat-card p-6 hover:shadow-card-hover hover:-translate-y-1 group block">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-accent-50 dark:bg-accent-900/20 rounded-xl flex items-center justify-center text-xl font-serif font-bold text-accent-500">
                    {startup.name.charAt(0)}
                </div>
                <span className="badge-info">{startup.sector}</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[var(--color-text)] group-hover:text-accent-500 transition-colors mb-1">{startup.name}</h3>
            <p className="text-sm font-sans text-[var(--color-text-secondary)] mb-4 line-clamp-2">{startup.tagline}</p>

            <div className="progress-bar mb-2">
                <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs font-sans text-[var(--color-text-secondary)] mb-4">
                <span className="font-mono font-semibold text-accent-500">₹{(startup.raised_amount / 100000).toFixed(1)}L raised</span>
                <span>{Math.round(progress)}% of ₹{(startup.target_raise / 100000).toFixed(0)}L</span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-border)]">
                <div>
                    <div className="text-xs font-sans text-[var(--color-text-secondary)]">Min Invest</div>
                    <div className="text-sm font-semibold font-mono text-[var(--color-text)]">₹{(startup.min_investment / 1000).toFixed(0)}K</div>
                </div>
                <div>
                    <div className="text-xs font-sans text-[var(--color-text-secondary)]">Equity</div>
                    <div className="text-sm font-semibold font-mono text-[var(--color-text)]">{startup.equity_offered}%</div>
                </div>
                <div>
                    <div className="text-xs font-sans text-[var(--color-text-secondary)]">Stage</div>
                    <div className="text-sm font-semibold font-sans text-[var(--color-text)] capitalize">{startup.stage}</div>
                </div>
            </div>
        </Link>
    );
}

export default function Landing() {
    const [featured, setFeatured] = useState<Startup[]>([]);

    useEffect(() => {
        api.getStartups({ sort: 'trending' }).then(setFeatured).catch(() => { });
    }, []);

    const faqs = [
        { q: 'What is StakeMint?', a: 'StakeMint is India\'s premier retail startup investment platform that allows everyday Indians to invest in high-growth startups starting from just ₹5,000. We rigorously vet every startup before listing.' },
        { q: 'How much do I need to invest?', a: 'You can start investing with as little as ₹5,000. Different startups may have different minimum investment amounts based on their fundraising parameters.' },
        { q: 'Is this SEBI regulated?', a: 'Yes, StakeMint operates under SEBI\'s regulatory framework for startup investment platforms, ensuring compliance and investor protection at every step.' },
        { q: 'How do I earn returns?', a: 'Returns are generated when startups you\'ve invested in either go through additional funding rounds (markup), get acquired, or go public (IPO). Historical returns for early-stage investors range from 3x to 100x.' },
        { q: 'What are the risks?', a: 'Startup investing is inherently risky. Not all startups succeed, and your investment could lose value. We recommend diversifying across multiple startups and only investing money you can afford to lock away for 3-7 years.' },
    ];

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div>
            {/* Hero — YC editorial style: centered serif heading, generous whitespace */}
            <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-[var(--color-text)] mb-8">
                        Invest in tomorrow's{' '}
                        <em className="text-accent-500 not-italic" style={{ fontStyle: 'italic' }}>unicorns</em>
                    </h1>
                    <div className="max-w-lg mx-auto mb-12">
                        <p className="font-serif text-lg md:text-xl text-[var(--color-text-secondary)] italic leading-relaxed">
                            "The best time to invest in a startup is before the world knows its name."
                        </p>
                        <p className="font-sans text-sm text-[var(--color-text-secondary)] mt-3">— Starting from just ₹5,000</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn-primary text-base !py-3.5 !px-8">
                            Start Investing
                        </Link>
                        <Link to="/register?role=founder" className="btn-secondary text-base !py-3.5 !px-8">
                            List Your Startup
                        </Link>
                    </div>
                </div>
                {/* Scroll indicator */}
                <div className="mt-16 animate-float">
                    <svg className="w-6 h-6 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
            </section>

            {/* Stats — Large serif editorial numbers */}
            <section className="py-20 md:py-28 border-y border-[var(--color-border)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <AnimatedCounter end={1247} prefix="₹" suffix="Cr" />
                            <p className="text-sm font-sans text-[var(--color-text-secondary)] mt-3">Capital Deployed</p>
                        </div>
                        <div>
                            <AnimatedCounter end={52} suffix="+" />
                            <p className="text-sm font-sans text-[var(--color-text-secondary)] mt-3">Startups Funded</p>
                        </div>
                        <div>
                            <AnimatedCounter end={10842} />
                            <p className="text-sm font-sans text-[var(--color-text-secondary)] mt-3">Active Investors</p>
                        </div>
                        <div>
                            <AnimatedCounter end={340} suffix="%" />
                            <p className="text-sm font-sans text-[var(--color-text-secondary)] mt-3">Avg Returns</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About — Editorial drop cap paragraph */}
            <section className="py-20 md:py-28">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-[var(--color-text)] drop-cap">
                        In 2024, we created a new model for retail startup investing in India.
                        We curate the most promising startups across sectors — SaaS, Fintech,
                        HealthTech, AgriTech, and more — so that everyday Indians can build
                        serious wealth alongside founders building the future.
                    </p>
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-[var(--color-text)] mt-8">
                        Every startup on our platform is rigorously vetted. We review financials,
                        team track records, market potential, and legal compliance before
                        a single rupee can be invested.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 md:py-28 bg-[var(--color-card)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">How it works</h2>
                        <p className="section-subtitle">Start investing in three simple steps</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { step: '01', title: 'Sign Up & Complete KYC', desc: 'Create your account, verify PAN & Aadhaar, and link your bank account. Takes just 5 minutes.' },
                            { step: '02', title: 'Discover & Evaluate', desc: 'Browse vetted startups, study their metrics, team, and market potential. Use our deal room for deep dives.' },
                            { step: '03', title: 'Invest & Track', desc: 'Invest from ₹5,000 via UPI/NEFT. Track your portfolio performance and receive exit notifications.' },
                        ].map((item) => (
                            <div key={item.step} className="text-center group">
                                <div className="font-serif text-6xl font-bold text-cream-400 dark:text-charcoal-600 mb-6 transition-colors group-hover:text-accent-200 dark:group-hover:text-accent-800">{item.step}</div>
                                <h3 className="text-xl font-serif font-bold text-[var(--color-text)] mb-3">{item.title}</h3>
                                <p className="text-sm font-sans text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Startups */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="section-title">Featured Startups</h2>
                            <p className="section-subtitle !mx-0">Hand-picked high-potential opportunities</p>
                        </div>
                        <Link to="/startups" className="btn-secondary hidden md:flex text-sm !py-2 !px-5">
                            View All →
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featured.slice(0, 4).map(s => <StartupCard key={s.id} startup={s} />)}
                    </div>
                    <div className="mt-10 text-center md:hidden">
                        <Link to="/startups" className="btn-secondary text-sm">View All Startups →</Link>
                    </div>
                </div>
            </section>

            {/* Testimonials — Editorial style */}
            <section className="py-20 md:py-28 bg-[var(--color-card)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">What our investors say</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { name: 'Ritu Kapoor', role: 'Software Engineer, Pune', text: 'StakeMint opened up a world of investing I never knew existed. My ₹25,000 investment in a SaaS startup has already grown 2.8x in 14 months.' },
                            { name: 'Manish Verma', role: 'CA, Mumbai', text: 'The due diligence and transparency on StakeMint is unmatched. As a CA, I appreciate how thorough their financial vetting process is.' },
                            { name: 'Deepika Jain', role: 'Teacher, Delhi', text: 'I started with just ₹5,000 and now have stake in 4 startups. The platform makes it so easy to understand complex startup financials.' },
                        ].map((t) => (
                            <div key={t.name} className="group">
                                <p className="font-serif text-lg text-[var(--color-text)] leading-relaxed italic mb-6">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white font-serif font-semibold text-sm">{t.name.charAt(0)}</div>
                                    <div>
                                        <p className="text-sm font-sans font-semibold text-[var(--color-text)]">{t.name}</p>
                                        <p className="text-xs font-sans text-[var(--color-text-secondary)]">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-14 border-y border-[var(--color-border)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
                        {['SEBI Registered', 'Bank-Grade Security', '256-bit Encryption', 'DPIIT Recognized', 'ISO 27001'].map(badge => (
                            <div key={badge} className="flex items-center gap-2 text-sm font-sans text-[var(--color-text-secondary)]">
                                <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <span className="font-medium">{badge}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-28">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Frequently asked questions</h2>
                    </div>
                    <div className="space-y-0 border-t border-[var(--color-border)]">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-[var(--color-border)]">
                                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full py-5 text-left flex items-center justify-between gap-4">
                                    <span className="font-serif font-semibold text-[var(--color-text)] text-lg">{faq.q}</span>
                                    <svg className={`w-5 h-5 text-[var(--color-text-secondary)] shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                                    <p className="text-sm font-sans text-[var(--color-text-secondary)] leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-charcoal-700 dark:bg-charcoal-900 text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">Ready to invest<br />in the <em>future</em>?</h2>
                    <p className="text-lg font-sans text-cream-400 mb-10 max-w-lg mx-auto">Join 10,000+ Indians building wealth by backing the next generation of startups.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn-primary !bg-white !text-charcoal-700 hover:!bg-cream-200 text-base !py-3.5 !px-8">Create Free Account</Link>
                        <Link to="/startups" className="btn-secondary !border-charcoal-500 !text-cream-300 hover:!border-cream-400 hover:!text-white text-base !py-3.5 !px-8">Browse Startups</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
