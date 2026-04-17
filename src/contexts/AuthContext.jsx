import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CREDENTIALS, STORAGE_KEYS } from '../utils/constants';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeGetItem(STORAGE_KEYS.AUTH, null));
  const [rememberedEmail, setRememberedEmail] = useState(() =>
    safeGetItem(STORAGE_KEYS.REMEMBER, '')
  );

  const isAuthenticated = !!user;

  const login = useCallback((email, password, rememberMe) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) return { success: false, error: 'Email is required.' };
    if (!trimmedPassword) return { success: false, error: 'Password is required.' };

    if (
      trimmedEmail !== CREDENTIALS.email ||
      trimmedPassword !== CREDENTIALS.password
    ) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const userData = { email: trimmedEmail, loginAt: new Date().toISOString() };
    setUser(userData);
    safeSetItem(STORAGE_KEYS.AUTH, userData);

    if (rememberMe) {
      setRememberedEmail(trimmedEmail);
      safeSetItem(STORAGE_KEYS.REMEMBER, trimmedEmail);
    } else {
      setRememberedEmail('');
      safeRemoveItem(STORAGE_KEYS.REMEMBER);
    }

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    safeRemoveItem(STORAGE_KEYS.AUTH);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, rememberedEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
