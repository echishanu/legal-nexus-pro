
import React from 'react';
import { useDocument } from '@/contexts/DocumentContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';

export const DocumentFilters: React.FC = () => {
  const { filters, setFilters } = useDocument();

  const fileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'other'];
  const statusOptions = ['draft', 'final', 'archived'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value,
    });
  };

  const toggleFileTypeFilter = (fileType: string) => {
    setFilters({
      ...filters,
      fileType: filters.fileType.includes(fileType)
        ? filters.fileType.filter(t => t !== fileType)
        : [...filters.fileType, fileType],
    });
  };

  const toggleStatusFilter = (status: string) => {
    setFilters({
      ...filters,
      status: filters.status.includes(status)
        ? filters.status.filter(s => s !== status)
        : [...filters.status, status],
    });
  };

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    setFilters({
      ...filters,
      dateRange: {
        from: range.from,
        to: range.to,
      },
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      fileType: [],
      status: [],
      dateRange: {},
    });
  };

  const hasActiveFilters = filters.search || 
    filters.fileType.length > 0 || 
    filters.status.length > 0 || 
    filters.dateRange.from || 
    filters.dateRange.to;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Search documents..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">File Type</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Select File Types</h4>
              <div className="flex flex-wrap gap-2">
                {fileTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={filters.fileType.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFileTypeFilter(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Status</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Select Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <Badge
                    key={status}
                    variant={filters.status.includes(status) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleStatusFilter(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Date Range</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: filters.dateRange.from,
                to: filters.dateRange.to,
              }}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground">Filters:</span>
          
          {filters.fileType.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleFileTypeFilter(type)}
              />
            </Badge>
          ))}
          
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleStatusFilter(status)}
              />
            </Badge>
          ))}
          
          {filters.dateRange.from && (
            <Badge variant="secondary" className="gap-1">
              {filters.dateRange.from.toLocaleDateString()} - {filters.dateRange.to ? filters.dateRange.to.toLocaleDateString() : 'Now'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({...filters, dateRange: {}})}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
