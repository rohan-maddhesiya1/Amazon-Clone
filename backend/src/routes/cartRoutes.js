import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect); // All cart routes need a token

router.route('/').get(getCart).post(addToCart);
router.route('/:id').delete(removeFromCart).put(updateCartItem);

export default router;