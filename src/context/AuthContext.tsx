import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { firebaseService } from '../services/firebaseService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const messageListener = (message: any) => {
      if (message.type === 'AUTH_STATE_CHANGED') {
        setUser(message.user);
        setLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Check initial auth state
    chrome.runtime.sendMessage({ type: 'GET_AUTH_STATE' }, (response) => {
      if (response?.user) {
        setUser(response.user);
      }
      setLoading(false);
    });

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await firebaseService.signIn(email, password);
      if (response.error) {
        throw new Error(response.error);
      }
      setUser(response.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await firebaseService.signUp(email, password);
      if (response.error) {
        throw new Error(response.error);
      }
      setUser(response.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const response = await firebaseService.signInWithGoogle();
      if (response.error) {
        throw new Error(response.error);
      }
      setUser(response.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseService.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};