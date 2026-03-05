import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-charcoal-700 dark:bg-charcoal-900 text-cream-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg">S</div>
                            <span className="text-xl font-serif font-bold text-white tracking-tight">StakeMint</span>
                        </div>
                        <p className="text-cream-400 text-sm leading-relaxed font-sans">
                            Invest in tomorrow's unicorns starting ₹5,000.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-serif font-semibold mb-4 text-white text-sm tracking-wide">Platform</h4>
                        <ul className="space-y-3 text-sm text-cream-400 font-sans">
                            <li><Link to="/startups" className="hover:text-white transition-colors">Explore Startups</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Blog & News</Link></li>
                            <li><Link to="/register?role=founder" className="hover:text-white transition-colors">List Your Startup</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-serif font-semibold mb-4 text-white text-sm tracking-wide">Legal</h4>
                        <ul className="space-y-3 text-sm text-cream-400 font-sans">
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Risk Disclosure</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">SEBI Compliance</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-serif font-semibold mb-4 text-white text-sm tracking-wide">Contact</h4>
                        <ul className="space-y-3 text-sm text-cream-400 font-sans">
                            <li>hello@stakemint.in</li>
                            <li>+91 98765 43210</li>
                            <li>Koramangala, Bengaluru</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-charcoal-500 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-cream-500 font-sans">© 2026 StakeMint Technologies Pvt. Ltd.</p>
                    <div className="flex items-center gap-5">
                        {[
                            { name: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                            { name: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 2a2 2 0 100 4 2 2 0 000-4z' },
                            { name: 'Instagram', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z' },
                        ].map(s => (
                            <a key={s.name} href="#" className="text-cream-500 hover:text-white transition-colors" aria-label={s.name}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.path} /></svg>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
