import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, updateProfile 
} from 'firebase/auth';
import { auth, isConfigured } from '../config/firebase';
import { DEMO_USERS, USER_ROLES } from '../config/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to Organizer demo user for instant interactive testing
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cloud_auth_user');
      return saved ? JSON.parse(saved) : DEMO_USERS.ORGANIZER;
    } catch {
      return DEMO_USERS.ORGANIZER;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const formatted = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: user.email?.includes('organizer') ? USER_ROLES.ORGANIZER : USER_ROLES.ATTENDEE
          };
          setCurrentUser(formatted);
          localStorage.setItem('cloud_auth_user', JSON.stringify(formatted));
        }
      });
      return unsubscribe;
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isConfigured && auth) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
      }
      // Demo simulated login
      const matchedUser = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        uid: `usr-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        role: email.includes('org') ? USER_ROLES.ORGANIZER : USER_ROLES.ATTENDEE,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      };
      setCurrentUser(matchedUser);
      localStorage.setItem('cloud_auth_user', JSON.stringify(matchedUser));
      return matchedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName, role = USER_ROLES.ATTENDEE) => {
    setLoading(true);
    try {
      if (isConfigured && auth) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName });
        return res.user;
      }
      const newUser = {
        uid: `usr-${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0],
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      };
      setCurrentUser(newUser);
      localStorage.setItem('cloud_auth_user', JSON.stringify(newUser));
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isConfigured && auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    localStorage.removeItem('cloud_auth_user');
  };

  // Quick switch between dummy users for evaluation & demonstrations
  const switchDemoRole = (roleKey) => {
    const user = DEMO_USERS[roleKey] || DEMO_USERS.ORGANIZER;
    setCurrentUser(user);
    localStorage.setItem('cloud_auth_user', JSON.stringify(user));
  };

  const isOrganizer = currentUser?.role === USER_ROLES.ORGANIZER || currentUser?.role === USER_ROLES.ADMIN;

  return (
    <AuthContext.Provider value={{
      currentUser,
      isOrganizer,
      loading,
      login,
      register,
      logout,
      switchDemoRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
