
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useClient } from '@/contexts/ClientContext';

export const ClientFilters: React.FC = () => {
  const { filters, setFilters } = useClient();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Local state for managing filters in the sheet
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setIsFiltersOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      status: [],
      type: [],
      dateRange: { from: undefined, to: undefined }
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    setIsFiltersOpen(false);
  };

  const toggleStatusFilter = (status: string) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const toggleTypeFilter = (type: string) => {
    setLocalFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  // Calculate number of active filters
  const activeFilterCount = 
    filters.status.length + 
    filters.type.length + 
    (filters.dateRange.from ? 1 : 0);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filter Clients</SheetTitle>
          </SheetHeader>

          <div className="grid gap-6 py-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Client Status</h3>
              <div className="flex flex-wrap gap-2">
                {['active', 'inactive', 'potential'].map(status => (
                  <Badge
                    key={status}
                    variant={localFilters.status.includes(status) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleStatusFilter(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-3">Client Type</h3>
              <div className="flex flex-wrap gap-2">
                {['individual', 'business'].map(type => (
                  <Badge
                    key={type}
                    variant={localFilters.type.includes(type) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleTypeFilter(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Date Range</h3>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal w-full"
                    >
                      {localFilters.dateRange.from ? (
                        format(localFilters.dateRange.from, 'PP')
                      ) : (
                        <span className="text-muted-foreground">From date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localFilters.dateRange.from}
                      onSelect={(date) => setLocalFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: date }
                      }))}
                      disabled={(date) => 
                        date > new Date() || 
                        (localFilters.dateRange.to ? date > localFilters.dateRange.to : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal w-full"
                    >
                      {localFilters.dateRange.to ? (
                        format(localFilters.dateRange.to, 'PP')
                      ) : (
                        <span className="text-muted-foreground">To date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localFilters.dateRange.to}
                      onSelect={(date) => setLocalFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: date }
                      }))}
                      disabled={(date) => 
                        date > new Date() || 
                        (localFilters.dateRange.from ? date < localFilters.dateRange.from : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(localFilters.dateRange.from || localFilters.dateRange.to) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { from: undefined, to: undefined }
                  }))}
                >
                  <X className="mr-1 h-4 w-4" /> Clear dates
                </Button>
              )}
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
