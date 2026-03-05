import db from './database.js';
import bcrypt from 'bcryptjs';

console.log('🌱 Seeding database...');

// Clear existing data
db.exec(`
  DELETE FROM notifications;
  DELETE FROM watchlist;
  DELETE FROM transactions;
  DELETE FROM investments;
  DELETE FROM team_members;
  DELETE FROM blog_posts;
  DELETE FROM kyc_details;
  DELETE FROM startups;
  DELETE FROM users;
`);

// Create admin
const adminHash = bcrypt.hashSync('Admin@123', 10);
db.prepare(`INSERT INTO users (name, email, phone, password_hash, role, kyc_status) VALUES (?, ?, ?, ?, ?, ?)`)
    .run('Platform Admin', 'admin@platform.com', '9876543210', adminHash, 'admin', 'approved');

// Create investors
const investorHash = bcrypt.hashSync('Investor@123', 10);
const investors = [
    { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543211' },
    { name: 'Rahul Mehta', email: 'rahul@example.com', phone: '9876543212' },
    { name: 'Ananya Gupta', email: 'ananya@example.com', phone: '9876543213' },
];

const investorIds = [];
for (const inv of investors) {
    const res = db.prepare(`INSERT INTO users (name, email, phone, password_hash, role, kyc_status) VALUES (?, ?, ?, ?, 'investor', 'approved')`)
        .run(inv.name, inv.email, inv.phone, investorHash);
    investorIds.push(Number(res.lastInsertRowid));
    db.prepare('INSERT INTO kyc_details (user_id, pan_number, aadhaar_number, status) VALUES (?, ?, ?, ?)')
        .run(res.lastInsertRowid, 'ABCDE' + Math.floor(1000 + Math.random() * 9000) + 'F', Math.floor(100000000000 + Math.random() * 899999999999).toString(), 'approved');
}

// Create founders
const founderHash = bcrypt.hashSync('Founder@123', 10);
const founders = [
    { name: 'Vikram Rathi', email: 'vikram@example.com', phone: '9876543220' },
    { name: 'Sneha Iyer', email: 'sneha@example.com', phone: '9876543221' },
    { name: 'Arjun Patel', email: 'arjun@example.com', phone: '9876543222' },
    { name: 'Meera Krishnan', email: 'meera@example.com', phone: '9876543223' },
    { name: 'Karthik Nair', email: 'karthik@example.com', phone: '9876543224' },
    { name: 'Deepa Reddy', email: 'deepa@example.com', phone: '9876543225' },
    { name: 'Ravi Sundaram', email: 'ravi@example.com', phone: '9876543226' },
    { name: 'Pooja Malhotra', email: 'pooja@example.com', phone: '9876543227' },
];

const founderIds = [];
for (const f of founders) {
    const res = db.prepare(`INSERT INTO users (name, email, phone, password_hash, role, kyc_status) VALUES (?, ?, ?, ?, 'founder', 'approved')`)
        .run(f.name, f.email, f.phone, founderHash);
    founderIds.push(res.lastInsertRowid);
}

// Create 8 startups
const startups = [
    {
        founder_idx: 0, name: 'CloudNine SaaS', tagline: 'AI-powered business analytics for SMBs',
        sector: 'SaaS', stage: 'seed', description: 'CloudNine SaaS provides an AI-driven analytics suite designed for small and medium businesses. Our platform transforms complex data into actionable insights, helping businesses make smarter decisions with enterprise-grade tools at SMB-friendly prices.',
        problem: 'SMBs lack access to affordable, easy-to-use business analytics tools. Most solutions are built for enterprises and require dedicated data teams.',
        solution: 'An AI-first analytics platform that auto-connects to common business tools (accounting, CRM, inventory) and generates insights, forecasts, and action items without any data expertise required.',
        traction: '2,500+ active business users. Processing 10M+ data points daily. NPS of 72.',
        market_size: '₹45,000 Cr total addressable market for SMB SaaS in India',
        target_raise: 5000000, raised_amount: 3250000, min_investment: 5000, equity_offered: 4.5, valuation: 110000000,
        arr: 18000000, mom_growth: 18, burn_rate: 1200000, close_date: '2026-06-15',
        use_of_funds: 'Product development (40%), Sales & Marketing (35%), Hiring (15%), Operations (10%)',
        team: [
            { name: 'Vikram Rathi', role: 'CEO & Co-founder', linkedin: 'linkedin.com/in/vikramrathi' },
            { name: 'Aditya Sen', role: 'CTO & Co-founder', linkedin: 'linkedin.com/in/adityasen' },
            { name: 'Nisha Roy', role: 'VP Product', linkedin: 'linkedin.com/in/nisharoy' }
        ]
    },
    {
        founder_idx: 1, name: 'PaySetu', tagline: 'Unified payments infra for Bharat',
        sector: 'Fintech', stage: 'series-a', description: 'PaySetu is building the unified payments infrastructure layer for India, enabling seamless UPI, card, and wallet payments through a single API. We serve merchants from kirana stores to large e-commerce platforms.',
        problem: 'Payment integration in India is fragmented. Merchants deal with multiple gateways, high failure rates, and poor reconciliation.',
        solution: 'A single API that abstracts all payment methods (UPI, cards, wallets, BNPL) with 99.97% uptime, smart routing for higher success rates, and real-time reconciliation dashboards.',
        traction: '15,000+ active merchants. ₹850Cr monthly transaction volume. 99.97% uptime.',
        market_size: '₹2,00,000 Cr digital payments market in India',
        target_raise: 15000000, raised_amount: 11200000, min_investment: 10000, equity_offered: 3.2, valuation: 470000000,
        arr: 72000000, mom_growth: 22, burn_rate: 4500000, close_date: '2026-05-01',
        use_of_funds: 'Engineering (45%), Compliance & Licensing (20%), Merchant Acquisition (25%), Ops (10%)',
        team: [
            { name: 'Sneha Iyer', role: 'CEO & Founder', linkedin: 'linkedin.com/in/snehaiyer' },
            { name: 'Rajesh Kumar', role: 'CTO', linkedin: 'linkedin.com/in/rajeshkumar' },
            { name: 'Divya Menon', role: 'Head of Compliance', linkedin: 'linkedin.com/in/divyamenon' }
        ]
    },
    {
        founder_idx: 2, name: 'KisanDirect', tagline: 'Farm-to-fork marketplace eliminating middlemen',
        sector: 'AgriTech', stage: 'seed', description: 'KisanDirect connects farmers directly with retailers and restaurants, eliminating 3-4 layers of middlemen. Farmers earn 40% more while buyers get fresher produce at 20% lower costs.',
        problem: 'Indian farmers lose 30-60% of produce value to middlemen. End consumers pay inflated prices for stale produce.',
        solution: 'A tech-enabled supply chain with demand prediction, cold storage network, and direct farmer-to-buyer logistics. Our app lets farmers list produce and get instant price discovery.',
        traction: '8,000+ registered farmers across Maharashtra and Karnataka. 500+ restaurant partners.',
        market_size: '₹5,00,000 Cr agricultural supply chain market',
        target_raise: 8000000, raised_amount: 2400000, min_investment: 5000, equity_offered: 6.0, valuation: 130000000,
        arr: 9500000, mom_growth: 25, burn_rate: 1800000, close_date: '2026-07-30',
        use_of_funds: 'Cold chain infra (35%), Tech platform (30%), Farmer onboarding (20%), Ops (15%)',
        team: [
            { name: 'Arjun Patel', role: 'CEO & Founder', linkedin: 'linkedin.com/in/arjunpatel' },
            { name: 'Snehal Kulkarni', role: 'COO', linkedin: 'linkedin.com/in/snehalkulkarni' },
            { name: 'Amit Deshmukh', role: 'Head of Supply Chain', linkedin: 'linkedin.com/in/amitdeshmukh' }
        ]
    },
    {
        founder_idx: 3, name: 'MediBridge', tagline: 'AI diagnostics for Tier-2/3 India',
        sector: 'HealthTech', stage: 'seed', description: 'MediBridge brings AI-powered preliminary diagnostics to Tier-2 and Tier-3 cities where specialist doctors are scarce. Our app helps local clinics provide better care through AI-assisted diagnosis and telemedicine.',
        problem: '70% of India\'s specialists practice in metros. Rural and semi-urban areas have 1 doctor per 25,000 people.',
        solution: 'AI diagnostic models trained on 5M+ Indian medical records that assist local doctors with preliminary screening, symptom analysis, and specialist teleconsultation booking.',
        traction: '350+ clinics onboarded. 50,000+ consultations facilitated. 94% diagnosis accuracy.',
        market_size: '₹80,000 Cr telemedicine and digital health market',
        target_raise: 6000000, raised_amount: 4800000, min_investment: 5000, equity_offered: 5.0, valuation: 120000000,
        arr: 14000000, mom_growth: 20, burn_rate: 1500000, close_date: '2026-04-20',
        use_of_funds: 'AI R&D (40%), Clinic partnerships (30%), Regulatory (15%), Team (15%)',
        team: [
            { name: 'Meera Krishnan', role: 'CEO & Founder', linkedin: 'linkedin.com/in/meerakrishnan' },
            { name: 'Dr. Suresh Babu', role: 'Chief Medical Officer', linkedin: 'linkedin.com/in/drsureshbabu' },
            { name: 'Prateek Joshi', role: 'Head of AI', linkedin: 'linkedin.com/in/prateekjoshi' }
        ]
    },
    {
        founder_idx: 4, name: 'SkillForge', tagline: 'Vernacular upskilling for blue-collar India',
        sector: 'EdTech', stage: 'pre-seed', description: 'SkillForge offers bite-sized vocational training in 12 Indian languages, targeting blue-collar and gig-economy workers who need practical skills but cannot access traditional education.',
        problem: '300M+ Indian workers lack formal skills training. Existing EdTech serves only English-speaking, white-collar audiences.',
        solution: 'Micro-learning modules in vernacular languages with practical video content, hands-on assessment, and direct job placement integration with gig platforms.',
        traction: '45,000+ learners. 120+ courses in 8 languages. 68% course completion rate.',
        market_size: '₹35,000 Cr vocational training market',
        target_raise: 3000000, raised_amount: 900000, min_investment: 5000, equity_offered: 8.0, valuation: 37500000,
        arr: 4200000, mom_growth: 30, burn_rate: 800000, close_date: '2026-08-15',
        use_of_funds: 'Content creation (40%), Platform development (30%), Marketing (20%), Ops (10%)',
        team: [
            { name: 'Karthik Nair', role: 'CEO & Founder', linkedin: 'linkedin.com/in/karthiknair' },
            { name: 'Lakshmi Menon', role: 'Head of Content', linkedin: 'linkedin.com/in/lakshmimenon' }
        ]
    },
    {
        founder_idx: 5, name: 'NativeBrew', tagline: 'Craft Indian beverages for the modern consumer',
        sector: 'D2C', stage: 'seed', description: 'NativeBrew creates premium craft beverages using traditional Indian ingredients — turmeric lattes, filter coffee concentrates, masala chai blends — packaged beautifully for the modern health-conscious consumer.',
        problem: 'India\'s ₹1.5L Cr beverage market is dominated by multinational brands. Authentic Indian flavors lack premium packaging and distribution.',
        solution: 'A D2C brand with 15 SKUs of premium Indian beverages, subscription model, and strategic offline presence in premium grocery chains. 100% natural ingredients, zero preservatives.',
        traction: '12,000+ monthly subscribers. Available in 200+ premium stores. 4.7★ average rating.',
        market_size: '₹1,50,000 Cr Indian beverages market',
        target_raise: 4000000, raised_amount: 3100000, min_investment: 5000, equity_offered: 5.5, valuation: 72000000,
        arr: 24000000, mom_growth: 15, burn_rate: 2000000, close_date: '2026-05-30',
        use_of_funds: 'Manufacturing scale-up (35%), Marketing (30%), New SKU R&D (20%), Retail expansion (15%)',
        team: [
            { name: 'Deepa Reddy', role: 'CEO & Founder', linkedin: 'linkedin.com/in/deepareddy' },
            { name: 'Anand Sharma', role: 'Head of Operations', linkedin: 'linkedin.com/in/anandsharma' },
            { name: 'Kavita Rao', role: 'Brand Director', linkedin: 'linkedin.com/in/kavitarao' }
        ]
    },
    {
        founder_idx: 6, name: 'GreenGrid Energy', tagline: 'Solar micro-grids for rural electrification',
        sector: 'CleanTech', stage: 'series-a', description: 'GreenGrid deploys solar-powered micro-grids in underserved rural communities, providing reliable and affordable electricity to villages that face 8-12 hours of daily power cuts.',
        problem: '240M+ Indians face unreliable electricity. Rural areas suffer as grid infrastructure is costly to extend.',
        solution: 'Modular solar micro-grids with smart metering and pay-as-you-go billing via mobile. Each unit powers 100-200 households with 99.5% uptime at 30% lower cost than diesel generators.',
        traction: '85 micro-grids deployed. 18,000+ households powered. ₹2.1Cr monthly revenue.',
        market_size: '₹90,000 Cr rural energy market',
        target_raise: 12000000, raised_amount: 7800000, min_investment: 10000, equity_offered: 4.0, valuation: 300000000,
        arr: 25200000, mom_growth: 12, burn_rate: 3500000, close_date: '2026-06-30',
        use_of_funds: 'Micro-grid deployment (50%), Technology (20%), Operations (20%), Team (10%)',
        team: [
            { name: 'Ravi Sundaram', role: 'CEO & Founder', linkedin: 'linkedin.com/in/ravisundaram' },
            { name: 'Sunil Mehta', role: 'CTO', linkedin: 'linkedin.com/in/sunilmehta' },
            { name: 'Geeta Kulkarni', role: 'Head of Operations', linkedin: 'linkedin.com/in/geetakulkarni' }
        ]
    },
    {
        founder_idx: 7, name: 'SwiftHaul', tagline: 'AI-optimized last-mile logistics',
        sector: 'LogisticsTech', stage: 'seed', description: 'SwiftHaul uses AI route optimization and a network of electric vehicles to provide fast, affordable, and eco-friendly last-mile delivery services for e-commerce and D2C brands.',
        problem: 'Last-mile delivery accounts for 53% of total shipping costs. Inefficient routing and high fuel costs make delivery expensive.',
        solution: 'AI-powered route optimization reduces delivery costs by 35%. Our EV fleet cuts carbon emissions by 70%. Real-time tracking and 2-hour delivery windows in 15 cities.',
        traction: '200+ brand partners. 50,000+ daily deliveries. Operating in 15 cities.',
        market_size: '₹65,000 Cr last-mile logistics market',
        target_raise: 10000000, raised_amount: 5500000, min_investment: 5000, equity_offered: 4.8, valuation: 210000000,
        arr: 36000000, mom_growth: 20, burn_rate: 3000000, close_date: '2026-07-15',
        use_of_funds: 'EV Fleet Expansion (40%), Technology (25%), City Expansion (25%), Ops (10%)',
        team: [
            { name: 'Pooja Malhotra', role: 'CEO & Founder', linkedin: 'linkedin.com/in/poojamalhotra' },
            { name: 'Nikhil Verma', role: 'CTO', linkedin: 'linkedin.com/in/nikhilverma' },
            { name: 'Sameer Khan', role: 'VP Operations', linkedin: 'linkedin.com/in/sameerkhan' }
        ]
    }
];

const insertStartup = db.prepare(`
  INSERT INTO startups (founder_id, name, tagline, sector, stage, description, problem, solution, 
    traction, market_size, target_raise, raised_amount, min_investment, equity_offered, valuation,
    arr, mom_growth, burn_rate, use_of_funds, close_date, status, featured, business_model, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'live', ?, ?, datetime('now', ?))
`);

const insertTeamMember = db.prepare(
    'INSERT INTO team_members (startup_id, name, role, linkedin_url) VALUES (?, ?, ?, ?)'
);

const startupIds = [];
startups.forEach((s, idx) => {
    const featured = idx < 4 ? 1 : 0;
    const daysAgo = `-${30 - idx * 3} days`;
    const result = insertStartup.run(
        founderIds[s.founder_idx], s.name, s.tagline, s.sector, s.stage, s.description,
        s.problem, s.solution, s.traction, s.market_size, s.target_raise, s.raised_amount,
        s.min_investment, s.equity_offered, s.valuation, s.arr, s.mom_growth, s.burn_rate,
        s.use_of_funds, s.close_date, featured, 'B2B SaaS / Subscription', daysAgo
    );
    startupIds.push(Number(result.lastInsertRowid));
    for (const member of s.team) {
        insertTeamMember.run(result.lastInsertRowid, member.name, member.role, member.linkedin);
    }
});

// Create sample investments (using index-based references into investorIds and startupIds)
const investmentData = [
    { investor: 0, startup: 0, amount: 25000 },
    { investor: 0, startup: 1, amount: 50000 },
    { investor: 0, startup: 3, amount: 10000 },
    { investor: 0, startup: 5, amount: 15000 },
    { investor: 1, startup: 0, amount: 100000 },
    { investor: 1, startup: 2, amount: 25000 },
    { investor: 1, startup: 6, amount: 50000 },
    { investor: 2, startup: 1, amount: 30000 },
    { investor: 2, startup: 4, amount: 20000 },
    { investor: 2, startup: 7, amount: 10000 },
];

const insertInvestment = db.prepare(`
  INSERT INTO investments (investor_id, startup_id, amount, equity_received, payment_status, payment_method, transaction_id, created_at)
  VALUES (?, ?, ?, ?, 'completed', 'upi', ?, datetime('now', ?))
`);

const insertTransaction = db.prepare(`
  INSERT INTO transactions (user_id, type, amount, status, reference, startup_name, created_at)
  VALUES (?, 'investment', ?, 'completed', ?, ?, datetime('now', ?))
`);

investmentData.forEach((inv, idx) => {
    const actualStartupId = startupIds[inv.startup];
    const startupRow = db.prepare('SELECT * FROM startups WHERE id = ?').get(actualStartupId);
    if (!startupRow) return;
    const equity = (inv.amount / startupRow.valuation) * 100;
    const txnId = 'TXN' + (Date.now() + idx).toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    const daysAgo = `-${20 - idx * 2} days`;
    insertInvestment.run(investorIds[inv.investor], actualStartupId, inv.amount, equity, txnId, daysAgo);
    insertTransaction.run(investorIds[inv.investor], inv.amount, txnId, startupRow.name, daysAgo);
});

// Add watchlist entries (using actual IDs)
db.prepare('INSERT INTO watchlist (investor_id, startup_id) VALUES (?, ?)').run(investorIds[0], startupIds[2]);
db.prepare('INSERT INTO watchlist (investor_id, startup_id) VALUES (?, ?)').run(investorIds[0], startupIds[4]);
db.prepare('INSERT INTO watchlist (investor_id, startup_id) VALUES (?, ?)').run(investorIds[0], startupIds[6]);
db.prepare('INSERT INTO watchlist (investor_id, startup_id) VALUES (?, ?)').run(investorIds[1], startupIds[0]);
db.prepare('INSERT INTO watchlist (investor_id, startup_id) VALUES (?, ?)').run(investorIds[1], startupIds[3]);

// Add blog posts
const blogPosts = [
    {
        title: 'Why Retail Investors Should Look at Startup Equity',
        slug: 'why-retail-investors-startup-equity',
        excerpt: 'Traditional investments return 12-15% annually. Early startup equity can return 10-100x. Here\'s how retail investors can participate safely.',
        content: 'The democratization of startup investing is one of the most exciting financial trends in India...',
        author: 'StakeMint Research',
    },
    {
        title: 'Understanding Startup Valuations: A Beginner\'s Guide',
        slug: 'understanding-startup-valuations',
        excerpt: 'Pre-money, post-money, revenue multiples — learn the basics of how startups are valued and what it means for your investment.',
        content: 'Valuation is both an art and a science. For early-stage startups, traditional metrics like P/E ratios don\'t apply...',
        author: 'StakeMint Research',
    },
    {
        title: 'SEBI\'s New Framework for Startup Investment Platforms',
        slug: 'sebi-framework-startup-platforms',
        excerpt: 'SEBI has introduced new regulations that make it easier and safer for retail investors to participate in startup funding rounds.',
        content: 'In a landmark move, SEBI has announced a comprehensive framework for regulating startup investment platforms...',
        author: 'StakeMint Legal',
    },
];

for (const post of blogPosts) {
    db.prepare('INSERT INTO blog_posts (title, slug, excerpt, content, author, published) VALUES (?, ?, ?, ?, ?, 1)')
        .run(post.title, post.slug, post.excerpt, post.content, post.author);
}

// Notifications for investors (using actual IDs)
db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(investorIds[0], 'Welcome to StakeMint! 🎉', 'Your account has been created and KYC verified. Start exploring startups!');
db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(investorIds[0], 'Investment Confirmed! 💰', 'You invested ₹25,000 in CloudNine SaaS.');
db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(investorIds[0], 'New Startup Listed! 🚀', 'SwiftHaul is now live on StakeMint. Check it out!');
db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(investorIds[1], 'Welcome to StakeMint! 🎉', 'Your account has been created and KYC verified.');
db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(investorIds[1], 'Portfolio Update 📊', 'CloudNine SaaS reported 22% MoM growth this quarter.');

console.log('✅ Seed data created successfully!');
console.log('   - 1 admin (admin@platform.com / Admin@123)');
console.log('   - 3 investors (priya@example.com, rahul@example.com, ananya@example.com / Investor@123)');
console.log('   - 8 founders');
console.log('   - 8 startups (all live)');
console.log('   - 10 sample investments');
console.log('   - 3 blog posts');
console.log('   - Sample notifications & watchlist entries');
