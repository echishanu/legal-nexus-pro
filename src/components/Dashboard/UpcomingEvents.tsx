
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  caseId?: string;
  caseTitle?: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-start border-b border-border pb-4 last:border-0 last:pb-0">
          <div className="flex flex-col items-center mr-4">
            <div className="bg-background border border-border rounded-md p-2 w-14 text-center">
              <div className="text-xs text-muted-foreground">
                {format(new Date(event.date), 'MMM')}
              </div>
              <div className="text-xl font-bold">
                {format(new Date(event.date), 'd')}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium">{event.title}</h4>
            {event.caseTitle && (
              <p className="text-sm text-muted-foreground">
                Case: {event.caseTitle}
              </p>
            )}
            <div className="flex items-center mt-2 space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {event.time}
              </div>
            </div>
          </div>
          <div>
            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
              event.type === 'court' 
                ? 'bg-red-100 text-red-800' 
                : event.type === 'deadline'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {event.type}
            </span>
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No upcoming events
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
