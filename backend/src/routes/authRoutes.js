import express from 'express';
import { registerUser, authUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);

// New protected route
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

export default router;