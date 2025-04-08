
import React from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentForm } from './DocumentForm';
import { DocumentFormValues } from './schemas/documentSchema';

interface NewDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewDocumentDialog: React.FC<NewDocumentDialogProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { addDocument } = useDocument();
  
  const handleSubmit = async (values: DocumentFormValues) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      await addDocument({
        title: values.title,
        description: values.description,
        fileType: values.fileType,
        fileSize: values.fileSize,
        status: values.status,
        caseId: values.caseId,
        clientId: values.clientId,
        tags: [], // Ensure this is an array, not undefined
        createdBy: user.id,
        companyId: user.companyId || '',
        downloadUrl: '#',
      });
      
      toast.success('Document created successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        
        <DocumentForm 
          onSubmit={handleSubmit} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};
