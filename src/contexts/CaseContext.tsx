
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';

export interface LegalCase {
  id: string;
  title: string;
  description: string;
  caseNumber: string;
  type: 'criminal' | 'civil' | 'family' | 'corporate' | 'other';
  status: 'open' | 'closed' | 'suspended' | 'appeal';
  priority: 'low' | 'medium' | 'high';
  clientId: string;
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  companyId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'organization';
  status: 'active' | 'inactive';
  tags: string[];
  companyId: string;
}

interface CaseContextType {
  cases: LegalCase[];
  clients: Client[];
  isLoading: boolean;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

// Mock data
const MOCK_CASES: LegalCase[] = [
  {
    id: '1',
    title: 'Smith v. Johnson',
    description: 'Breach of contract dispute regarding software development project',
    caseNumber: 'CV-2024-1001',
    type: 'civil',
    status: 'open',
    priority: 'high',
    clientId: '1',
    assignedTo: ['2', '3'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-04-05T14:30:00Z',
    dueDate: '2024-06-15T00:00:00Z',
    companyId: '1',
  },
  {
    id: '2',
    title: 'In re: Williams Estate',
    description: 'Probate proceeding for distribution of assets',
    caseNumber: 'PR-2024-0578',
    type: 'family',
    status: 'open',
    priority: 'medium',
    clientId: '2',
    assignedTo: ['2'],
    createdAt: '2024-02-18T10:15:00Z',
    updatedAt: '2024-04-02T11:20:00Z',
    dueDate: '2024-07-30T00:00:00Z',
    companyId: '1',
  },
  {
    id: '3',
    title: 'State v. Brown',
    description: 'Criminal defense for alleged securities fraud',
    caseNumber: 'CR-2024-3421',
    type: 'criminal',
    status: 'open',
    priority: 'high',
    clientId: '3',
    assignedTo: ['2', '3', '4'],
    createdAt: '2024-03-05T08:45:00Z',
    updatedAt: '2024-04-07T16:00:00Z',
    dueDate: '2024-05-20T00:00:00Z',
    companyId: '1',
  },
  {
    id: '4',
    title: 'TechCorp Acquisition',
    description: 'Corporate acquisition of software startup',
    caseNumber: 'CA-2024-0098',
    type: 'corporate',
    status: 'closed',
    priority: 'medium',
    clientId: '4',
    assignedTo: ['2'],
    createdAt: '2023-11-15T11:30:00Z',
    updatedAt: '2024-03-20T15:45:00Z',
    companyId: '1',
  },
];

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Sarah Smith',
    email: 'sarah.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    type: 'individual',
    status: 'active',
    tags: ['VIP', 'Retainer'],
    companyId: '1',
  },
  {
    id: '2',
    name: 'Michael Williams',
    email: 'michael.w@email.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Somewhere, ST 67890',
    type: 'individual',
    status: 'active',
    tags: ['New Client'],
    companyId: '1',
  },
  {
    id: '3',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '(555) 456-7890',
    address: '789 Pine Rd, Elsewhere, ST 54321',
    type: 'individual',
    status: 'active',
    tags: ['Urgent'],
    companyId: '1',
  },
  {
    id: '4',
    name: 'TechCorp Inc.',
    email: 'legal@techcorp.com',
    phone: '(555) 222-3333',
    address: '100 Corporate Way, Metropolis, ST 99999',
    type: 'organization',
    status: 'active',
    tags: ['Corporate', 'Retainer'],
    companyId: '1',
  },
];

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCasesAndClients = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // In a real app, filter based on user permissions and company
        if (user && currentCompany) {
          // Filter cases by company
          const filteredCases = MOCK_CASES.filter(c => c.companyId === currentCompany.id);
          setCases(filteredCases);
          
          // Filter clients by company
          const filteredClients = MOCK_CLIENTS.filter(c => c.companyId === currentCompany.id);
          setClients(filteredClients);
        } else {
          setCases([]);
          setClients([]);
        }
      } catch (error) {
        console.error('Error fetching cases and clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCasesAndClients();
  }, [user, currentCompany]);

  return (
    <CaseContext.Provider value={{
      cases,
      clients,
      isLoading,
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = (): CaseContextType => {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};
