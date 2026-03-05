import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'stakemint_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'stakemint_refresh';

function generateTokens(user) {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
}

// Register
router.post('/register', (req, res) => {
    try {
        const { name, email, phone, password, role = 'investor' } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const password_hash = bcrypt.hashSync(password, 10);
        const result = db.prepare(
            'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)'
        ).run(name, email, phone || null, password_hash, role === 'founder' ? 'founder' : 'investor');

        const user = db.prepare('SELECT id, name, email, role, kyc_status, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
        const tokens = generateTokens(user);

        // Create welcome notification
        db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
            user.id, 'Welcome to StakeMint! 🎉', 'Your account has been created. Complete your KYC to start investing.'
        );

        res.status(201).json({ user, ...tokens });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const { password_hash, ...safeUser } = user;
        const tokens = generateTokens(user);
        res.json({ user: safeUser, ...tokens });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
    try {
        const user = db.prepare('SELECT id, name, email, phone, role, kyc_status, dob, bank_account, bank_ifsc, bank_name, avatar_url, created_at FROM users WHERE id = ?').get(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const kyc = db.prepare('SELECT * FROM kyc_details WHERE user_id = ?').get(user.id);
        res.json({ user, kyc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile
router.put('/profile', authMiddleware, (req, res) => {
    try {
        const { name, phone, dob, bank_account, bank_ifsc, bank_name } = req.body;
        db.prepare(`
      UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), 
      dob = COALESCE(?, dob), bank_account = COALESCE(?, bank_account),
      bank_ifsc = COALESCE(?, bank_ifsc), bank_name = COALESCE(?, bank_name) WHERE id = ?
    `).run(name, phone, dob, bank_account, bank_ifsc, bank_name, req.user.id);

        const user = db.prepare('SELECT id, name, email, phone, role, kyc_status, dob, bank_account, bank_ifsc, bank_name, created_at FROM users WHERE id = ?').get(req.user.id);
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit KYC
router.post('/kyc', authMiddleware, (req, res) => {
    try {
        const { pan_number, aadhaar_number } = req.body;
        if (!pan_number || !aadhaar_number) {
            return res.status(400).json({ error: 'PAN and Aadhaar numbers are required' });
        }

        const existing = db.prepare('SELECT id FROM kyc_details WHERE user_id = ?').get(req.user.id);
        if (existing) {
            db.prepare('UPDATE kyc_details SET pan_number = ?, aadhaar_number = ?, status = ? WHERE user_id = ?')
                .run(pan_number, aadhaar_number, 'submitted', req.user.id);
        } else {
            db.prepare('INSERT INTO kyc_details (user_id, pan_number, aadhaar_number, status) VALUES (?, ?, ?, ?)')
                .run(req.user.id, pan_number, aadhaar_number, 'submitted');
        }

        db.prepare('UPDATE users SET kyc_status = ? WHERE id = ?').run('submitted', req.user.id);
        res.json({ message: 'KYC submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Refresh token
router.post('/refresh', (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const tokens = generateTokens(user);
        res.json(tokens);
    } catch (err) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

export default router;
