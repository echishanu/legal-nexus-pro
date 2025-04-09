
import * as z from 'zod';

export const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, { message: 'Invoice number is required' }),
  clientId: z.string().min(1, { message: 'Client is required' }),
  issueDate: z.date({
    required_error: 'Issue date is required',
  }),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'], {
    required_error: 'Status is required',
  }),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      description: z.string().min(1, { message: 'Description is required' }),
      quantity: z.number().min(0.01, { message: 'Quantity must be greater than 0' }),
      rate: z.number().min(0, { message: 'Rate must be greater than or equal to 0' }),
      amount: z.number().min(0, { message: 'Amount must be greater than or equal to 0' }),
      timeEntryId: z.string().optional(),
    })
  ).min(1, { message: 'At least one item is required' }),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
