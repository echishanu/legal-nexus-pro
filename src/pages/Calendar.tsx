
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/UI/PageHeader';
import CalendarView from '@/components/Calendar/CalendarView';
import EventDialog from '@/components/Calendar/EventDialog';
import { useEvent } from '@/contexts/EventContext';

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const { events } = useEvent();
  
  // Filter events for the selected date
  const eventsForSelectedDate = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Get dates that have events for highlighting in the calendar
  const datesWithEvents = events.map(event => new Date(event.date));

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <PageHeader 
          title="Calendar" 
          description="Manage your schedule and upcoming events"
        />
        <Button onClick={() => setIsEventDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar picker */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>{format(selectedDate, 'MMMM yyyy')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              className="rounded-md border"
              modifiers={{
                event: datesWithEvents,
              }}
              modifiersStyles={{
                event: { fontWeight: 'bold', textDecoration: 'underline' }
              }}
            />
          </CardContent>
        </Card>

        {/* Events for selected date */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Events for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarView 
              events={eventsForSelectedDate}
              selectedDate={selectedDate} 
            />
          </CardContent>
        </Card>
      </div>

      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarPage;
