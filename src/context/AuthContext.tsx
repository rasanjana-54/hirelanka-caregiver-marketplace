import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '../types';
import { apiRequest } from '../lib/api';

interface ApiUser {
  id: string;
  email: string;
  phone_number: string;
  full_name: string;
  user_type: UserType;
  is_verified: boolean;
  created_at: string;
}

interface AuthResponse {
  token: string;
  user: ApiUser;
}

interface AuthContextType {
  currentUser: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (userData: {
    email: string;
    fullName: string;
    phoneNumber: string;
    userType: UserType;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUser = (user: ApiUser): User => ({
  id: user.id,
  email: user.email,
  phoneNumber: user.phone_number,
  fullName: user.full_name,
  userType: user.user_type,
  isVerified: user.is_verified,
  createdAt: user.created_at
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return typeof window === 'undefined' ? null : localStorage.getItem('hl_auth_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!authToken) {
      setIsLoading(false);
      return () => { active = false; };
    }

    apiRequest<{ user: ApiUser }>('/auth/me')
      .then(({ user }) => {
        if (active) setCurrentUser(mapUser(user));
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem('hl_auth_token');
          setAuthToken(null);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, []);

  const saveSession = (response: AuthResponse) => {
    localStorage.setItem('hl_auth_token', response.token);
    setAuthToken(response.token);
    const user = mapUser(response.user);
    setCurrentUser(user);
    return user;
  };

  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      return { success: true, user: saveSession(response) };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to sign in.' };
    }
  };

  const register: AuthContextType['register'] = async userData => {
    try {
      const response = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: userData.email,
          full_name: userData.fullName,
          phone_number: userData.phoneNumber,
          user_type: userData.userType,
          password: userData.password
        })
      });
      saveSession(response);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to create account.' };
    }
  };

  const logout = () => {
    void apiRequest('/auth/logout', { method: 'POST' }).catch(() => undefined);
    localStorage.removeItem('hl_auth_token');
    setCurrentUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authToken,
        isAuthenticated: !!currentUser && !!authToken,
        isLoading,
        login,
        register,
        logout
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
