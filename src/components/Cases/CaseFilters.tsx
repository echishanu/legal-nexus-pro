
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FiltersState {
  status: string;
  type: string;
  priority: string;
  search: string;
}

interface CaseFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

const CaseFilters: React.FC<CaseFiltersProps> = ({ filters, setFilters }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (value: string, filterType: keyof FiltersState) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search cases..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange(value, 'status')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="appeal">Appeal</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange(value, 'type')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="criminal">Criminal</SelectItem>
            <SelectItem value="civil">Civil</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value) => handleFilterChange(value, 'priority')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CaseFilters;
