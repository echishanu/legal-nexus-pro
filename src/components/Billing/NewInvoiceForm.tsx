
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useClient } from '@/contexts/ClientContext';
import { useBilling } from '@/contexts/BillingContext';
import { invoiceFormSchema, InvoiceFormValues } from './schemas/invoiceSchema';
import { cn } from '@/lib/utils';
import { DialogClose } from '@/components/ui/dialog';

const NewInvoiceForm: React.FC = () => {
  const { clients } = useClient();
  const { addInvoice, timeEntries } = useBilling();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: 'draft',
      notes: '',
      items: [
        {
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchItems = form.watch('items');

  // Calculate subtotal, tax, and total
  const subtotal = watchItems.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
  const taxRate = 0.08; // 8% tax rate - this could be configurable in a real app
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      setIsSubmitting(true);
      
      await addInvoice({
        invoiceNumber: data.invoiceNumber,
        clientId: data.clientId,
        issueDate: data.issueDate.toISOString(),
        dueDate: data.dueDate.toISOString(),
        status: data.status,
        notes: data.notes,
        items: data.items.map(item => ({
          id: item.id || `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          description: item.description,  // Ensure this is required
          quantity: item.quantity,        // Ensure this is required
          rate: item.rate,                // Ensure this is required
          amount: item.amount,            // Ensure this is required
          timeEntryId: item.timeEntryId
        })),
        amount: subtotal,
        tax: tax,
        total: total,
        companyId: 'current-company-id', // This would come from context
      });
      
      form.reset();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItemAmount = (index: number) => {
    const item = form.getValues(`items.${index}`);
    const amount = item.quantity * item.rate;
    form.setValue(`items.${index}.amount`, amount);
  };

  const availableTimeEntries = timeEntries.filter(entry => 
    !entry.invoiced && entry.billable
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
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
                      <SelectValue placeholder="Select a client" />
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
          
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Issue Date</FormLabel>
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
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
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
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Invoice Items</h3>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full divide-y">
              <thead className="bg-muted/50">
                <tr className="divide-x">
                  <th className="px-4 py-2 text-left font-medium">Description</th>
                  <th className="px-4 py-2 text-left font-medium w-[100px]">Qty</th>
                  <th className="px-4 py-2 text-left font-medium w-[120px]">Rate</th>
                  <th className="px-4 py-2 text-left font-medium w-[120px]">Amount</th>
                  <th className="px-4 py-2 text-center font-medium w-[60px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fields.map((field, index) => (
                  <tr key={field.id} className="divide-x">
                    <td className="px-4 py-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Description" className="border-0 p-0 shadow-none focus-visible:ring-0" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                step="0.01"
                                min="0.01"
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value));
                                  updateItemAmount(index);
                                }}
                                className="border-0 p-0 shadow-none focus-visible:ring-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.rate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center">
                                <span className="mr-1">$</span>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  step="0.01"
                                  min="0"
                                  onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value));
                                    updateItemAmount(index);
                                  }}
                                  className="border-0 p-0 shadow-none focus-visible:ring-0" 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center">
                                <span className="mr-1">$</span>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  readOnly
                                  className="border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td colSpan={5} className="px-4 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        append({
                          description: '',
                          quantity: 1,
                          rate: 0,
                          amount: 0,
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter any additional information..."
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col gap-2 justify-end">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="h-px bg-muted my-1"></div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewInvoiceForm;
