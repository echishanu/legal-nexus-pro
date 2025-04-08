
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'business';
  status: 'active' | 'inactive' | 'potential';
  referralSource: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export interface ClientFilters {
  search: string;
  status: string[];
  type: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface ClientContextProps {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  filters: ClientFilters;
  setFilters: React.Dispatch<React.SetStateAction<ClientFilters>>;
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    status: [],
    type: [],
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  // Mock data generation
  useEffect(() => {
    if (!user || !currentCompany) {
      setClients([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const mockClients: Client[] = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '(555) 123-4567',
            address: '123 Main St, Anytown, CA 94001',
            type: 'individual',
            status: 'active',
            referralSource: 'Website',
            notes: 'Seeking representation for employment dispute',
            createdAt: new Date(2023, 1, 15).toISOString(),
            updatedAt: new Date(2023, 1, 15).toISOString(),
            companyId: currentCompany.id,
          },
          {
            id: '2',
            name: 'Acme Corporation',
            email: 'contact@acmecorp.com',
            phone: '(555) 987-6543',
            address: '456 Business Ave, Commerce City, CA 94002',
            type: 'business',
            status: 'active',
            referralSource: 'Referral',
            notes: 'Corporate client requiring ongoing legal counsel',
            createdAt: new Date(2023, 2, 10).toISOString(),
            updatedAt: new Date(2023, 5, 20).toISOString(),
            companyId: currentCompany.id,
          },
          {
            id: '3',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '(555) 234-5678',
            address: '789 Oak St, Lakeside, CA 94003',
            type: 'individual',
            status: 'potential',
            referralSource: 'Social media',
            notes: 'Interested in estate planning services',
            createdAt: new Date(2023, 3, 5).toISOString(),
            updatedAt: new Date(2023, 3, 5).toISOString(),
            companyId: currentCompany.id,
          },
          {
            id: '4',
            name: 'Tech Innovations LLC',
            email: 'legal@techinnovations.com',
            phone: '(555) 345-6789',
            address: '101 Innovation Dr, Tech Park, CA 94004',
            type: 'business',
            status: 'inactive',
            referralSource: 'Conference',
            notes: 'Previous client for patent applications',
            createdAt: new Date(2022, 11, 12).toISOString(),
            updatedAt: new Date(2023, 4, 8).toISOString(),
            companyId: currentCompany.id,
          },
          {
            id: '5',
            name: 'Michael Rodriguez',
            email: 'm.rodriguez@example.com',
            phone: '(555) 456-7890',
            address: '222 Pine St, Westview, CA 94005',
            type: 'individual',
            status: 'active',
            referralSource: 'Existing client',
            notes: 'Family law case - custody hearing scheduled',
            createdAt: new Date(2023, 5, 20).toISOString(),
            updatedAt: new Date(2023, 6, 15).toISOString(),
            companyId: currentCompany.id,
          }
        ];

        setClients(mockClients);
        setError(null);
      } catch (err) {
        setError('Failed to load clients');
        console.error('Error loading clients:', err);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [user, currentCompany]);

  const addClient = async (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (!user || !currentCompany) {
        throw new Error('User or company not found');
      }
      
      // Simulate API call
      const newClient: Client = {
        ...clientData,
        id: `new-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setClients(prev => [...prev, newClient]);
      toast.success('Client added successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add client';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      setClients(prev => 
        prev.map(client => 
          client.id === id 
            ? { 
                ...client, 
                ...clientData, 
                updatedAt: new Date().toISOString() 
              } 
            : client
        )
      );
      toast.success('Client updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update client';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete client';
      toast.error(errorMessage);
      throw err;
    }
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  return (
    <ClientContext.Provider value={{
      clients,
      isLoading,
      error,
      filters,
      setFilters,
      addClient,
      updateClient,
      deleteClient,
      getClientById
    }}>
      {children}
    </ClientContext.Provider>
  );
};
