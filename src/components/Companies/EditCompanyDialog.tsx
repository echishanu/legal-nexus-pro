
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CompanyForm from './CompanyForm';
import { Company } from '@/contexts/CompanyContext';

interface EditCompanyDialogProps {
  company: Company;
  children: React.ReactNode;
}

const EditCompanyDialog: React.FC<EditCompanyDialogProps> = ({
  company,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update company information
          </DialogDescription>
        </DialogHeader>
        <CompanyForm
          companyId={company.id}
          onComplete={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
