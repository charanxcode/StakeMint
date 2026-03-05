import { Router } from 'express';
import db from '../db/database.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin: Dashboard stats
router.get('/stats', authMiddleware, requireRole('admin'), (req, res) => {
    try {
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role != ?').get('admin');
        const totalInvestors = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('investor');
        const totalFounders = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('founder');
        const totalInvested = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM investments WHERE payment_status = 'completed'").get();
        const activeStartups = db.prepare("SELECT COUNT(*) as count FROM startups WHERE status = 'live'").get();
        const pendingStartups = db.prepare("SELECT COUNT(*) as count FROM startups WHERE status = 'pending'").get();
        const pendingKyc = db.prepare("SELECT COUNT(*) as count FROM users WHERE kyc_status = 'submitted'").get();
        const totalTransactions = db.prepare('SELECT COUNT(*) as count FROM transactions').get();
        const recentTransactions = db.prepare('SELECT t.*, u.name as user_name FROM transactions t JOIN users u ON u.id = t.user_id ORDER BY t.created_at DESC LIMIT 10').all();

        res.json({
            total_users: totalUsers.count,
            total_investors: totalInvestors.count,
            total_founders: totalFounders.count,
            total_invested: totalInvested.total,
            active_startups: activeStartups.count,
            pending_startups: pendingStartups.count,
            pending_kyc: pendingKyc.count,
            total_transactions: totalTransactions.count,
            recent_transactions: recentTransactions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all startups with any status
router.get('/startups', authMiddleware, requireRole('admin'), (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT s.*, u.name as founder_name, u.email as founder_email FROM startups s JOIN users u ON u.id = s.founder_id';
        const params = [];
        if (status && status !== 'all') {
            query += ' WHERE s.status = ?';
            params.push(status);
        }
        query += ' ORDER BY s.created_at DESC';
        const startups = db.prepare(query).all(...params);
        res.json(startups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update startup status
router.put('/startups/:id', authMiddleware, requireRole('admin'), (req, res) => {
    try {
        const { status, featured } = req.body;
        if (status) {
            db.prepare('UPDATE startups SET status = ? WHERE id = ?').run(status, req.params.id);

            // Notify founder
            const startup = db.prepare('SELECT * FROM startups WHERE id = ?').get(req.params.id);
            if (startup) {
                const statusMsg = status === 'live' ? 'approved and is now live' :
                    status === 'rejected' ? 'rejected' : `updated to ${status}`;
                db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
                    startup.founder_id, `Application ${status === 'live' ? 'Approved! 🎉' : 'Updated'}`,
                    `Your startup "${startup.name}" has been ${statusMsg}.`
                );
            }
        }
        if (featured !== undefined) {
            db.prepare('UPDATE startups SET featured = ? WHERE id = ?').run(featured ? 1 : 0, req.params.id);
        }
        const updated = db.prepare('SELECT * FROM startups WHERE id = ?').get(req.params.id);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all investors
router.get('/investors', authMiddleware, requireRole('admin'), (req, res) => {
    try {
        const investors = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.kyc_status, u.created_at,
        (SELECT COUNT(*) FROM investments WHERE investor_id = u.id AND payment_status = 'completed') as investment_count,
        (SELECT COALESCE(SUM(amount), 0) FROM investments WHERE investor_id = u.id AND payment_status = 'completed') as total_invested
      FROM users u WHERE u.role = 'investor' ORDER BY u.created_at DESC
    `).all();

        // Attach KYC details
        const enriched = investors.map(inv => {
            const kyc = db.prepare('SELECT * FROM kyc_details WHERE user_id = ?').get(inv.id);
            return { ...inv, kyc };
        });
        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Approve/reject KYC
router.put('/kyc/:userId', authMiddleware, requireRole('admin'), (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Status must be approved or rejected' });
        }

        db.prepare('UPDATE kyc_details SET status = ?, verified_at = datetime(?) WHERE user_id = ?')
            .run(status, 'now', req.params.userId);
        db.prepare('UPDATE users SET kyc_status = ? WHERE id = ?')
            .run(status, req.params.userId);

        db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
            req.params.userId,
            `KYC ${status === 'approved' ? 'Approved! ✅' : 'Rejected ❌'}`,
            status === 'approved' ? 'Your KYC has been verified. You can now start investing!' : 'Your KYC was rejected. Please resubmit your documents.'
        );

        res.json({ message: `KYC ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all transactions
router.get('/transactions', authMiddleware, requireRole('admin'), (req, res) => {
    try {
        const { status, type } = req.query;
        let query = 'SELECT t.*, u.name as user_name, u.email as user_email FROM transactions t JOIN users u ON u.id = t.user_id WHERE 1=1';
        const params = [];
        if (status && status !== 'all') { query += ' AND t.status = ?'; params.push(status); }
        if (type && type !== 'all') { query += ' AND t.type = ?'; params.push(type); }
        query += ' ORDER BY t.created_at DESC';
        res.json(db.prepare(query).all(...params));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get notifications for current user
router.get('/notifications', authMiddleware, (req, res) => {
    try {
        const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.user.id);
        const unreadCount = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0").get(req.user.id);
        res.json({ notifications, unread_count: unreadCount.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark notification as read
router.put('/notifications/:id/read', authMiddleware, (req, res) => {
    try {
        db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark all notifications as read
router.put('/notifications/read-all', authMiddleware, (req, res) => {
    try {
        db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.user.id);
        res.json({ message: 'All marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Blog posts
router.get('/blog', (req, res) => {
    try {
        const posts = db.prepare('SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC').all();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
