export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'investor' | 'founder' | 'admin';
    kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected';
    dob?: string;
    bank_account?: string;
    bank_ifsc?: string;
    bank_name?: string;
    avatar_url?: string;
    created_at: string;
}

export interface KycDetails {
    id: number;
    user_id: number;
    pan_number?: string;
    aadhaar_number?: string;
    document_url?: string;
    status: string;
    verified_at?: string;
}

export interface TeamMember {
    id: number;
    startup_id: number;
    name: string;
    role?: string;
    linkedin_url?: string;
    photo_url?: string;
}

export interface Startup {
    id: number;
    founder_id: number;
    name: string;
    tagline?: string;
    sector?: string;
    stage?: string;
    logo_url?: string;
    cover_url?: string;
    description?: string;
    problem?: string;
    solution?: string;
    traction?: string;
    market_size?: string;
    business_model?: string;
    target_raise: number;
    raised_amount: number;
    min_investment: number;
    equity_offered: number;
    valuation: number;
    arr?: number;
    mom_growth?: number;
    burn_rate?: number;
    use_of_funds?: string;
    pitch_deck_url?: string;
    financials_url?: string;
    close_date?: string;
    status: string;
    cin?: string;
    registration_number?: string;
    featured?: number;
    created_at: string;
    team?: TeamMember[];
    investor_count?: number;
    total_investments?: number;
    is_watchlisted?: boolean;
    founder_name?: string;
    founder_email?: string;
}

export interface Investment {
    id: number;
    investor_id: number;
    startup_id: number;
    amount: number;
    equity_received?: number;
    payment_status: string;
    payment_method?: string;
    transaction_id?: string;
    created_at: string;
    startup_name?: string;
    tagline?: string;
    sector?: string;
    logo_url?: string;
    valuation?: number;
    startup_status?: string;
    stage?: string;
}

export interface Transaction {
    id: number;
    user_id: number;
    type: string;
    amount: number;
    status: string;
    reference?: string;
    startup_name?: string;
    created_at: string;
    user_name?: string;
    user_email?: string;
}

export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message?: string;
    read: number;
    created_at: string;
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    cover_image?: string;
    author?: string;
    published: number;
    created_at: string;
}

export interface PortfolioSummary {
    total_invested: number;
    portfolio_value: number;
    total_startups: number;
    total_returns: number;
    return_percentage: number;
}

export interface ChartDataPoint {
    month: string;
    invested: number;
    value: number;
}
