import CartItem from '../models/Cart.js';
import Product from '../models/Product.js';

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // From protect middleware

    try {
        let cartItem = await CartItem.findOne({ where: { userId, productId } });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({ userId, productId, quantity });
        }
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        await CartItem.destroy({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (cartItem) {
            cartItem.quantity = quantity;
            await cartItem.save();
            res.json(cartItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};