
import React from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { useCase } from '@/contexts/CaseContext';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/Dashboard/StatCard';
import RecentCasesTable from '@/components/Dashboard/RecentCasesTable';
import UpcomingEvents from '@/components/Dashboard/UpcomingEvents';
import { Briefcase, Users, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { currentCompany } = useCompany();
  const { cases, clients, isLoading } = useCase();
  const { user } = useAuth();

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: '1',
      title: 'Court Hearing',
      date: '2024-04-12T00:00:00Z',
      time: '10:00 AM',
      type: 'court',
      caseId: '1',
      caseTitle: 'Smith v. Johnson',
    },
    {
      id: '2',
      title: 'Client Meeting',
      date: '2024-04-14T00:00:00Z',
      time: '2:30 PM',
      type: 'meeting',
      caseId: '2',
      caseTitle: 'In re: Williams Estate',
    },
    {
      id: '3',
      title: 'Filing Deadline',
      date: '2024-04-18T00:00:00Z',
      time: '5:00 PM',
      type: 'deadline',
      caseId: '3',
      caseTitle: 'State v. Brown',
    },
  ];

  // Stats calculations
  const openCasesCount = cases.filter(c => c.status === 'open').length;
  const documentsCount = 24; // Mock document count
  const activeClientsCount = clients.filter(c => c.status === 'active').length;
  const upcomingEventsCount = upcomingEvents.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-law-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening at {currentCompany?.name} today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Cases" 
          value={openCasesCount}
          icon={Briefcase} 
          trend={{ value: 12, isPositive: true }} 
        />
        <StatCard 
          title="Active Clients" 
          value={activeClientsCount}
          icon={Users} 
          trend={{ value: 5, isPositive: true }} 
        />
        <StatCard 
          title="Documents" 
          value={documentsCount}
          icon={FileText} 
        />
        <StatCard 
          title="Upcoming Events" 
          value={upcomingEventsCount}
          icon={Clock} 
        />
      </div>

      {/* Two column layout for main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent cases */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>
              Overview of your most recently updated cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentCasesTable cases={cases.slice(0, 5)} />
          </CardContent>
        </Card>

        {/* Upcoming events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Your schedule for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingEvents events={upcomingEvents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
