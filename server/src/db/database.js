import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../data.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create all tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'investor' CHECK(role IN ('investor','founder','admin')),
    kyc_status TEXT DEFAULT 'pending' CHECK(kyc_status IN ('pending','submitted','approved','rejected')),
    dob TEXT,
    bank_account TEXT,
    bank_ifsc TEXT,
    bank_name TEXT,
    avatar_url TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS kyc_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    pan_number TEXT,
    aadhaar_number TEXT,
    document_url TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','submitted','approved','rejected')),
    verified_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS startups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    founder_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    sector TEXT,
    stage TEXT DEFAULT 'seed' CHECK(stage IN ('pre-seed','seed','series-a','series-b','growth')),
    logo_url TEXT,
    cover_url TEXT,
    description TEXT,
    problem TEXT,
    solution TEXT,
    traction TEXT,
    market_size TEXT,
    business_model TEXT,
    target_raise REAL DEFAULT 0,
    raised_amount REAL DEFAULT 0,
    min_investment REAL DEFAULT 5000,
    equity_offered REAL DEFAULT 0,
    valuation REAL DEFAULT 0,
    arr REAL DEFAULT 0,
    mom_growth REAL DEFAULT 0,
    burn_rate REAL DEFAULT 0,
    use_of_funds TEXT,
    pitch_deck_url TEXT,
    financials_url TEXT,
    close_date TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','live','closed','draft')),
    cin TEXT,
    registration_number TEXT,
    featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    linkedin_url TEXT,
    photo_url TEXT,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    investor_id INTEGER NOT NULL,
    startup_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    equity_received REAL,
    payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending','completed','failed','refunded')),
    payment_method TEXT,
    transaction_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (investor_id) REFERENCES users(id),
    FOREIGN KEY (startup_id) REFERENCES startups(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('investment','refund','withdrawal','deposit')),
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','completed','failed')),
    reference TEXT,
    startup_name TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    investor_id INTEGER NOT NULL,
    startup_id INTEGER NOT NULL,
    added_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (investor_id) REFERENCES users(id),
    FOREIGN KEY (startup_id) REFERENCES startups(id),
    UNIQUE(investor_id, startup_id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    author TEXT DEFAULT 'StakeMint Team',
    published INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
