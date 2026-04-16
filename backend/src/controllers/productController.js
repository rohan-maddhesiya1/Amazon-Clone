import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { Op } from 'sequelize';

// @desc    Get all products (with search and category filter)
// @route   GET /api/products
export const getProducts = async (req, res) => {
    try {
        const { search, category, categoryId } = req.query;
        let queryOptions = { include: [Category] };

        // Search logic (Amazon "search functionality")
        if (search) {
            queryOptions.where = {
                name: { [Op.like]: `%${search}%` }
            };
        }

        // Category filter logic by name
        if (category) {
            const catRecord = await Category.findOne({ where: { name: category } });
            if (catRecord) {
                queryOptions.where = { ...queryOptions.where, categoryId: catRecord.id };
            } else {
                // Return empty if category name not found
                return res.json([]);
            }
        } else if (categoryId) {
            queryOptions.where = { ...queryOptions.where, categoryId };
        }

        const products = await Product.findAll(queryOptions);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: [Category] });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/products/categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories.map(c => c.name));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};