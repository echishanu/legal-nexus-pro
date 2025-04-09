
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBilling } from '@/contexts/BillingContext';
import InvoiceList from '@/components/Billing/InvoiceList';
import TimeEntryList from '@/components/Billing/TimeEntryList';
import BillingRatesList from '@/components/Billing/BillingRatesList';
import InvoiceFilters from '@/components/Billing/InvoiceFilters';
import TimeEntryFilters from '@/components/Billing/TimeEntryFilters';
import PageHeader from '@/components/UI/PageHeader';

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const { isLoading } = useBilling();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Billing</h1>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Billing" description="Manage invoices, time entries, and billing rates" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="time">Time Entries</TabsTrigger>
          <TabsTrigger value="rates">Billing Rates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices">
          <InvoiceFilters />
          <InvoiceList />
        </TabsContent>
        
        <TabsContent value="time">
          <TimeEntryFilters />
          <TimeEntryList />
        </TabsContent>
        
        <TabsContent value="rates">
          <BillingRatesList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing;
