
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

type ProfileFormValues = {
  name: string;
  email: string;
  position: string;
  bio: string;
};

const ProfileSettings = () => {
  const { user } = useAuth();

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      position: 'Attorney',
      bio: '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, this would update the user's profile
    console.log('Profile update:', data);
    toast.success('Profile updated successfully');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
      
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          {user?.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.name} />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        
        <Button variant="outline">Change Avatar</Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Brief description of your professional background
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileSettings;
