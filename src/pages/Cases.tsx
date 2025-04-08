
import React, { useState } from 'react';
import { useCase } from '@/contexts/CaseContext';
import CaseList from '@/components/Cases/CaseList';
import CaseFilters from '@/components/Cases/CaseFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import NewCaseDialog from '@/components/Cases/NewCaseDialog';
import { useToast } from '@/hooks/use-toast';
import { LegalCase } from '@/contexts/CaseContext';

const Cases: React.FC = () => {
  const { cases, isLoading } = useCase();
  const { toast } = useToast();
  const [isNewCaseDialogOpen, setIsNewCaseDialogOpen] = useState(false);
  const [filteredCases, setFilteredCases] = useState<LegalCase[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    search: '',
  });

  // Apply filters whenever cases or filters change
  React.useEffect(() => {
    if (!cases) return;
    
    let result = [...cases];
    
    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
    
    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(c => c.type === filters.type);
    }
    
    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter(c => c.priority === filters.priority);
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm) || 
        c.description.toLowerCase().includes(searchTerm) || 
        c.caseNumber.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredCases(result);
  }, [cases, filters]);

  const handleCreateCase = (newCase: LegalCase) => {
    toast({
      title: "Case Created",
      description: `Case "${newCase.title}" has been created successfully.`,
    });
    setIsNewCaseDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-law-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Cases</h1>
          <p className="text-muted-foreground">
            Manage and track all your legal cases
          </p>
        </div>
        <Button onClick={() => setIsNewCaseDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Case
        </Button>
      </div>

      <CaseFilters filters={filters} setFilters={setFilters} />
      
      <CaseList cases={filteredCases} />
      
      <NewCaseDialog
        isOpen={isNewCaseDialogOpen}
        onClose={() => setIsNewCaseDialogOpen(false)}
        onCreateCase={handleCreateCase}
      />
    </div>
  );
};

export default Cases;
