import { Order, OrderItem } from '../models/Order.js';
import CartItem from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
    const { shippingAddress, items, totalPrice } = req.body;

    try {
        const order = await Order.create({
            userId: req.user.id,
            shippingAddress,
            totalPrice
        });

        // Create Order Items
        const orderItemsData = items.map(item => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.price
        }));
        
        await OrderItem.bulkCreate(orderItemsData);

        // Clear Cart
        await CartItem.destroy({ where: { userId: req.user.id } });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    const orders = await Order.findAll({ 
        where: { userId: req.user.id },
        include: [{ model: OrderItem, include: [Product] }]
    });
    res.json(orders);
};