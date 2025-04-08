
import React from 'react';
import { LegalCase } from '@/contexts/CaseContext';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface RecentCasesTableProps {
  cases: LegalCase[];
}

const RecentCasesTable: React.FC<RecentCasesTableProps> = ({ cases }) => {
  const statusStyles = {
    'open': 'bg-green-500/10 text-green-700 border-green-500',
    'closed': 'bg-gray-500/10 text-gray-700 border-gray-500',
    'suspended': 'bg-amber-500/10 text-amber-700 border-amber-500',
    'appeal': 'bg-blue-500/10 text-blue-700 border-blue-500',
  };

  const priorityStyles = {
    'high': 'bg-red-500/10 text-red-700 border-red-500',
    'medium': 'bg-amber-500/10 text-amber-700 border-amber-500',
    'low': 'bg-green-500/10 text-green-700 border-green-500',
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((legalCase) => (
            <TableRow key={legalCase.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{legalCase.title}</span>
                  <span className="text-xs text-muted-foreground">{legalCase.caseNumber}</span>
                </div>
              </TableCell>
              <TableCell className="capitalize">{legalCase.type}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={statusStyles[legalCase.status]}
                >
                  {legalCase.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={priorityStyles[legalCase.priority]}
                >
                  {legalCase.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(legalCase.updatedAt), 'MMM dd, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentCasesTable;
