import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2'; // Explicitly load so Vercel bundler catches it

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        dialectModule: mysql2, // Force Sequelize to use the loaded module
        logging: false,
    }
);

export default sequelize;