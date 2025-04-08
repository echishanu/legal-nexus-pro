
import React, { useState } from 'react';
import { useClient, Client } from '@/contexts/ClientContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { User, Building, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditClientDialog } from './EditClientDialog';
import { DeleteClientDialog } from './DeleteClientDialog';

interface ClientListProps {
  filterBy: 'all' | 'active' | 'inactive' | 'potential';
}

export const ClientList: React.FC<ClientListProps> = ({ filterBy }) => {
  const { clients, filters } = useClient();
  const { hasPermission } = useAuth();
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Filter clients based on tab selection
  const filteredClients = clients.filter(client => {
    if (filterBy === 'all') return true;
    return client.status === filterBy;
  });

  // Apply additional filters
  const displayedClients = filteredClients.filter(client => {
    // Search filter
    if (filters.search && !client.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !client.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(client.status)) {
      return false;
    }

    // Type filter
    if (filters.type.length > 0 && !filters.type.includes(client.type)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.from && new Date(client.createdAt) < filters.dateRange.from) {
      return false;
    }
    if (filters.dateRange.to) {
      const endDate = new Date(filters.dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(client.createdAt) > endDate) {
        return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'potential':
        return <Badge variant="secondary">Potential</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (displayedClients.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-xl font-medium">No clients found</h3>
        <p className="text-muted-foreground mt-2">
          {filteredClients.length === 0 ? 
            "There are no clients in this category yet." : 
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
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="font-medium">{client.name}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {client.type === 'individual' ? 
                    <User className="h-4 w-4 text-muted-foreground" /> : 
                    <Building className="h-4 w-4 text-muted-foreground" />
                  }
                  <span className="capitalize">{client.type}</span>
                </div>
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{getStatusBadge(client.status)}</TableCell>
              <TableCell>{format(new Date(client.createdAt), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {hasPermission('manage:clients') && (
                      <>
                        <DropdownMenuItem onClick={() => setClientToEdit(client)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setClientToDelete(client)}
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

      {clientToEdit && (
        <EditClientDialog 
          client={clientToEdit} 
          open={!!clientToEdit} 
          onOpenChange={(open) => !open && setClientToEdit(null)} 
        />
      )}

      {clientToDelete && (
        <DeleteClientDialog 
          client={clientToDelete} 
          open={!!clientToDelete} 
          onOpenChange={(open) => !open && setClientToDelete(null)} 
        />
      )}
    </>
  );
};
