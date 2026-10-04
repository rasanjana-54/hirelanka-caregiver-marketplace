import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '../types';

interface StoredAccount extends User {
  passwordHash: string;
}

interface AuthContextType {
  currentUser: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    email: string;
    fullName: string;
    phoneNumber: string;
    userType: UserType;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserType) => void;
}

const DEFAULT_USERS: StoredAccount[] = [
  {
    id: 'user-ravi',
    email: 'ravi.jayawardena@gmail.com',
    phoneNumber: '+94 77 123 4567',
    userType: 'family',
    fullName: 'Ravi Jayawardena',
    isVerified: true,
    createdAt: '2025-08-01T10:00:00Z',
    passwordHash: 'Pass123!',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'user-nadeesha',
    email: 'nadeesha.perera@hirelanka.care',
    phoneNumber: '+94 77 341 8920',
    userType: 'individual',
    fullName: 'Nadeesha Perera',
    isVerified: true,
    createdAt: '2025-08-14T08:00:00Z',
    passwordHash: 'Pass123!',
    avatarUrl: '/src/assets/images/avatar_nadeesha_1791048994074.jpg'
  },
  {
    id: 'user-agency-suwasevana',
    email: 'admin@suwasevana.lk',
    phoneNumber: '+94 11 250 8912',
    userType: 'agency',
    fullName: 'Suwasevana Healthcare Admin',
    isVerified: true,
    createdAt: '2025-01-05T08:00:00Z',
    passwordHash: 'Pass123!',
    avatarUrl: '/src/assets/images/agency_suwasevana_1791049030798.jpg'
  },
  {
    id: 'user-admin',
    email: 'admin@hirelanka.care',
    phoneNumber: '+94 11 777 9000',
    userType: 'admin',
    fullName: 'HireLanka Care Administrator',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z',
    passwordHash: 'Admin2026!',
    avatarUrl: ''
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<StoredAccount[]>(() => {
    const saved = localStorage.getItem('hl_registered_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hl_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('hl_auth_token') || null;
  });

  useEffect(() => {
    localStorage.setItem('hl_registered_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hl_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hl_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('hl_auth_token', authToken);
    } else {
      localStorage.removeItem('hl_auth_token');
    }
  }, [authToken]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const account = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (!account) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (password && account.passwordHash && account.passwordHash !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    // Try backend API auth endpoint
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      if (res.ok) {
        const data = await res.json();
        setAuthToken(data.token);
      }
    } catch {
      // Server offline fallback
      setAuthToken(`token_${Date.now()}_${account.id}`);
    }

    const { passwordHash, ...userObj } = account;
    setCurrentUser(userObj);
    return { success: true };
  };

  const register = async (userData: {
    email: string;
    fullName: string;
    phoneNumber: string;
    userType: UserType;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();

    if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (!userData.password || userData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const newAccount: StoredAccount = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      userType: userData.userType,
      isVerified: false,
      createdAt: new Date().toISOString(),
      passwordHash: userData.password
    };

    // Sync with Express backend
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: userData.password,
          user_type: userData.userType,
          phone_number: userData.phoneNumber
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAuthToken(data.token);
      }
    } catch {
      setAuthToken(`token_${Date.now()}_${newAccount.id}`);
    }

    setAccounts(prev => [...prev, newAccount]);
    const { passwordHash, ...userObj } = newAccount;
    setCurrentUser(userObj);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
  };

  const switchDemoRole = (role: UserType) => {
    const demoAcc = accounts.find(a => a.userType === role) || DEFAULT_USERS.find(a => a.userType === role);
    if (demoAcc) {
      const { passwordHash, ...userObj } = demoAcc;
      setCurrentUser(userObj);
      setAuthToken(`demo_token_${role}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authToken,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
