import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Firebase Auth Token
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const orderAPI = {
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  requestReturn: (id, data) => api.post(`/orders/${id}/return`, data),
  // Admin
  getAllOrdersAdmin: (params) => api.get('/orders', { params }),
  updateOrderStatusAdmin: (id, data) => api.put(`/orders/${id}/status`, data),
};

export const paymentAPI = {
  createRazorpayOrder: (items, couponCode) => api.post('/payments/create-razorpay-order', { items, couponCode }),
  verifyRazorpayPayment: (data) => api.post('/payments/verify-razorpay-payment', data),
  processCODOrder: (data) => api.post('/payments/process-cod-order', data),
};

export const couponAPI = {
  applyCoupon: (code, subtotal) => api.post('/coupons/apply', { code, subtotal }),
  getCouponsAdmin: () => api.get('/coupons'),
  createCouponAdmin: (data) => api.post('/coupons', data),
  updateCouponAdmin: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCouponAdmin: (id) => api.delete(`/coupons/${id}`),
};

export const reviewAPI = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  submitReview: (data) => api.post('/reviews', data),
  getReviewsAdmin: () => api.get('/reviews/admin'),
  deleteReviewAdmin: (id) => api.delete(`/reviews/${id}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getCustomers: () => api.get('/admin/customers'),
  toggleCustomerStatus: (id) => api.put(`/admin/customers/${id}/toggle-status`),
  getBanners: () => api.get('/admin/banners'),
  createBanner: (data) => api.post('/admin/banners', data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
};

export default api;
