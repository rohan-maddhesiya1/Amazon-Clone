import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Category from './Category.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // Supports up to 99,999,999.99
        allowNull: false,
    },
    countInStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    // Amazon specific features
    brand: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
});

// Set up the Relationship
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

export default Product;