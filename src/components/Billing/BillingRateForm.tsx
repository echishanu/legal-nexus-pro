
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useBilling } from '@/contexts/BillingContext';

const billingRateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  amount: z.coerce.number().min(0, { message: 'Amount must be 0 or greater' }),
  type: z.enum(['hourly', 'fixed', 'contingency'], { required_error: 'Type is required' }),
  description: z.string().optional(),
});

type BillingRateFormValues = z.infer<typeof billingRateSchema>;

interface BillingRateFormProps {
  rateId?: string;
  onComplete: () => void;
}

const BillingRateForm: React.FC<BillingRateFormProps> = ({ rateId, onComplete }) => {
  const { addBillingRate, updateBillingRate, billingRates } = useBilling();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const existingRate = rateId ? billingRates.find(rate => rate.id === rateId) : undefined;
  
  const form = useForm<BillingRateFormValues>({
    resolver: zodResolver(billingRateSchema),
    defaultValues: {
      name: existingRate?.name || '',
      amount: existingRate?.amount || 0,
      type: existingRate?.type || 'hourly',
      description: existingRate?.description || '',
    },
  });

  useEffect(() => {
    if (existingRate) {
      form.reset({
        name: existingRate.name,
        amount: existingRate.amount,
        type: existingRate.type,
        description: existingRate.description || '',
      });
    }
  }, [existingRate, form]);

  const onSubmit = async (data: BillingRateFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (rateId) {
        await updateBillingRate(rateId, data);
      } else {
        // Make sure all required properties are present
        const newRate = {
          name: data.name,
          amount: data.amount,
          type: data.type,
          description: data.description
        };
        
        await addBillingRate(newRate);
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving billing rate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Standard Rate, Partner Rate" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="contingency">Contingency</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe when this rate should be used" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : rateId ? 'Update Rate' : 'Add Rate'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BillingRateForm;
