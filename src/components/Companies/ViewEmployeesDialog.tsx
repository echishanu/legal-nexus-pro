
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCompany } from '@/contexts/CompanyContext';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ViewEmployeesDialogProps {
  companyId: string;
  children: React.ReactNode;
}

const ViewEmployeesDialog: React.FC<ViewEmployeesDialogProps> = ({
  companyId,
  children,
}) => {
  const { companies, employees } = useCompany();
  const [open, setOpen] = React.useState(false);
  
  const company = companies.find(c => c.id === companyId);
  const companyEmployees = employees.filter(e => {
    // In a real app, we'd filter by company ID
    // For now, just showing all employees for demo purposes
    return true;
  });

  if (!company) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{company.name} - Employees</DialogTitle>
          <DialogDescription>
            View and manage employees for this company
          </DialogDescription>
        </DialogHeader>
        
        {companyEmployees.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No employees found for this company.</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {employee.avatar ? (
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                          ) : (
                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === 'active' ? 'outline' : 'secondary'}>
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeesDialog;
