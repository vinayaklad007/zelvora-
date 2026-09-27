const firestoreService = require('../services/firestoreService');

const reviewController = {
  // GET /api/reviews/product/:productId
  getProductReviews: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const allReviews = await firestoreService.getCollection('reviews');

      const approvedReviews = allReviews.filter(r => 
        (r.productId === productId || r.productSlug === productId) && 
        (r.status === 'APPROVED' || !r.status)
      );

      return res.json({
        success: true,
        data: approvedReviews
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/reviews (Customer submit review)
  createReview: async (req, res, next) => {
    try {
      const { productId, rating, title, comment, userName } = req.body;

      if (!productId || !rating || !comment) {
        return res.status(400).json({ success: false, message: 'Product, rating (1-5), and review text are required' });
      }

      const reviewId = `rev_${Date.now()}`;
      const newReview = {
        id: reviewId,
        productId,
        userId: req.user ? req.user.uid : 'guest',
        userName: userName || (req.user ? req.user.name : 'Verified Customer'),
        rating: Number(rating),
        title: title || '',
        comment,
        status: 'APPROVED', // Default approved for responsive experience
        createdAt: new Date().toISOString()
      };

      const created = await firestoreService.setDoc('reviews', reviewId, newReview);

      // Recalculate Product average rating
      const allReviews = await firestoreService.getCollection('reviews');
      const prodReviews = allReviews.filter(r => r.productId === productId);
      if (prodReviews.length > 0) {
        const avgRating = (prodReviews.reduce((sum, r) => sum + Number(r.rating), 0) / prodReviews.length).toFixed(1);
        await firestoreService.updateDoc('products', productId, {
          ratingAvg: Number(avgRating),
          reviewCount: prodReviews.length
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your review has been submitted.',
        data: created
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/reviews/admin (Admin review moderation queue)
  getReviewsAdmin: async (req, res, next) => {
    try {
      const reviews = await firestoreService.getCollection('reviews');
      return res.json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/reviews/:id (Admin)
  deleteReviewAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;
      await firestoreService.deleteDoc('reviews', id);
      return res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reviewController;
