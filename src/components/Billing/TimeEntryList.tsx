
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
import { MoreHorizontal, FileEdit, Trash, Clock } from 'lucide-react';
import { useBilling } from '@/contexts/BillingContext';
import { useClient } from '@/contexts/ClientContext';
import { format } from 'date-fns';

const TimeEntryList: React.FC = () => {
  const { timeEntries, filters, deleteTimeEntry } = useBilling();
  const { clients } = useClient();

  const getClientName = (clientId: string | undefined) => {
    if (!clientId) return 'N/A';
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const filteredTimeEntries = useMemo(() => {
    return timeEntries.filter(entry => {
      // Filter by search term (check description)
      if (filters.search && !entry.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange.from && new Date(entry.date) < filters.dateRange.from) {
        return false;
      }

      if (filters.dateRange.to) {
        const toDateEnd = new Date(filters.dateRange.to);
        toDateEnd.setHours(23, 59, 59, 999);
        if (new Date(entry.date) > toDateEnd) {
          return false;
        }
      }

      return true;
    });
  }, [timeEntries, filters]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTimeEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No time entries found.
              </TableCell>
            </TableRow>
          ) : (
            filteredTimeEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="font-medium">{entry.description}</TableCell>
                <TableCell>{getClientName(entry.clientId)}</TableCell>
                <TableCell>{formatDuration(entry.duration)}</TableCell>
                <TableCell>${entry.rate.toFixed(2)}/hr</TableCell>
                <TableCell>${((entry.duration / 60) * entry.rate).toFixed(2)}</TableCell>
                <TableCell>
                  {entry.billable ? (
                    entry.invoiced ? (
                      <Badge className="bg-green-100 text-green-800">Invoiced</Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800">Billable</Badge>
                    )
                  ) : (
                    <Badge className="bg-muted text-muted-foreground">Non-billable</Badge>
                  )}
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
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteTimeEntry(entry.id)}
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
  );
};

export default TimeEntryList;
