
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

const companySchema = z.object({
  name: z.string().min(1, { message: 'Company name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zipCode: z.string().min(1, { message: 'ZIP code is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.string().length(0)),
  logoUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.string().length(0)),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  companyId?: string;
  onComplete: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ companyId, onComplete }) => {
  const { companies, addCompany, updateCompany } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const existingCompany = companyId
    ? companies.find(company => company.id === companyId)
    : undefined;
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: existingCompany?.name || '',
      address: existingCompany?.address || '',
      city: existingCompany?.city || '',
      state: existingCompany?.state || '',
      zipCode: existingCompany?.zipCode || '',
      phone: existingCompany?.phone || '',
      email: existingCompany?.email || '',
      website: existingCompany?.website || '',
      logoUrl: existingCompany?.logoUrl || '',
    },
  });

  useEffect(() => {
    if (existingCompany) {
      form.reset({
        name: existingCompany.name,
        address: existingCompany.address,
        city: existingCompany.city,
        state: existingCompany.state,
        zipCode: existingCompany.zipCode,
        phone: existingCompany.phone,
        email: existingCompany.email,
        website: existingCompany.website || '',
        logoUrl: existingCompany.logoUrl || '',
      });
    }
  }, [existingCompany, form]);

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (companyId) {
        await updateCompany(companyId, data);
        toast.success('Company updated successfully');
      } else {
        // Ensure all properties required by the Company type are provided
        const newCompany = {
          id: `company-${Date.now()}`, // Generate a temporary ID
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          phone: data.phone,
          email: data.email,
          website: data.website || '',
          logoUrl: data.logoUrl || '',
        };
        
        await addCompany(newCompany);
        toast.success('Company added successfully');
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Failed to save company');
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
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter company name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="company@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(123) 456-7890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123 Law Street" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="City" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="State" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ZIP Code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/logo.png" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : companyId ? 'Update Company' : 'Add Company'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyForm;
