
import * as z from 'zod';

// Define the schema with proper types
export const documentFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  fileType: z.enum(['pdf', 'docx', 'xlsx', 'jpg', 'png', 'other']),
  fileSize: z.number().min(1, { message: 'File size must be specified' }),
  status: z.enum(['draft', 'final', 'archived']),
  caseId: z.string().optional(),
  clientId: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
