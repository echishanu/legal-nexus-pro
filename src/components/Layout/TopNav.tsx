
import React, { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';

const TopNav: React.FC = () => {
  const { currentCompany, companies, setCurrentCompany } = useCompany();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center md:w-1/3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full bg-background"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4 ml-auto">
          {companies.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  {currentCompany?.name || 'Select Company'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {companies.map((company) => (
                  <DropdownMenuItem
                    key={company.id}
                    className={cn(
                      "cursor-pointer",
                      currentCompany?.id === company.id && "bg-accent/50"
                    )}
                    onClick={() => setCurrentCompany(company)}
                  >
                    {company.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer py-3 px-4">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">New case assignment</p>
                      <p className="text-sm text-muted-foreground">
                        You have been assigned to the Smith v. Johnson case
                      </p>
                      <p className="text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer font-medium text-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile search */}
      <div className={cn(
        "px-4 pb-3 md:hidden",
        !isMobileMenuOpen && "hidden"
      )}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 w-full bg-background"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
