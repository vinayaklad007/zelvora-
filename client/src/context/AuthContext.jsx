import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (currentUser) => {
        if (currentUser) {
          try {
            const token = await currentUser.getIdToken();
            localStorage.setItem('auth_token', token);
            
            // Explicit Admin Email Whitelist
            const ADMIN_EMAILS = ['vinaylad401@gmail.com'];
            const isUserAdmin = ADMIN_EMAILS.includes(currentUser.email?.toLowerCase());
            setIsAdmin(isUserAdmin);

            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Valued Customer',
              photoURL: currentUser.photoURL,
              role: isUserAdmin ? 'admin' : 'customer'
            });
          } catch (err) {
            console.warn("Stale token refresh cleared:", err.message);
            localStorage.removeItem('auth_token');
            setUser(null);
            setIsAdmin(false);
          }
        } else {
          localStorage.removeItem('auth_token');
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firebase Auth observer notice:", error.message);
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Login Email/Password
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`Welcome back, ${result.user.displayName || 'Customer'}!`);
      return result.user;
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      let msg = error.message || 'Failed to sign in. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. If you do not have an account, click Register.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/admin-restricted-operation') {
        msg = 'Email/Password sign-in is disabled in Firebase Console. Enable Email/Password under Authentication > Sign-in method.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Please reset your password or try again later.';
      }
      toast.error(msg);
      throw error;
    }
  };

  // Register Email/Password
  const register = async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user && name) {
        try {
          await updateProfile(result.user, { displayName: name });
        } catch (pErr) {
          console.warn("Update profile notice:", pErr);
        }
      }
      toast.success('Account created successfully!');
      return result.user;
    } catch (error) {
      console.error("Register error:", error.code, error.message);
      let msg = error.message || 'Failed to create account.';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please click Sign In to log in.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/admin-restricted-operation') {
        msg = 'Email/Password sign-in is disabled in Firebase Console. Enable Email/Password under Authentication > Sign-in method.';
      }
      toast.error(msg);
      throw error;
    }
  };

  // Password Reset Email
  const resetPassword = async (resetEmail) => {
    if (!resetEmail || !resetEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error("Password reset error:", error.code, error.message);
      let msg = 'Failed to send password reset email.';
      if (error.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      toast.error(msg);
      throw error;
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    if (googleLoading) return null;
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome, ${result.user.displayName || result.user.email}!`);
      return result.user;
    } catch (error) {
      console.warn("Google Sign-In notice:", error.code, error.message);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        toast.error('Sign-in popup was closed or interrupted. Please try again.');
        return null;
      }
      if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up was blocked by your browser. Please allow popups for this site and try again.');
        return null;
      }
      if (error.code === 'auth/unauthorized-domain') {
        toast.error('Domain not authorized in Firebase Auth. Add zelvoraa.netlify.app to Firebase Console > Authentication > Settings > Authorized domains.');
        return null;
      }
      if (
        error.code === 'auth/api-key-not-valid' ||
        error.code === 'auth/invalid-api-key' ||
        error.message?.includes('API key') ||
        error.message?.includes('identitytoolkit')
      ) {
        toast.error('Firebase Web API Key issue. Please check VITE_FIREBASE_API_KEY setting.');
        return null;
      }
      toast.error(error.message || 'Google Sign-In failed.');
      return null;
    } finally {
      setGoogleLoading(false);
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
      googleLoading,
      login,
      register,
      resetPassword,
      loginWithGoogle,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
