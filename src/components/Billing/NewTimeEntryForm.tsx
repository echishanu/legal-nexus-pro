
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useClient } from '@/contexts/ClientContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBilling } from '@/contexts/BillingContext';
import { DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const timeEntrySchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  date: z.date({
    required_error: 'Date is required',
  }),
  hours: z.coerce.number().min(0, { message: 'Hours must be 0 or greater' }),
  minutes: z.coerce.number().min(0, { message: 'Minutes must be 0 or greater' }).max(59, { message: 'Minutes must be less than 60' }),
  rate: z.coerce.number().min(0, { message: 'Rate must be 0 or greater' }),
  billable: z.boolean().default(true),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
});

type TimeEntryFormValues = z.infer<typeof timeEntrySchema>;

const NewTimeEntryForm: React.FC = () => {
  const { user } = useAuth();
  const { clients } = useClient();
  const { addTimeEntry, billingRates } = useBilling();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TimeEntryFormValues>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      description: '',
      date: new Date(),
      hours: 0,
      minutes: 0,
      rate: billingRates.length > 0 ? billingRates[0].amount : 0,
      billable: true,
      clientId: undefined,
      caseId: undefined,
    },
  });

  const onSubmit = async (data: TimeEntryFormValues) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Convert hours and minutes to total minutes
      const totalMinutes = (data.hours * 60) + data.minutes;
      
      await addTimeEntry({
        description: data.description,
        date: data.date.toISOString(),
        duration: totalMinutes,
        rate: data.rate,
        billable: data.billable,
        invoiced: false,
        clientId: data.clientId,
        caseId: data.caseId,
        userId: user.id,
        companyId: 'current-company-id', // This would come from context
      });
      
      form.reset();
    } catch (error) {
      console.error('Error creating time entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="What did you work on?" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-end gap-2">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="billable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Billable</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Time Entry'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewTimeEntryForm;
