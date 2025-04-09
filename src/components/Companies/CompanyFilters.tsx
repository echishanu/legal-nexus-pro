
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Company } from '@/contexts/CompanyContext';

interface CompanyFiltersProps {
  companies: Company[];
  onFilter: (filtered: Company[]) => void;
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({ companies, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  // Get unique states for filter
  const states = [...new Set(companies.map(company => company.state))].sort();

  useEffect(() => {
    let filtered = [...companies];
    
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (stateFilter) {
      filtered = filtered.filter(company => company.state === stateFilter);
    }
    
    onFilter(filtered);
  }, [searchTerm, stateFilter, companies, onFilter]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search companies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="sm:max-w-xs"
      />
      
      <Select value={stateFilter} onValueChange={setStateFilter}>
        <SelectTrigger className="sm:max-w-xs">
          <SelectValue placeholder="Filter by state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All States</SelectItem>
          {states.map(state => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanyFilters;
