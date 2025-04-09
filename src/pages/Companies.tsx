
import React from 'react';
import PageHeader from '@/components/UI/PageHeader';
import CompanyList from '@/components/Companies/CompanyList';
import NewCompanyDialog from '@/components/Companies/NewCompanyDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Companies = () => {
  const { hasPermission } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Companies" 
        description="Manage your law firm companies"
      >
        {hasPermission('manage:companies') && (
          <NewCompanyDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Company
            </Button>
          </NewCompanyDialog>
        )}
      </PageHeader>

      <CompanyList />
    </div>
  );
};

export default Companies;
