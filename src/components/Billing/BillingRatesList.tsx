
import React, { useState } from 'react';
import { useBilling } from '@/contexts/BillingContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash } from 'lucide-react';
import BillingRateForm from './BillingRateForm';
import DeleteBillingRateDialog from './DeleteBillingRateDialog';

const BillingRatesList: React.FC = () => {
  const { billingRates } = useBilling();
  const [isAddRateOpen, setIsAddRateOpen] = useState(false);
  const [editRateId, setEditRateId] = useState<string | null>(null);
  const [deleteRateId, setDeleteRateId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Billing Rates</h2>
        <Dialog open={isAddRateOpen} onOpenChange={setIsAddRateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Billing Rate</DialogTitle>
            </DialogHeader>
            <BillingRateForm onComplete={() => setIsAddRateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {billingRates.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-md">
            <p className="text-muted-foreground">No billing rates found. Add your first rate to get started.</p>
          </div>
        ) : (
          billingRates.map((rate) => (
            <Card key={rate.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{rate.name}</CardTitle>
                  <div className="text-2xl font-bold">${rate.amount.toFixed(2)}</div>
                </div>
                <CardDescription className="capitalize">{rate.type} Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{rate.description || 'No description provided'}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditRateId(rate.id)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => setDeleteRateId(rate.id)}>
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Edit Billing Rate Dialog */}
      <Dialog open={editRateId !== null} onOpenChange={() => setEditRateId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Billing Rate</DialogTitle>
          </DialogHeader>
          {editRateId && <BillingRateForm rateId={editRateId} onComplete={() => setEditRateId(null)} />}
        </DialogContent>
      </Dialog>

      {/* Delete Billing Rate Dialog */}
      <DeleteBillingRateDialog 
        open={deleteRateId !== null} 
        rateId={deleteRateId || ''} 
        onOpenChange={() => setDeleteRateId(null)} 
      />
    </div>
  );
};

export default BillingRatesList;
