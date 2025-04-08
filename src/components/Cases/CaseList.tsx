
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { LegalCase } from '@/contexts/CaseContext';
import { Edit, MoreHorizontal, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import DeleteCaseDialog from './DeleteCaseDialog';
import EditCaseDialog from './EditCaseDialog';

interface CaseListProps {
  cases: LegalCase[];
}

const CaseList: React.FC<CaseListProps> = ({ cases }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [caseToEdit, setCaseToEdit] = React.useState<LegalCase | null>(null);
  const [caseToDelete, setCaseToDelete] = React.useState<LegalCase | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Open</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'suspended':
        return <Badge className="bg-amber-500">Suspended</Badge>;
      case 'appeal':
        return <Badge className="bg-blue-500">Appeal</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleEditCase = (updatedCase: LegalCase) => {
    toast({
      title: "Case Updated",
      description: `Case "${updatedCase.title}" has been updated successfully.`,
    });
    setCaseToEdit(null);
  };

  const handleDeleteCase = (caseId: string) => {
    toast({
      title: "Case Deleted",
      description: "The case has been deleted successfully.",
    });
    setCaseToDelete(null);
  };

  if (cases.length === 0) {
    return (
      <div className="text-center p-10">
        <h3 className="text-lg font-medium">No cases found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Number</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Priority</TableHead>
              <TableHead className="hidden md:table-cell">Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.caseNumber}</TableCell>
                <TableCell>{caseItem.title}</TableCell>
                <TableCell className="hidden md:table-cell capitalize">{caseItem.type}</TableCell>
                <TableCell className="hidden md:table-cell">{getStatusBadge(caseItem.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{getPriorityBadge(caseItem.priority)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(caseItem.updatedAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/cases/${caseItem.id}`)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCaseToEdit(caseItem)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setCaseToDelete(caseItem)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {caseToEdit && (
        <EditCaseDialog
          caseData={caseToEdit}
          isOpen={!!caseToEdit}
          onClose={() => setCaseToEdit(null)}
          onSave={handleEditCase}
        />
      )}

      {caseToDelete && (
        <DeleteCaseDialog
          caseData={caseToDelete}
          isOpen={!!caseToDelete}
          onClose={() => setCaseToDelete(null)}
          onDelete={() => handleDeleteCase(caseToDelete.id)}
        />
      )}
    </>
  );
};

export default CaseList;
