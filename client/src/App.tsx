import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const StartupListing = lazy(() => import('./pages/StartupListing'));
const StartupDetail = lazy(() => import('./pages/StartupDetail'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Blog = lazy(() => import('./pages/Blog'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const InvestorDashboard = lazy(() => import('./pages/InvestorDashboard'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Settings = lazy(() => import('./pages/Settings'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const InvestModal = lazy(() => import('./pages/InvestModal'));
const FounderDashboard = lazy(() => import('./pages/FounderDashboard'));
const StartupApplication = lazy(() => import('./pages/StartupApplication'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminStartups = lazy(() => import('./pages/AdminStartups'));
const AdminInvestors = lazy(() => import('./pages/AdminInvestors'));
const AdminTransactions = lazy(() => import('./pages/AdminTransactions'));

function Loader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>
            </div>
        </div>
    );
}

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
    const { user, loading } = useAuth();
    if (loading) return <Loader />;
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
    return <>{children}</>;
}

export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Suspense fallback={<Loader />}>
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/startups" element={<StartupListing />} />
                        <Route path="/startups/:id" element={<StartupDetail />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Investor */}
                        <Route path="/dashboard" element={<ProtectedRoute roles={['investor']}><InvestorDashboard /></ProtectedRoute>} />
                        <Route path="/portfolio" element={<ProtectedRoute roles={['investor']}><Portfolio /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute roles={['investor', 'founder']}><Settings /></ProtectedRoute>} />
                        <Route path="/onboarding" element={<ProtectedRoute roles={['investor']}><Onboarding /></ProtectedRoute>} />
                        <Route path="/invest/:id" element={<ProtectedRoute roles={['investor']}><InvestModal /></ProtectedRoute>} />

                        {/* Founder */}
                        <Route path="/founder/dashboard" element={<ProtectedRoute roles={['founder']}><FounderDashboard /></ProtectedRoute>} />
                        <Route path="/founder/apply" element={<ProtectedRoute roles={['founder']}><StartupApplication /></ProtectedRoute>} />

                        {/* Admin */}
                        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/startups" element={<ProtectedRoute roles={['admin']}><AdminStartups /></ProtectedRoute>} />
                        <Route path="/admin/investors" element={<ProtectedRoute roles={['admin']}><AdminInvestors /></ProtectedRoute>} />
                        <Route path="/admin/transactions" element={<ProtectedRoute roles={['admin']}><AdminTransactions /></ProtectedRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
