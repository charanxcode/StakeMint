import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { BlogPost } from '../types';

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getBlogPosts().then(setPosts).catch(() => { }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[var(--color-text)] mb-3">Blog & Insights</h1>
                <p className="text-[var(--color-text-secondary)]">Expert analysis, market trends, and startup investing education</p>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="stat-card animate-pulse"><div className="h-40 bg-gray-200 dark:bg-navy-400 rounded-xl mb-4" /><div className="h-5 bg-gray-200 dark:bg-navy-400 rounded w-3/4 mb-2" /><div className="h-4 bg-gray-200 dark:bg-navy-400 rounded w-full" /></div>)}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20"><p className="text-[var(--color-text-secondary)]">No blog posts yet. Check back soon!</p></div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <article key={post.id} className="stat-card group cursor-pointer hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                            <div className="h-40 bg-gradient-to-br from-accent-500/10 to-emerald-500/10 rounded-xl mb-4 flex items-center justify-center text-5xl">📰</div>
                            <div className="space-y-3">
                                <p className="text-xs text-[var(--color-text-secondary)]">{post.author} · {new Date(post.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                <h2 className="text-lg font-bold text-[var(--color-text)] group-hover:text-accent-500 transition-colors">{post.title}</h2>
                                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3">{post.excerpt}</p>
                                <span className="inline-block text-sm text-accent-500 font-medium">Read More →</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
