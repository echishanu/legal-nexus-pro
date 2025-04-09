
import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, FileEdit, Trash, Eye, Send } from 'lucide-react';
import { useBilling } from '@/contexts/BillingContext';
import { useClient } from '@/contexts/ClientContext';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import ViewInvoice from './ViewInvoice';
import EditInvoiceForm from './EditInvoiceForm';
import DeleteInvoiceDialog from './DeleteInvoiceDialog';

const InvoiceList: React.FC = () => {
  const { invoices, filters } = useBilling();
  const { clients } = useClient();
  const [viewInvoiceId, setViewInvoiceId] = React.useState<string | null>(null);
  const [editInvoiceId, setEditInvoiceId] = React.useState<string | null>(null);
  const [deleteInvoiceId, setDeleteInvoiceId] = React.useState<string | null>(null);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-200 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-amber-100 text-amber-800',
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      // Filter by search term (check invoice number)
      if (filters.search && !invoice.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filter by status
      if (filters.status.length > 0 && !filters.status.includes(invoice.status)) {
        return false;
      }

      // Filter by client
      if (filters.clientId && invoice.clientId !== filters.clientId) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange.from && new Date(invoice.issueDate) < filters.dateRange.from) {
        return false;
      }

      if (filters.dateRange.to) {
        const toDateEnd = new Date(filters.dateRange.to);
        toDateEnd.setHours(23, 59, 59, 999);
        if (new Date(invoice.issueDate) > toDateEnd) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, filters]);

  const handleSendInvoice = (id: string) => {
    console.log(`Sending invoice ${id}`);
    // Implement invoice sending logic here
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{getClientName(invoice.clientId)}</TableCell>
                  <TableCell>{format(new Date(invoice.issueDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[invoice.status]} capitalize`}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewInvoiceId(invoice.id)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditInvoiceId(invoice.id)}>
                          <FileEdit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {invoice.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleSendInvoice(invoice.id)}>
                            <Send className="mr-2 h-4 w-4" /> Send
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => setDeleteInvoiceId(invoice.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Invoice Dialog */}
      <Dialog open={viewInvoiceId !== null} onOpenChange={() => setViewInvoiceId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Invoice</DialogTitle>
          </DialogHeader>
          {viewInvoiceId && <ViewInvoice invoiceId={viewInvoiceId} />}
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={editInvoiceId !== null} onOpenChange={() => setEditInvoiceId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          {editInvoiceId && <EditInvoiceForm invoiceId={editInvoiceId} onClose={() => setEditInvoiceId(null)} />}
        </DialogContent>
      </Dialog>

      {/* Delete Invoice Dialog */}
      <DeleteInvoiceDialog 
        open={deleteInvoiceId !== null} 
        invoiceId={deleteInvoiceId || ''} 
        onOpenChange={() => setDeleteInvoiceId(null)} 
      />
    </>
  );
};

export default InvoiceList;
