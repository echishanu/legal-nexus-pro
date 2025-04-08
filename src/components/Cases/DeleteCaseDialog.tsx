
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
import { LegalCase } from '@/contexts/CaseContext';

interface DeleteCaseDialogProps {
  caseData: LegalCase;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteCaseDialog: React.FC<DeleteCaseDialogProps> = ({
  caseData,
  isOpen,
  onClose,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the case "{caseData.title}" ({caseData.caseNumber})?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCaseDialog;
