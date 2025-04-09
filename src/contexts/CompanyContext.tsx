
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  avatar: string;
  status: 'active' | 'inactive';
}

interface CompanyContextType {
  companies: Company[];
  currentCompany: Company | null;
  setCurrentCompany: (company: Company) => void;
  employees: Employee[];
  isLoading: boolean;
  addCompany: (company: Company) => Promise<void>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Mock data
const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Smith & Associates Law Firm',
    address: '123 Legal Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '(212) 555-1234',
    email: 'info@smithlaw.com',
    website: 'www.smithlaw.com',
    logoUrl: 'https://placehold.co/400x400/1a365d/FFFFFF?text=S%26A',
  },
  {
    id: '2',
    name: 'Johnson Legal Group',
    address: '456 Attorney Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    phone: '(310) 555-5678',
    email: 'contact@johnsonlegal.com',
    website: 'www.johnsonlegal.com',
    logoUrl: 'https://placehold.co/400x400/1a365d/FFFFFF?text=JLG',
  },
];

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@lawfirm.com',
    role: 'company-admin',
    department: 'Management',
    position: 'Managing Partner',
    avatar: 'https://placehold.co/200x200/718096/FFFFFF?text=JD',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@lawfirm.com',
    role: 'employee',
    department: 'Legal',
    position: 'Senior Attorney',
    avatar: 'https://placehold.co/200x200/718096/FFFFFF?text=JS',
    status: 'active',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@lawfirm.com',
    role: 'employee',
    department: 'Legal',
    position: 'Paralegal',
    avatar: 'https://placehold.co/200x200/718096/FFFFFF?text=RJ',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@lawfirm.com',
    role: 'employee',
    department: 'Administration',
    position: 'Office Manager',
    avatar: 'https://placehold.co/200x200/718096/FFFFFF?text=SW',
    status: 'active',
  },
];

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In real app, we would filter companies based on user role and permissions
        setCompanies(MOCK_COMPANIES);
        
        // If user belongs to a company, set it as current
        if (user?.companyId) {
          const userCompany = MOCK_COMPANIES.find(c => c.id === user.companyId);
          if (userCompany) {
            setCurrentCompany(userCompany);
          }
        } else if (MOCK_COMPANIES.length > 0 && user?.role === 'admin') {
          // For admin users without a specific company, default to first company
          setCurrentCompany(MOCK_COMPANIES[0]);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In real app, we would filter employees based on current company
        setEmployees(MOCK_EMPLOYEES);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCompanies();
      fetchEmployees();
    } else {
      setCompanies([]);
      setCurrentCompany(null);
      setEmployees([]);
      setIsLoading(false);
    }
  }, [user]);

  const addCompany = async (company: Company): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would send this to an API
      setCompanies(prevCompanies => [...prevCompanies, company]);
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  };

  const updateCompany = async (id: string, data: Partial<Company>): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would send this to an API
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          company.id === id ? { ...company, ...data } : company
        )
      );
      
      // Update current company if it's the one being edited
      if (currentCompany && currentCompany.id === id) {
        setCurrentCompany(prev => ({ ...prev!, ...data }));
      }
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  };

  const deleteCompany = async (id: string): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we would send this to an API
      setCompanies(prevCompanies =>
        prevCompanies.filter(company => company.id !== id)
      );
      
      // Reset current company if it's the one being deleted
      if (currentCompany && currentCompany.id === id) {
        setCurrentCompany(companies.length > 1 ? companies.find(c => c.id !== id) || null : null);
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  };

  return (
    <CompanyContext.Provider value={{
      companies,
      currentCompany,
      setCurrentCompany,
      employees,
      isLoading,
      addCompany,
      updateCompany,
      deleteCompany,
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
