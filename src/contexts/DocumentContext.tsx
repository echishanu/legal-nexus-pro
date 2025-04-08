
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';

export interface Document {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png' | 'other';
  fileSize: number; // in bytes
  status: 'draft' | 'final' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  caseId?: string;
  clientId?: string;
  companyId: string;
  downloadUrl: string;
}

export interface DocumentFilter {
  search: string;
  fileType: string[];
  status: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

interface DocumentContextType {
  documents: Document[];
  filters: DocumentFilter;
  setFilters: (filters: DocumentFilter) => void;
  isLoading: boolean;
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Document>;
  updateDocument: (id: string, document: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<boolean>;
  getDocumentById: (id: string) => Document | undefined;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Mock data
const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Case Brief - Smith v. Johnson',
    description: 'Summary of key legal arguments and precedents',
    fileType: 'pdf',
    fileSize: 1450000,
    status: 'final',
    tags: ['brief', 'arguments', 'case-summary'],
    createdAt: '2024-03-12T14:30:00Z',
    updatedAt: '2024-03-15T09:20:00Z',
    createdBy: '2',
    caseId: '1',
    companyId: '1',
    downloadUrl: '#',
  },
  {
    id: '2',
    title: 'Evidence Photos - Williams Estate',
    description: 'Property photos for estate valuation',
    fileType: 'jpg',
    fileSize: 3200000,
    status: 'final',
    tags: ['evidence', 'photos', 'estate'],
    createdAt: '2024-02-20T11:15:00Z',
    updatedAt: '2024-02-20T11:15:00Z',
    createdBy: '3',
    caseId: '2',
    companyId: '1',
    downloadUrl: '#',
  },
  {
    id: '3',
    title: 'Witness Statements - State v. Brown',
    description: 'Compilation of witness testimonies',
    fileType: 'docx',
    fileSize: 890000,
    status: 'draft',
    tags: ['statements', 'witness', 'testimony'],
    createdAt: '2024-03-18T15:45:00Z',
    updatedAt: '2024-04-01T10:30:00Z',
    createdBy: '2',
    caseId: '3',
    companyId: '1',
    downloadUrl: '#',
  },
  {
    id: '4',
    title: 'Financial Records - TechCorp',
    description: 'Financial statements for due diligence',
    fileType: 'xlsx',
    fileSize: 2100000,
    status: 'final',
    tags: ['financial', 'due-diligence', 'acquisition'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T16:20:00Z',
    createdBy: '3',
    caseId: '4',
    companyId: '1',
    downloadUrl: '#',
  },
  {
    id: '5',
    title: 'Contract Draft - Smith Consulting',
    description: 'Service agreement draft for client review',
    fileType: 'docx',
    fileSize: 450000,
    status: 'draft',
    tags: ['contract', 'agreement', 'draft'],
    createdAt: '2024-03-28T13:10:00Z',
    updatedAt: '2024-03-28T13:10:00Z',
    createdBy: '2',
    clientId: '1',
    companyId: '1',
    downloadUrl: '#',
  },
];

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DocumentFilter>({
    search: '',
    fileType: [],
    status: [],
    dateRange: {},
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        if (user && currentCompany) {
          // Filter documents by company
          const filteredDocuments = MOCK_DOCUMENTS.filter(doc => doc.companyId === currentCompany.id);
          setDocuments(filteredDocuments);
        } else {
          setDocuments([]);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user, currentCompany]);

  const addDocument = async (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const newDocument: Document = {
      ...document,
      id: `doc-${documents.length + 1}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setDocuments(prevDocuments => [...prevDocuments, newDocument]);
    return newDocument;
  };

  const updateDocument = async (id: string, document: Partial<Document>): Promise<Document> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedDocument: Document | undefined;
    
    setDocuments(prevDocuments => 
      prevDocuments.map(doc => {
        if (doc.id === id) {
          updatedDocument = {
            ...doc,
            ...document,
            updatedAt: new Date().toISOString(),
          };
          return updatedDocument;
        }
        return doc;
      })
    );
    
    if (!updatedDocument) {
      throw new Error('Document not found');
    }
    
    return updatedDocument;
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDocuments(prevDocuments => 
      prevDocuments.filter(doc => doc.id !== id)
    );
    
    return true;
  };

  const getDocumentById = (id: string): Document | undefined => {
    return documents.find(doc => doc.id === id);
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      filters,
      setFilters,
      isLoading,
      addDocument,
      updateDocument,
      deleteDocument,
      getDocumentById,
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
