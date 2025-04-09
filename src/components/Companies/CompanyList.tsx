
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';
import EditCompanyDialog from './EditCompanyDialog';
import DeleteCompanyDialog from './DeleteCompanyDialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CompanyFilters from './CompanyFilters';
import ViewEmployeesDialog from './ViewEmployeesDialog';

const CompanyList = () => {
  const { companies, isLoading } = useCompany();
  const { hasPermission } = useAuth();
  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  // Handle filters
  const handleFilters = (filtered) => {
    setFilteredCompanies(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-10">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CompanyFilters companies={companies} onFilter={handleFilters} />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No companies found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {company.logoUrl && (
                        <div className="h-8 w-8 rounded overflow-hidden">
                          <img 
                            src={company.logoUrl} 
                            alt={company.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      {company.name}
                    </div>
                  </TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.city}</TableCell>
                  <TableCell>{company.state}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <ViewEmployeesDialog companyId={company.id}>
                        <Button variant="ghost" size="icon">
                          <Users className="h-4 w-4" />
                          <span className="sr-only">View Employees</span>
                        </Button>
                      </ViewEmployeesDialog>
                      
                      {hasPermission('manage:companies') && (
                        <>
                          <EditCompanyDialog company={company}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </EditCompanyDialog>
                          
                          <DeleteCompanyDialog company={company}>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </DeleteCompanyDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyList;
