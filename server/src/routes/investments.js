import { Router } from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Create investment
router.post('/', authMiddleware, (req, res) => {
    try {
        const { startup_id, amount, payment_method = 'upi' } = req.body;

        const startup = db.prepare('SELECT * FROM startups WHERE id = ? AND status = ?').get(startup_id, 'live');
        if (!startup) return res.status(404).json({ error: 'Startup not found or not accepting investments' });

        if (amount < startup.min_investment) {
            return res.status(400).json({ error: `Minimum investment is ₹${startup.min_investment.toLocaleString()}` });
        }

        // Check KYC
        const user = db.prepare('SELECT kyc_status FROM users WHERE id = ?').get(req.user.id);
        if (user.kyc_status !== 'approved') {
            return res.status(403).json({ error: 'KYC must be approved before investing' });
        }

        // Calculate equity
        const equityReceived = (amount / startup.valuation) * 100;
        const txnId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

        const result = db.prepare(`
      INSERT INTO investments (investor_id, startup_id, amount, equity_received, payment_status, payment_method, transaction_id)
      VALUES (?, ?, ?, ?, 'completed', ?, ?)
    `).run(req.user.id, startup_id, amount, equityReceived, payment_method, txnId);

        // Update raised amount
        db.prepare('UPDATE startups SET raised_amount = raised_amount + ? WHERE id = ?').run(amount, startup_id);

        // Create transaction record
        db.prepare('INSERT INTO transactions (user_id, type, amount, status, reference, startup_name) VALUES (?, ?, ?, ?, ?, ?)')
            .run(req.user.id, 'investment', amount, 'completed', txnId, startup.name);

        // Notify investor
        db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
            req.user.id, 'Investment Confirmed! 🎉',
            `You've successfully invested ₹${amount.toLocaleString()} in ${startup.name}. Transaction ID: ${txnId}`
        );

        // Notify founder
        db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
            startup.founder_id, 'New Investment Received! 💰',
            `An investor committed ₹${amount.toLocaleString()} to ${startup.name}.`
        );

        const investment = db.prepare('SELECT * FROM investments WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(investment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's investments (portfolio)
router.get('/portfolio', authMiddleware, (req, res) => {
    try {
        const investments = db.prepare(`
      SELECT i.*, s.name as startup_name, s.tagline, s.sector, s.logo_url, s.valuation, s.status as startup_status, s.stage
      FROM investments i
      JOIN startups s ON s.id = i.startup_id
      WHERE i.investor_id = ?
      ORDER BY i.created_at DESC
    `).all(req.user.id);

        const totalInvested = investments.reduce((sum, i) => sum + (i.payment_status === 'completed' ? i.amount : 0), 0);
        const activeInvestments = investments.filter(i => i.payment_status === 'completed');

        // Generate portfolio value with mock performance multipliers 
        const portfolioValue = activeInvestments.reduce((sum, i) => {
            const daysSinceInvestment = Math.max(1, Math.floor((Date.now() - new Date(i.created_at).getTime()) / (1000 * 60 * 60 * 24)));
            const multiplier = 1 + (daysSinceInvestment * 0.002 * (Math.random() * 0.5 + 0.75));
            return sum + i.amount * multiplier;
        }, 0);

        res.json({
            investments,
            summary: {
                total_invested: totalInvested,
                portfolio_value: Math.round(portfolioValue),
                total_startups: new Set(activeInvestments.map(i => i.startup_id)).size,
                total_returns: Math.round(portfolioValue - totalInvested),
                return_percentage: totalInvested > 0 ? Math.round(((portfolioValue - totalInvested) / totalInvested) * 100 * 10) / 10 : 0
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get portfolio chart data
router.get('/portfolio/chart', authMiddleware, (req, res) => {
    try {
        const investments = db.prepare(`
      SELECT i.amount, i.created_at FROM investments i
      WHERE i.investor_id = ? AND i.payment_status = 'completed'
      ORDER BY i.created_at ASC
    `).all(req.user.id);

        // Generate chart data over the last 12 months
        const chartData = [];
        const now = new Date();
        let cumulative = 0;

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = date.toISOString().slice(0, 7);
            const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });

            const monthInvestments = investments.filter(inv => inv.created_at.startsWith(monthStr));
            cumulative += monthInvestments.reduce((sum, inv) => sum + inv.amount, 0);

            const growth = cumulative * (1 + (11 - i) * 0.015);
            chartData.push({
                month: monthLabel,
                invested: Math.round(cumulative),
                value: Math.round(growth)
            });
        }

        res.json(chartData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
