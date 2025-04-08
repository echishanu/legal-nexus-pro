
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientFilters } from '@/components/Clients/ClientFilters';
import { ClientList } from '@/components/Clients/ClientList';
import { NewClientDialog } from '@/components/Clients/NewClientDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Clients: React.FC = () => {
  const { hasPermission } = useAuth();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and information
          </p>
        </div>
        {hasPermission('manage:clients') && (
          <Button
            onClick={() => setIsNewClientDialogOpen(true)}
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Client
          </Button>
        )}
      </div>

      <ClientFilters />
      
      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Clients</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="potential">Potential</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ClientList filterBy="all" />
        </TabsContent>
        <TabsContent value="active">
          <ClientList filterBy="active" />
        </TabsContent>
        <TabsContent value="inactive">
          <ClientList filterBy="inactive" />
        </TabsContent>
        <TabsContent value="potential">
          <ClientList filterBy="potential" />
        </TabsContent>
      </Tabs>

      <NewClientDialog
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
      />
    </div>
  );
};

export default Clients;
