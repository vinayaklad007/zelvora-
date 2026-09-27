const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let db = null;
let auth = null;
let isMockMode = false;

// Mock store for dev/testing when Firebase Admin SDK credentials are not present
const mockStore = {
  users: new Map(),
  products: new Map(),
  categories: new Map(),
  orders: new Map(),
  coupons: new Map(),
  reviews: new Map(),
  wishlists: new Map(),
  banners: new Map(),
  settings: new Map()
};

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
    ? path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    : path.resolve(__dirname, '../serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('Firebase Admin SDK initialized successfully with serviceAccountKey.json');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.includes('PRIVATE KEY')) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('Firebase Admin SDK initialized successfully with environment variables');
  } else {
    console.log('ℹ️ Running in local development mode with robust in-memory mock store.');
    isMockMode = true;
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK initialization failed. Falling back to in-memory mock store:', error.message);
  isMockMode = true;
}

module.exports = {
  admin,
  db,
  auth,
  isMockMode,
  mockStore
};
