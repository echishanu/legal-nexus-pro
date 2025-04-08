
import React, { useState } from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { DocumentList } from '@/components/Documents/DocumentList';
import { DocumentFilters } from '@/components/Documents/DocumentFilters';
import { NewDocumentDialog } from '@/components/Documents/NewDocumentDialog';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const Documents = () => {
  const { hasPermission } = useAuth();
  const { isLoading } = useDocument();
  const [newDocumentOpen, setNewDocumentOpen] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your legal documents and files</p>
        </div>
        
        {hasPermission('manage:documents') && (
          <Button onClick={() => setNewDocumentOpen(true)} size="sm">
            <FilePlus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="case">Case Documents</TabsTrigger>
          <TabsTrigger value="client">Client Documents</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <DocumentFilters />
        </div>
        
        <Separator className="my-4" />
        
        <TabsContent value="all">
          <DocumentList filterBy="all" />
        </TabsContent>
        
        <TabsContent value="case">
          <DocumentList filterBy="case" />
        </TabsContent>
        
        <TabsContent value="client">
          <DocumentList filterBy="client" />
        </TabsContent>
        
        <TabsContent value="other">
          <DocumentList filterBy="other" />
        </TabsContent>
      </Tabs>
      
      <NewDocumentDialog open={newDocumentOpen} onOpenChange={setNewDocumentOpen} />
    </div>
  );
};

export default Documents;
