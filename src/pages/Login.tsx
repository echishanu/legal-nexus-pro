
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      navigate('/');
    } catch (error) {
      // Error is already handled in the auth context
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts for quick access
  const demoAccounts = [
    { email: 'admin@legal-nexus.com', password: 'admin123', role: 'Admin' },
    { email: 'john@lawfirm.com', password: 'password', role: 'Company Admin' },
    { email: 'jane@lawfirm.com', password: 'password', role: 'Employee' },
  ];

  const loginWithDemo = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand */}
      <div className="bg-law-primary text-white p-8 flex flex-col justify-between md:w-1/2 md:max-w-md">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">LN</span>
            </div>
            <h1 className="text-2xl font-bold">LegalNexus Pro</h1>
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">The Complete Law Firm Management Solution</h2>
          <p className="text-white/80 mb-8">
            Streamline your practice with our comprehensive case management, document handling, and client relationship tools.
          </p>
        </div>

        <div className="hidden md:block">
          <p className="text-sm text-white/60">© 2025 LegalNexus. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Please sign in to your account</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {/* Demo accounts */}
          <div>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Try a demo account:
            </p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.email}
                  variant="outline"
                  className="w-full justify-between text-sm"
                  onClick={() => loginWithDemo(account.email, account.password)}
                  disabled={isLoading}
                >
                  <span>{account.role}</span>
                  <span className="text-muted-foreground">{account.email}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Need assistance? <a href="#" className="text-primary hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
