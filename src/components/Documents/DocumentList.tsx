
import React, { useState } from 'react';
import { useDocument, Document } from '@/contexts/DocumentContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { 
  FilePdf, FileText, FileSpreadsheet, FileImage, 
  FileIcon, MoreHorizontal, Download, Pencil, Trash2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditDocumentDialog } from './EditDocumentDialog';
import { DeleteDocumentDialog } from './DeleteDocumentDialog';
import { toast } from 'sonner';

interface DocumentListProps {
  filterBy: 'all' | 'case' | 'client' | 'other';
}

export const DocumentList: React.FC<DocumentListProps> = ({ filterBy }) => {
  const { documents, filters } = useDocument();
  const { hasPermission } = useAuth();
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Filter documents based on tab selection
  const filteredDocuments = documents.filter(doc => {
    if (filterBy === 'all') return true;
    if (filterBy === 'case') return doc.caseId !== undefined;
    if (filterBy === 'client') return doc.clientId !== undefined;
    if (filterBy === 'other') return doc.caseId === undefined && doc.clientId === undefined;
    return true;
  });

  // Apply additional filters
  const displayedDocuments = filteredDocuments.filter(doc => {
    // Search filter
    if (filters.search && !doc.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !doc.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // File type filter
    if (filters.fileType.length > 0 && !filters.fileType.includes(doc.fileType)) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(doc.status)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.from && new Date(doc.createdAt) < filters.dateRange.from) {
      return false;
    }
    if (filters.dateRange.to) {
      const endDate = new Date(filters.dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(doc.createdAt) > endDate) {
        return false;
      }
    }

    return true;
  });

  const handleDownload = (doc: Document) => {
    toast.success(`Downloaded: ${doc.title}`);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FilePdf className="h-4 w-4 text-red-600" />;
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'jpg':
      case 'png':
        return <FileImage className="h-4 w-4 text-amber-600" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'final':
        return 'default';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (displayedDocuments.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">📄</div>
        <h3 className="text-xl font-medium">No documents found</h3>
        <p className="text-muted-foreground mt-2">
          {filteredDocuments.length === 0 ? 
            "There are no documents in this category yet." : 
            "Try adjusting your filters to find what you're looking for."}
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedDocuments.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{document.title}</span>
                  <span className="text-xs text-muted-foreground">{document.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {getFileIcon(document.fileType)}
                  <span className="text-xs uppercase">{document.fileType}</span>
                </div>
              </TableCell>
              <TableCell>{formatFileSize(document.fileSize)}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(document.status) as any}>
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(document.createdAt), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownload(document)}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    {hasPermission('manage:documents') && (
                      <>
                        <DropdownMenuItem onClick={() => setDocumentToEdit(document)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDocumentToDelete(document)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {documentToEdit && (
        <EditDocumentDialog 
          document={documentToEdit} 
          open={!!documentToEdit} 
          onOpenChange={(open) => !open && setDocumentToEdit(null)} 
        />
      )}

      {documentToDelete && (
        <DeleteDocumentDialog 
          document={documentToDelete} 
          open={!!documentToDelete} 
          onOpenChange={(open) => !open && setDocumentToDelete(null)} 
        />
      )}
    </>
  );
};
