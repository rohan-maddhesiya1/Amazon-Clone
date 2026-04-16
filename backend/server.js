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

// Middleware
app.use(express.json()); // This must be BEFORE routes
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Amazon Clone API is running smoothly...');
});

// Sync Database and Start Server
const startServer = async () => {
    try {
        // Authenticate connection
        await sequelize.authenticate();
        console.log('✅ MySQL Connection has been established successfully.');

        // Sync models to DB (alter: true updates tables without deleting data)
        await sequelize.sync({ alter: true });
        console.log('✅ All models were synchronized successfully.');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

// Only run the server manually if not in a Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
    startServer();
}

export default app;