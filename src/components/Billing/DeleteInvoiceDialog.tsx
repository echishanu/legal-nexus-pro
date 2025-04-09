
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useBilling } from '@/contexts/BillingContext';

interface DeleteInvoiceDialogProps {
  open: boolean;
  invoiceId: string;
  onOpenChange: (open: boolean) => void;
}

const DeleteInvoiceDialog: React.FC<DeleteInvoiceDialogProps> = ({
  open,
  invoiceId,
  onOpenChange,
}) => {
  const { deleteInvoice, getInvoiceById } = useBilling();
  const invoice = getInvoiceById(invoiceId);

  const handleDelete = async () => {
    try {
      await deleteInvoice(invoiceId);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  if (!invoice) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete invoice <strong>{invoice.invoiceNumber}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInvoiceDialog;
