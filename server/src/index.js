import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import startupRoutes from './routes/startups.js';
import investmentRoutes from './routes/investments.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting (simple in-memory)
const rateLimitMap = new Map();
function rateLimit(windowMs = 60000, max = 100) {
    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;

        if (!rateLimitMap.has(key)) rateLimitMap.set(key, []);
        const timestamps = rateLimitMap.get(key).filter(t => t > windowStart);
        rateLimitMap.set(key, timestamps);

        if (timestamps.length >= max) {
            return res.status(429).json({ error: 'Too many requests, please try again later.' });
        }
        timestamps.push(now);
        next();
    };
}

// Apply rate limiting to auth routes
app.use('/api/auth', rateLimit(60000, 30), authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Production: serve the built React frontend ---
if (process.env.NODE_ENV === 'production') {
    const clientDist = join(__dirname, '../../client/dist');
    app.use(express.static(clientDist));

    // SPA fallback — all non-API routes serve index.html
    app.get('*', (req, res) => {
        res.sendFile(join(clientDist, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`🚀 StakeMint API server running at http://localhost:${PORT}`);
});
