const { db, isMockMode, mockStore } = require('../config/firebase-admin');

// Helper to convert Firestore doc to standard object
const docToObject = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const firestoreService = {
  // Collection getter
  getCollection: async (collectionName) => {
    if (!isMockMode && db) {
      const snapshot = await db.collection(collectionName).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      const storeMap = mockStore[collectionName] || new Map();
      return Array.from(storeMap.values());
    }
  },

  // Document getter
  getDoc: async (collectionName, id) => {
    if (!isMockMode && db) {
      const doc = await db.collection(collectionName).doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } else {
      const storeMap = mockStore[collectionName] || new Map();
      return storeMap.get(id) || null;
    }
  },

  // Set / Create document
  setDoc: async (collectionName, id, data) => {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    if (!data.createdAt) {
      payload.createdAt = new Date().toISOString();
    }

    if (!isMockMode && db) {
      await db.collection(collectionName).doc(id).set(payload, { merge: true });
      return { id, ...payload };
    } else {
      let storeMap = mockStore[collectionName];
      if (!storeMap) {
        storeMap = new Map();
        mockStore[collectionName] = storeMap;
      }
      const existing = storeMap.get(id) || {};
      const merged = { ...existing, ...payload, id };
      storeMap.set(id, merged);
      return merged;
    }
  },

  // Update document
  updateDoc: async (collectionName, id, updates) => {
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (!isMockMode && db) {
      await db.collection(collectionName).doc(id).update(payload);
      const updated = await db.collection(collectionName).doc(id).get();
      return docToObject(updated);
    } else {
      const storeMap = mockStore[collectionName];
      if (!storeMap || !storeMap.has(id)) {
        throw new Error(`Document ${id} not found in ${collectionName}`);
      }
      const existing = storeMap.get(id);
      const merged = { ...existing, ...payload };
      storeMap.set(id, merged);
      return merged;
    }
  },

  // Delete document
  deleteDoc: async (collectionName, id) => {
    if (!isMockMode && db) {
      await db.collection(collectionName).doc(id).delete();
    } else {
      const storeMap = mockStore[collectionName];
      if (storeMap) {
        storeMap.delete(id);
      }
    }
    return true;
  },

  // Atomic Stock Deduction
  reduceStock: async (items) => {
    // items: array of { id, quantity }
    if (!isMockMode && db) {
      return await db.runTransaction(async (transaction) => {
        const productRefs = items.map(item => db.collection('products').doc(item.id));
        const docs = await Promise.all(productRefs.map(ref => transaction.get(ref)));

        for (let i = 0; i < items.length; i++) {
          const doc = docs[i];
          const reqQty = items[i].quantity;
          if (!doc.exists) {
            throw new Error(`Product ${items[i].id} not found.`);
          }
          const productData = doc.data();
          if (productData.stock < reqQty) {
            throw new Error(`Insufficient stock for "${productData.title}". Available: ${productData.stock}, Requested: ${reqQty}`);
          }
        }

        // Apply deduction
        items.forEach((item, idx) => {
          const doc = docs[idx];
          const newStock = doc.data().stock - item.quantity;
          transaction.update(doc.ref, { stock: newStock, updatedAt: new Date().toISOString() });
        });
      });
    } else {
      // Mock mode stock deduction
      const productsMap = mockStore.products;
      for (const item of items) {
        const prod = productsMap.get(item.id);
        if (!prod) {
          throw new Error(`Product ${item.id} not found.`);
        }
        if (prod.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${prod.title}". Available: ${prod.stock}, Requested: ${item.quantity}`);
        }
      }
      items.forEach(item => {
        const prod = productsMap.get(item.id);
        prod.stock -= item.quantity;
        prod.updatedAt = new Date().toISOString();
        productsMap.set(item.id, prod);
      });
    }
  }
};

module.exports = firestoreService;
