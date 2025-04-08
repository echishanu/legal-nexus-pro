
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCase } from '@/contexts/CaseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft, Trash2, Calendar, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';
import EditCaseDialog from '@/components/Cases/EditCaseDialog';
import DeleteCaseDialog from '@/components/Cases/DeleteCaseDialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { LegalCase } from '@/contexts/CaseContext';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases, clients, isLoading } = useCase();
  const { toast } = useToast();
  const [caseData, setCaseData] = useState<LegalCase | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && cases.length > 0) {
      const foundCase = cases.find(c => c.id === id);
      if (foundCase) {
        setCaseData(foundCase);
      } else {
        toast({
          title: "Case not found",
          description: "The case you're looking for doesn't exist.",
          variant: "destructive"
        });
        navigate('/cases');
      }
    }
  }, [id, cases, isLoading, navigate, toast]);

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

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const handleEditCase = (updatedCase: LegalCase) => {
    setCaseData(updatedCase);
    setIsEditDialogOpen(false);
    toast({
      title: "Case Updated",
      description: `Case "${updatedCase.title}" has been updated successfully.`,
    });
  };

  const handleDeleteCase = () => {
    toast({
      title: "Case Deleted",
      description: "The case has been deleted successfully.",
    });
    setIsDeleteDialogOpen(false);
    navigate('/cases');
  };

  if (isLoading || !caseData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-law-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4"
            onClick={() => navigate('/cases')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{caseData.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">Case #{caseData.caseNumber}</span>
              <span className="text-muted-foreground">•</span>
              {getStatusBadge(caseData.status)}
              <span className="text-muted-foreground">•</span>
              {getPriorityBadge(caseData.priority)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          {/* Case Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
                <CardDescription>Detailed information about this case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                  <p>{caseData.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Type</h3>
                    <p className="capitalize">{caseData.type}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Created</h3>
                    <p>{format(new Date(caseData.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h3>
                    <p>{format(new Date(caseData.updatedAt), 'MMM d, yyyy')}</p>
                  </div>
                  {caseData.dueDate && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Due Date</h3>
                      <p>{format(new Date(caseData.dueDate), 'MMM d, yyyy')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client info */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Client</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{getClientName(caseData.clientId)}</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm"
                    onClick={() => navigate(`/clients/${caseData.clientId}`)}
                  >
                    View Client Details
                  </Button>
                </CardContent>
              </Card>

              {/* Documents preview */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Documents</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">0 documents attached</p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 text-sm"
                    size="sm"
                  >
                    Attach Document
                  </Button>
                </CardContent>
              </Card>

              {/* Events preview */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Upcoming Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 text-sm"
                    size="sm"
                  >
                    Schedule Event
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Timeline</CardTitle>
              <CardDescription>History of events and actions for this case</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No timeline events available yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Documents</CardTitle>
              <CardDescription>Files and documents related to this case</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No documents attached to this case yet.</p>
                <Button className="mt-4">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {isEditDialogOpen && (
        <EditCaseDialog
          caseData={caseData}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleEditCase}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteCaseDialog
          caseData={caseData}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleDeleteCase}
        />
      )}
    </div>
  );
};

export default CaseDetail;
