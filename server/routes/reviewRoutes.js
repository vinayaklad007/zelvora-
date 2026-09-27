const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, verifyAdmin, optionalToken } = require('../middleware/authMiddleware');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', optionalToken, reviewController.createReview);

// Admin review endpoints
router.get('/admin', verifyToken, verifyAdmin, reviewController.getReviewsAdmin);
router.delete('/:id', verifyToken, verifyAdmin, reviewController.deleteReviewAdmin);

module.exports = router;
