import { Router } from 'express';
import db from '../db/database.js';
import { authMiddleware, requireRole, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all live startups (public)
router.get('/', optionalAuth, (req, res) => {
    try {
        const { sector, stage, search, sort, min_investment, status } = req.query;
        let query = 'SELECT * FROM startups WHERE 1=1';
        const params = [];

        // For public: only show live startups unless admin or specific status
        if (req.user?.role === 'admin' && status) {
            query += ' AND status = ?';
            params.push(status);
        } else if (req.user?.role !== 'admin') {
            query += ' AND status = ?';
            params.push('live');
        }

        if (sector && sector !== 'all') {
            query += ' AND sector = ?';
            params.push(sector);
        }
        if (stage && stage !== 'all') {
            query += ' AND stage = ?';
            params.push(stage);
        }
        if (search) {
            query += ' AND (name LIKE ? OR tagline LIKE ? OR sector LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (min_investment) {
            query += ' AND min_investment <= ?';
            params.push(Number(min_investment));
        }

        // Sort
        if (sort === 'newest') query += ' ORDER BY created_at DESC';
        else if (sort === 'closing-soon') query += ' ORDER BY close_date ASC';
        else if (sort === 'most-funded') query += ' ORDER BY raised_amount DESC';
        else query += ' ORDER BY featured DESC, raised_amount DESC';

        const startups = db.prepare(query).all(...params);

        // Attach team members to each startup
        const startupsWithTeam = startups.map(s => {
            const team = db.prepare('SELECT * FROM team_members WHERE startup_id = ?').all(s.id);
            const investorCount = db.prepare('SELECT COUNT(DISTINCT investor_id) as count FROM investments WHERE startup_id = ? AND payment_status = ?').get(s.id, 'completed');
            return { ...s, team, investor_count: investorCount?.count || 0 };
        });

        res.json(startupsWithTeam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single startup
router.get('/:id', optionalAuth, (req, res) => {
    try {
        const startup = db.prepare('SELECT * FROM startups WHERE id = ?').get(req.params.id);
        if (!startup) return res.status(404).json({ error: 'Startup not found' });

        const team = db.prepare('SELECT * FROM team_members WHERE startup_id = ?').all(startup.id);
        const investorCount = db.prepare('SELECT COUNT(DISTINCT investor_id) as count FROM investments WHERE startup_id = ? AND payment_status = ?').get(startup.id, 'completed');
        const totalInvestments = db.prepare('SELECT COUNT(*) as count FROM investments WHERE startup_id = ? AND payment_status = ?').get(startup.id, 'completed');

        let isWatchlisted = false;
        if (req.user) {
            const w = db.prepare('SELECT id FROM watchlist WHERE investor_id = ? AND startup_id = ?').get(req.user.id, startup.id);
            isWatchlisted = !!w;
        }

        res.json({ ...startup, team, investor_count: investorCount?.count || 0, total_investments: totalInvestments?.count || 0, is_watchlisted: isWatchlisted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create startup application (founder)
router.post('/', authMiddleware, (req, res) => {
    try {
        const {
            name, tagline, sector, stage, description, problem, solution, traction, market_size,
            business_model, target_raise, min_investment, equity_offered, valuation,
            arr, mom_growth, burn_rate, use_of_funds, close_date, cin, registration_number, team
        } = req.body;

        const result = db.prepare(`
      INSERT INTO startups (founder_id, name, tagline, sector, stage, description, problem, solution,
        traction, market_size, business_model, target_raise, min_investment, equity_offered, valuation,
        arr, mom_growth, burn_rate, use_of_funds, close_date, cin, registration_number, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
            req.user.id, name, tagline, sector, stage || 'seed', description, problem, solution,
            traction, market_size, business_model, target_raise || 0, min_investment || 5000,
            equity_offered || 0, valuation || 0, arr || 0, mom_growth || 0, burn_rate || 0,
            use_of_funds, close_date, cin, registration_number
        );

        // Add team members
        if (team && Array.isArray(team)) {
            const insertTeam = db.prepare('INSERT INTO team_members (startup_id, name, role, linkedin_url) VALUES (?, ?, ?, ?)');
            for (const member of team) {
                insertTeam.run(result.lastInsertRowid, member.name, member.role, member.linkedin_url || null);
            }
        }

        // Notify admin
        const admins = db.prepare('SELECT id FROM users WHERE role = ?').all('admin');
        const notifStmt = db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)');
        for (const admin of admins) {
            notifStmt.run(admin.id, 'New Startup Application', `${name} has applied to list on StakeMint.`);
        }

        const startup = db.prepare('SELECT * FROM startups WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(startup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get founder's startups
router.get('/founder/mine', authMiddleware, (req, res) => {
    try {
        const startups = db.prepare('SELECT * FROM startups WHERE founder_id = ? ORDER BY created_at DESC').all(req.user.id);
        const enriched = startups.map(s => {
            const team = db.prepare('SELECT * FROM team_members WHERE startup_id = ?').all(s.id);
            const investorCount = db.prepare('SELECT COUNT(DISTINCT investor_id) as count FROM investments WHERE startup_id = ? AND payment_status = ?').get(s.id, 'completed');
            const totalRaised = db.prepare('SELECT SUM(amount) as total FROM investments WHERE startup_id = ? AND payment_status = ?').get(s.id, 'completed');
            return { ...s, team, investor_count: investorCount?.count || 0, actual_raised: totalRaised?.total || 0 };
        });
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle watchlist
router.post('/:id/watchlist', authMiddleware, (req, res) => {
    try {
        const existing = db.prepare('SELECT id FROM watchlist WHERE investor_id = ? AND startup_id = ?').get(req.user.id, req.params.id);
        if (existing) {
            db.prepare('DELETE FROM watchlist WHERE id = ?').run(existing.id);
            res.json({ watchlisted: false });
        } else {
            db.prepare('INSERT INTO watchlist (investor_id, startup_id) VALUES (?, ?)').run(req.user.id, req.params.id);
            res.json({ watchlisted: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get watchlist
router.get('/user/watchlist', authMiddleware, (req, res) => {
    try {
        const items = db.prepare(`
      SELECT s.*, w.added_at as watchlisted_at FROM watchlist w
      JOIN startups s ON s.id = w.startup_id
      WHERE w.investor_id = ? ORDER BY w.added_at DESC
    `).all(req.user.id);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
