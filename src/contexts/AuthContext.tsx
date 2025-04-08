
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type Role = 'admin' | 'company-admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId: string | null;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data - would be replaced with actual API calls in production
const MOCK_USERS = [
  {
    id: '1',
    name: 'System Administrator',
    email: 'admin@legal-nexus.com',
    password: 'admin123',
    role: 'admin' as Role,
    companyId: null,
    avatarUrl: '',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@lawfirm.com',
    password: 'password',
    role: 'company-admin' as Role,
    companyId: '1',
    avatarUrl: '',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@lawfirm.com',
    password: 'password',
    role: 'employee' as Role,
    companyId: '1',
    avatarUrl: '',
  }
];

// Permission mapping per role
const ROLE_PERMISSIONS = {
  'admin': [
    'manage:companies', 'view:companies',
    'manage:users', 'view:users',
    'manage:cases', 'view:cases',
    'manage:documents', 'view:documents',
    'manage:invoices', 'view:invoices',
    'manage:clients', 'view:clients',
    'manage:events', 'view:events',
  ],
  'company-admin': [
    'manage:users', 'view:users',
    'manage:cases', 'view:cases',
    'manage:documents', 'view:documents',
    'manage:invoices', 'view:invoices',
    'manage:clients', 'view:clients',
    'manage:events', 'view:events',
  ],
  'employee': [
    'view:cases',
    'view:documents',
    'view:clients',
    'view:events',
    'manage:assigned-cases',
    'manage:own-documents',
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in local storage
    const savedUser = localStorage.getItem('legalNexusUser');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('legalNexusUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('legalNexusUser', JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        toast.error('Invalid email or password');
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('legalNexusUser');
    toast.success('Logged out successfully');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
