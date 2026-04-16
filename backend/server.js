import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './src/config/db.js';

// Route Imports
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';

// Model Imports (Crucial for Sequelize associations)
import User from './src/models/User.js';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';
import CartItem from './src/models/Cart.js';
import { Order, OrderItem } from './src/models/Order.js';

dotenv.config();

const app = express();

// ── DB Initialization (runs once per serverless cold start) ──────────────────
let dbReady = false;
let dbError = null;

const initDb = async () => {
    if (dbReady) return;
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connection established successfully.');
        // Use { alter: false } in production to avoid table-lock timeouts on cold start
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('✅ All models synchronized.');
        }
        dbReady = true;
    } catch (error) {
        dbError = error;
        console.error('❌ Unable to connect to the database:', error.message);
    }
};

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// DB readiness middleware — runs before every request in production
app.use(async (req, res, next) => {
    if (!dbReady) {
        await initDb();
    }
    if (dbError && !dbReady) {
        return res.status(503).json({
            message: 'Database connection failed. Please check server configuration.',
            error: process.env.NODE_ENV !== 'production' ? dbError.message : undefined,
        });
    }
    next();
});

// Health Check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Amazon Clone API is running smoothly...',
        db: dbReady ? 'connected' : 'disconnected',
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// ── Local dev: start HTTP server ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    const startServer = async () => {
        await initDb();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    };
    startServer();
}

// ── Vercel serverless export ─────────────────────────────────────────────────
export default app;