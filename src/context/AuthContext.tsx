import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    fullName: string;
    phoneNumber: string;
    userType: UserType;
    password?: string;
  }) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserType) => void;
}

const DEMO_USERS: Record<UserType, User> = {
  family: {
    id: 'user-ravi',
    email: 'ravi.jayawardena@gmail.com',
    phoneNumber: '+94 77 123 4567',
    userType: 'family',
    fullName: 'Ravi Jayawardena',
    isVerified: true,
    createdAt: '2025-08-01T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  individual: {
    id: 'user-nadeesha',
    email: 'nadeesha.perera@hirelanka.care',
    phoneNumber: '+94 77 341 8920',
    userType: 'individual',
    fullName: 'Nadeesha Perera',
    isVerified: true,
    createdAt: '2025-08-14T08:00:00Z',
    avatarUrl: '/src/assets/images/avatar_nadeesha_1791048994074.jpg'
  },
  agency: {
    id: 'user-agency-suwasevana',
    email: 'admin@suwasevana.lk',
    phoneNumber: '+94 11 250 8912',
    userType: 'agency',
    fullName: 'Suwasevana Healthcare Admin',
    isVerified: true,
    createdAt: '2025-01-05T08:00:00Z',
    avatarUrl: '/src/assets/images/agency_suwasevana_1791049030798.jpg'
  },
  admin: {
    id: 'user-admin',
    email: 'admin@hirelanka.care',
    phoneNumber: '+94 11 777 9000',
    userType: 'admin',
    fullName: 'HireLanka Care Administrator',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00Z',
    avatarUrl: ''
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hl_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hl_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hl_auth_user');
    }
  }, [currentUser]);

  const login = async (email: string): Promise<boolean> => {
    // Check if matches known demo or create session
    const matchedRole = Object.keys(DEMO_USERS).find(
      role => DEMO_USERS[role as UserType].email.toLowerCase() === email.toLowerCase()
    ) as UserType | undefined;

    if (matchedRole) {
      setCurrentUser(DEMO_USERS[matchedRole]);
      return true;
    }

    // Generic fallback user login
    const genericUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      phoneNumber: '+94 77 000 0000',
      userType: 'family',
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(genericUser);
    return true;
  };

  const register = async (userData: {
    email: string;
    fullName: string;
    phoneNumber: string;
    userType: UserType;
  }): Promise<boolean> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      userType: userData.userType,
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchDemoRole = (role: UserType) => {
    setCurrentUser(DEMO_USERS[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
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
