
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useClient } from '@/contexts/ClientContext';
import { useBilling } from '@/contexts/BillingContext';
import { format } from 'date-fns';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NewInvoiceForm from './NewInvoiceForm';

const InvoiceFilters: React.FC = () => {
  const { clients } = useClient();
  const { filters, setFilters } = useBilling();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleStatusChange = (status: string) => {
    const currentStatuses = [...filters.status];
    const index = currentStatuses.indexOf(status);

    if (index === -1) {
      currentStatuses.push(status);
    } else {
      currentStatuses.splice(index, 1);
    }

    setFilters((prev) => ({ ...prev, status: currentStatuses }));
  };

  const handleClientChange = (clientId: string) => {
    setFilters((prev) => ({ ...prev, clientId: clientId === 'all' ? undefined : clientId }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        from: range?.from,
        to: range?.to,
      },
    }));
  };

  const statuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
  const statusColors: Record<string, string> = {
    draft: 'bg-gray-200 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search invoices..."
              className="pl-10"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={filters.dateRange}
                  onSelect={handleDateRangeChange}
                />
              </PopoverContent>
            </Popover>
            
            <Select onValueChange={handleClientChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <NewInvoiceForm />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Badge
            key={status}
            className={`cursor-pointer capitalize ${
              filters.status.includes(status) ? statusColors[status] : 'bg-muted text-muted-foreground'
            }`}
            onClick={() => handleStatusChange(status)}
          >
            {status}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default InvoiceFilters;
