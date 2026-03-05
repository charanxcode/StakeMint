# 🪙 StakeMint
### *Invest in Tomorrow's Unicorns — Starting ₹5,000*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: In Development](https://img.shields.io/badge/Status-In%20Development-yellow.svg)]()
[![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-orange.svg)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://postgresql.org)

---

## 📌 About This Project

**StakeMint** is a full-stack retail startup investment platform that allows everyday people to discover, evaluate, and invest in top-vetted high-growth startups — starting from as low as **₹5,000**.

> Built as a portfolio project to demonstrate full-stack development skills including authentication, role-based access control, payment integration, KYC flows, and data visualization.

---

## ✨ Features

### Investor
- Browse curated startup deals with filters & search
- Complete KYC via PAN + Aadhaar verification flow
- Invest with minimum ₹5,000 ticket size
- Track portfolio with performance charts
- Watchlist & investment history

### Startup Founder
- Apply to list startup with pitch deck & financials upload
- Track application status & investor interest
- Post updates to investors

### Admin
- Approve / reject startup applications
- Manage KYC verifications
- Monitor all transactions & platform analytics



## 🗂️ Project Structure

```
StakeMint/
├── client/                          # Frontend (Vite + React + TypeScript)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminInvestors.tsx
│   │   │   ├── AdminStartups.tsx
│   │   │   ├── AdminTransactions.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── FounderDashboard.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── InvestModal.tsx
│   │   │   ├── InvestorDashboard.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Onboarding.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── StartupApplication.tsx
│   │   │   ├── StartupDetail.tsx
│   │   │   └── StartupListing.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── server/                          # Backend (Node.js + Express)
    ├── src/
    │   ├── db/
    │   │   ├── database.js
    │   │   └── seed.js
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── routes/
    │   │   ├── admin.js
    │   │   ├── auth.js
    │   │   ├── investments.js
    │   │   └── startups.js
    │   └── index.js
    ├── .env
    ├── data.db
    ├── package.json
    └── package-lock.json

```


---



## 🗄️ Database Schema

```
users          → id, name, email, phone, role, kyc_status
kyc_details    → id, user_id, pan_number, aadhaar_number, status
startups       → id, founder_id, name, sector, target_raise,
                 raised_amount, min_investment, equity_offered,
                 valuation, close_date, status
team_members   → id, startup_id, name, role, linkedin_url
investments    → id, investor_id, startup_id, amount,
                 equity_received, payment_status
transactions   → id, user_id, type, amount, status, reference
watchlist      → id, investor_id, startup_id
notifications  → id, user_id, title, message, read
```


---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**StakeMint — Democratizing Startup Investing for Every Indian 🇮🇳**

⭐ *If you found this project useful, drop a star!*

</div>
