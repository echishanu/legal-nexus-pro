
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

interface NewCompanyDialogProps {
  children: React.ReactNode;
}

const NewCompanyDialog: React.FC<NewCompanyDialogProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Create a new company in the system
          </DialogDescription>
        </DialogHeader>
        <CompanyForm onComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default NewCompanyDialog;
