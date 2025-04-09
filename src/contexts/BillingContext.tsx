
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import { useClient } from './ClientContext';
import { toast } from 'sonner';

export interface BillingRate {
  id: string;
  name: string;
  amount: number;
  type: 'hourly' | 'fixed' | 'contingency';
  description?: string;
}

export interface TimeEntry {
  id: string;
  description: string;
  date: string;
  duration: number; // in minutes
  rate: number;
  billable: boolean;
  invoiced: boolean;
  caseId?: string;
  clientId?: string;
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  notes?: string;
  items: InvoiceItem[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  timeEntryId?: string;
}

export interface BillingFilters {
  search: string;
  status: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  clientId?: string;
  caseId?: string;
}

interface BillingContextProps {
  invoices: Invoice[];
  timeEntries: TimeEntry[];
  billingRates: BillingRate[];
  isLoading: boolean;
  error: string | null;
  filters: BillingFilters;
  setFilters: React.Dispatch<React.SetStateAction<BillingFilters>>;
  addInvoice: (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  getInvoiceById: (id: string) => Invoice | undefined;
  addTimeEntry: (timeEntry: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTimeEntry: (id: string, timeEntry: Partial<TimeEntry>) => Promise<void>;
  deleteTimeEntry: (id: string) => Promise<void>;
  addBillingRate: (rate: Omit<BillingRate, "id">) => Promise<void>;
  updateBillingRate: (id: string, rate: Partial<BillingRate>) => Promise<void>;
  deleteBillingRate: (id: string) => Promise<void>;
}

const BillingContext = createContext<BillingContextProps | undefined>(undefined);

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const { clients } = useClient();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [billingRates, setBillingRates] = useState<BillingRate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BillingFilters>({
    search: '',
    status: [],
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  // Mock data generation
  useEffect(() => {
    if (!user || !currentCompany) {
      setInvoices([]);
      setTimeEntries([]);
      setBillingRates([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Generate mock billing rates
        const mockBillingRates: BillingRate[] = [
          {
            id: '1',
            name: 'Standard Rate',
            amount: 250,
            type: 'hourly',
            description: 'Standard hourly rate for general legal services'
          },
          {
            id: '2',
            name: 'Junior Associate',
            amount: 175,
            type: 'hourly',
            description: 'Rate for junior associate work'
          },
          {
            id: '3',
            name: 'Senior Partner',
            amount: 450,
            type: 'hourly',
            description: 'Rate for senior partner consultation'
          },
          {
            id: '4',
            name: 'Document Preparation',
            amount: 500,
            type: 'fixed',
            description: 'Standard rate for document preparation'
          }
        ];

        // Generate mock time entries
        const mockTimeEntries: TimeEntry[] = [
          {
            id: '1',
            description: 'Initial consultation',
            date: new Date(2023, 3, 15).toISOString(),
            duration: 60, // 1 hour
            rate: 250,
            billable: true,
            invoiced: true,
            clientId: '1',
            caseId: '1',
            userId: user.id,
            companyId: currentCompany.id,
            createdAt: new Date(2023, 3, 15).toISOString(),
            updatedAt: new Date(2023, 3, 15).toISOString()
          },
          {
            id: '2',
            description: 'Document review',
            date: new Date(2023, 3, 17).toISOString(),
            duration: 120, // 2 hours
            rate: 250,
            billable: true,
            invoiced: true,
            clientId: '1',
            caseId: '1',
            userId: user.id,
            companyId: currentCompany.id,
            createdAt: new Date(2023, 3, 17).toISOString(),
            updatedAt: new Date(2023, 3, 17).toISOString()
          },
          {
            id: '3',
            description: 'Research for case',
            date: new Date(2023, 3, 20).toISOString(),
            duration: 180, // 3 hours
            rate: 175,
            billable: true,
            invoiced: false,
            clientId: '2',
            caseId: '2',
            userId: user.id,
            companyId: currentCompany.id,
            createdAt: new Date(2023, 3, 20).toISOString(),
            updatedAt: new Date(2023, 3, 20).toISOString()
          }
        ];

        // Generate mock invoices
        const mockInvoices: Invoice[] = [
          {
            id: '1',
            invoiceNumber: 'INV-2023-001',
            clientId: '1',
            amount: 750.00,
            tax: 60.00,
            total: 810.00,
            status: 'paid',
            issueDate: new Date(2023, 3, 22).toISOString(),
            dueDate: new Date(2023, 4, 22).toISOString(),
            notes: 'Payment received on time',
            items: [
              {
                id: '1',
                description: 'Initial consultation',
                quantity: 1,
                rate: 250,
                amount: 250,
                timeEntryId: '1'
              },
              {
                id: '2',
                description: 'Document review',
                quantity: 2,
                rate: 250,
                amount: 500,
                timeEntryId: '2'
              }
            ],
            companyId: currentCompany.id,
            createdAt: new Date(2023, 3, 22).toISOString(),
            updatedAt: new Date(2023, 4, 5).toISOString()
          },
          {
            id: '2',
            invoiceNumber: 'INV-2023-002',
            clientId: '2',
            amount: 1000.00,
            tax: 80.00,
            total: 1080.00,
            status: 'sent',
            issueDate: new Date(2023, 4, 10).toISOString(),
            dueDate: new Date(2023, 5, 10).toISOString(),
            notes: '',
            items: [
              {
                id: '3',
                description: 'Contract drafting',
                quantity: 4,
                rate: 250,
                amount: 1000,
              }
            ],
            companyId: currentCompany.id,
            createdAt: new Date(2023, 4, 10).toISOString(),
            updatedAt: new Date(2023, 4, 10).toISOString()
          }
        ];

        setBillingRates(mockBillingRates);
        setTimeEntries(mockTimeEntries);
        setInvoices(mockInvoices);
        setError(null);
      } catch (err) {
        setError('Failed to load billing data');
        console.error('Error loading billing data:', err);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [user, currentCompany, clients]);

  const addInvoice = async (invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: `new-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setInvoices(prev => [...prev, newInvoice]);
      toast.success('Invoice created successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === id 
            ? { 
                ...invoice, 
                ...invoiceData, 
                updatedAt: new Date().toISOString() 
              } 
            : invoice
        )
      );
      toast.success('Invoice updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      toast.success('Invoice deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
      toast.error(errorMessage);
      throw err;
    }
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const addTimeEntry = async (timeEntryData: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newTimeEntry: TimeEntry = {
        ...timeEntryData,
        id: `new-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setTimeEntries(prev => [...prev, newTimeEntry]);
      toast.success('Time entry added successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add time entry';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateTimeEntry = async (id: string, timeEntryData: Partial<TimeEntry>) => {
    try {
      setTimeEntries(prev => 
        prev.map(entry => 
          entry.id === id 
            ? { 
                ...entry, 
                ...timeEntryData, 
                updatedAt: new Date().toISOString() 
              } 
            : entry
        )
      );
      toast.success('Time entry updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update time entry';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteTimeEntry = async (id: string) => {
    try {
      setTimeEntries(prev => prev.filter(entry => entry.id !== id));
      toast.success('Time entry deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete time entry';
      toast.error(errorMessage);
      throw err;
    }
  };

  const addBillingRate = async (rateData: Omit<BillingRate, "id">) => {
    try {
      const newRate: BillingRate = {
        ...rateData,
        id: `new-${Date.now()}`,
      };
      
      setBillingRates(prev => [...prev, newRate]);
      toast.success('Billing rate added successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add billing rate';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateBillingRate = async (id: string, rateData: Partial<BillingRate>) => {
    try {
      setBillingRates(prev => 
        prev.map(rate => 
          rate.id === id 
            ? { 
                ...rate, 
                ...rateData
              } 
            : rate
        )
      );
      toast.success('Billing rate updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update billing rate';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteBillingRate = async (id: string) => {
    try {
      setBillingRates(prev => prev.filter(rate => rate.id !== id));
      toast.success('Billing rate deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete billing rate';
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <BillingContext.Provider value={{
      invoices,
      timeEntries,
      billingRates,
      isLoading,
      error,
      filters,
      setFilters,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      getInvoiceById,
      addTimeEntry,
      updateTimeEntry,
      deleteTimeEntry,
      addBillingRate,
      updateBillingRate,
      deleteBillingRate
    }}>
      {children}
    </BillingContext.Provider>
  );
};
