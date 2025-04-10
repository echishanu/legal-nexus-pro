
import React from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Clock, 
  MapPin, 
  Briefcase, 
  AlertCircle, 
  Calendar as CalendarIcon,
  MoreHorizontal,
  Edit,
  Trash2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Event } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEvent } from '@/contexts/EventContext';
import { useCase } from '@/contexts/CaseContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import EventDialog from './EventDialog';

interface CalendarViewProps {
  events: Event[];
  selectedDate: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, selectedDate }) => {
  const { deleteEvent } = useEvent();
  const { cases } = useCase();
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
  const getCaseTitle = (caseId: string | undefined) => {
    if (!caseId) return null;
    const foundCase = cases.find(c => c.id === caseId);
    return foundCase?.title || null;
  };

  const handleDelete = async (event: Event) => {
    try {
      await deleteEvent(event.id);
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };
  
  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'court':
        return 'bg-red-100 text-red-800';
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'deadline':
        return 'bg-amber-100 text-amber-800';
      case 'reminder':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {events.length > 0 ? (
        events.map((event) => (
          <div 
            key={event.id} 
            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">{event.title}</h3>
                  <span className={cn('ml-2 px-2 py-1 rounded-full text-xs font-medium capitalize', getEventTypeColor(event.type))}>
                    {event.type}
                  </span>
                </div>
                
                {event.description && (
                  <p className="text-muted-foreground mt-1">{event.description}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {event.allDay ? (
                      'All day'
                    ) : (
                      <>
                        {event.time}
                        {event.endTime && ` - ${event.endTime}`}
                      </>
                    )}
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {event.location}
                    </div>
                  )}
                  
                  {event.caseId && (
                    <div className="flex items-center">
                      <Briefcase className="h-3.5 w-3.5 mr-1" />
                      {getCaseTitle(event.caseId)}
                    </div>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open actions menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(event)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(event)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <CalendarIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No events for this day</h3>
          <p className="text-muted-foreground mt-1">
            Click on "New Event" to add an event for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
      )}
      
      {selectedEvent && (
        <EventDialog 
          isOpen={isEditDialogOpen} 
          onClose={() => setIsEditDialogOpen(false)}
          selectedDate={new Date(selectedEvent.date)}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default CalendarView;
