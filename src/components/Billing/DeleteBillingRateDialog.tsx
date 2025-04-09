
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

interface DeleteBillingRateDialogProps {
  open: boolean;
  rateId: string;
  onOpenChange: (open: boolean) => void;
}

const DeleteBillingRateDialog: React.FC<DeleteBillingRateDialogProps> = ({
  open,
  rateId,
  onOpenChange,
}) => {
  const { deleteBillingRate, billingRates } = useBilling();
  const rate = billingRates.find(r => r.id === rateId);

  const handleDelete = async () => {
    try {
      await deleteBillingRate(rateId);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting billing rate:', error);
    }
  };

  if (!rate) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the billing rate <strong>{rate.name}</strong>.
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

export default DeleteBillingRateDialog;
