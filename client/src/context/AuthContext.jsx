import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          localStorage.setItem('auth_token', token);
          
          // Check role claim or admin email pattern
          const isUserAdmin = currentUser.email?.toLowerCase().includes('admin') || false;
          setIsAdmin(isUserAdmin);

          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Valued Customer',
            photoURL: currentUser.photoURL,
            role: isUserAdmin ? 'admin' : 'customer'
          });
        } catch (err) {
          console.error("Token fetch error:", err);
          setUser(null);
        }
      } else {
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login Email/Password
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`Welcome back, ${result.user.displayName || 'Customer'}!`);
      return result.user;
    } catch (error) {
      toast.error(error.message || 'Failed to sign in. Please check your credentials.');
      throw error;
    }
  };

  // Admin Quick Login (Demo mode support)
  const loginAdminDemo = () => {
    const adminUser = {
      uid: 'admin_demo_001',
      email: 'admin@zelvoraluxury.com',
      displayName: 'Zelvora Admin',
      role: 'admin'
    };
    localStorage.setItem('auth_token', 'mock-admin-token');
    setUser(adminUser);
    setIsAdmin(true);
    toast.success('Authenticated as Zelvora Store Admin');
    return adminUser;
  };

  // Register Email/Password
  const register = async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      toast.success('Account created successfully!');
      return result.user;
    } catch (error) {
      toast.error(error.message || 'Failed to create account.');
      throw error;
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome, ${result.user.displayName || result.user.email}!`);
      return result.user;
    } catch (error) {
      console.warn("Google Sign-In notice:", error.message);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled.');
        return null;
      }
      if (
        error.code === 'auth/api-key-not-valid' ||
        error.code === 'auth/invalid-api-key' ||
        error.message?.includes('API key') ||
        error.message?.includes('identitytoolkit')
      ) {
        toast.error('Firebase Web API Key not set on Netlify. Please set VITE_FIREBASE_API_KEY in Netlify settings.');
        return null;
      }
      toast.error(error.message || 'Google Sign-In failed.');
      return null;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAdmin(false);
      toast.success('Logged out successfully.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      login,
      register,
      loginWithGoogle,
      loginAdminDemo,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
