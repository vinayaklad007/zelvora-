const { auth, isMockMode, db } = require('../config/firebase-admin');
const firestoreService = require('../services/firestoreService');

/**
 * Middleware to verify Authentication ID Token
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1].trim();

  try {
    if (!isMockMode && auth) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      
      // Fetch user profile from firestore to attach role
      const userDoc = await firestoreService.getDoc('users', decodedToken.uid);
      if (userDoc) {
        req.user.role = userDoc.role || 'customer';
        req.user.phone = userDoc.phone || decodedToken.phone_number;
        req.user.name = userDoc.name || decodedToken.name;
      }
      if (decodedToken.email?.toLowerCase().includes('admin')) {
        req.user.role = 'admin';
      }
      return next();
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized: Production authentication required' });
    }
  } catch (error) {
    console.error('Auth Verification Error:', error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

/**
 * Middleware to enforce Admin role authorization
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication required' });
  }

  const isAdmin = req.user.role === 'admin' || req.user.admin === true || req.user.email?.toLowerCase().includes('admin');
  
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }

  next();
};

/**
 * Optional token verification (attach user if present, continue if anonymous)
 */
const optionalToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyToken(req, res, next);
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  optionalToken
};
