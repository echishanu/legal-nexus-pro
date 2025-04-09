
import React from 'react';
import { format } from 'date-fns';
import { useBilling } from '@/contexts/BillingContext';
import { useClient } from '@/contexts/ClientContext';
import { useCompany } from '@/contexts/CompanyContext';
import { Button } from '@/components/ui/button';
import { Printer, Download, Send } from 'lucide-react';

interface ViewInvoiceProps {
  invoiceId: string;
}

const ViewInvoice: React.FC<ViewInvoiceProps> = ({ invoiceId }) => {
  const { getInvoiceById } = useBilling();
  const { clients } = useClient();
  const { currentCompany } = useCompany();
  
  const invoice = getInvoiceById(invoiceId);
  const client = clients.find(c => c.id === invoice?.clientId);
  
  if (!invoice || !client) {
    return <div>Invoice not found</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSend = () => {
    // Implement sending logic
    console.log('Sending invoice:', invoice.invoiceNumber);
  };

  const handleDownload = () => {
    // Implement download logic
    console.log('Downloading invoice:', invoice.invoiceNumber);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" /> Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" /> Download
        </Button>
        {invoice.status === 'draft' && (
          <Button size="sm" onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" /> Send to Client
          </Button>
        )}
      </div>

      <div className="print:block" id="printable-invoice">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold">{currentCompany?.name || 'Your Company'}</h2>
            <p className="text-muted-foreground">{currentCompany?.address || '123 Company Address'}</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold">INVOICE</h1>
            <p className="text-xl font-semibold text-muted-foreground">{invoice.invoiceNumber}</p>
          </div>
        </div>
        
        {/* Bill Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Bill To:</h3>
            <p className="font-semibold">{client.name}</p>
            <p>{client.address}</p>
            <p>{client.email}</p>
            <p>{client.phone}</p>
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Invoice Date:</span>
                <span>{format(new Date(invoice.issueDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-muted-foreground">Status:</span>
                <span className="capitalize">{invoice.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Qty</th>
                <th className="py-2 px-4 text-right">Rate</th>
                <th className="py-2 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4 text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">${item.rate.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Tax:</span>
              <span>${invoice.tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Notes:</h3>
            <p className="border p-3 rounded bg-muted/30">{invoice.notes}</p>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm mt-12">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
