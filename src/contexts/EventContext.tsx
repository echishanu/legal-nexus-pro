
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import { useCase } from './CaseContext';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string format
  time: string; // HH:MM format
  endTime?: string; // HH:MM format
  location?: string;
  type: 'court' | 'meeting' | 'deadline' | 'reminder' | 'other';
  caseId?: string;
  clientId?: string;
  attendees?: string[];
  createdBy: string;
  companyId: string;
  reminderSet?: boolean;
  allDay?: boolean;
}

interface EventContextType {
  events: Event[];
  isLoading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<boolean>;
  getEventById: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Mock data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Court Hearing',
    description: 'Initial hearing for Smith v. Johnson case',
    date: '2024-04-12T00:00:00Z',
    time: '10:00',
    endTime: '11:30',
    location: 'County Courthouse, Room 302',
    type: 'court',
    caseId: '1',
    createdBy: '2',
    companyId: '1',
  },
  {
    id: '2',
    title: 'Client Meeting',
    description: 'Review estate planning documents with Michael Williams',
    date: '2024-04-14T00:00:00Z',
    time: '14:30',
    endTime: '15:30',
    location: 'Office - Conference Room B',
    type: 'meeting',
    caseId: '2',
    clientId: '2',
    createdBy: '2',
    companyId: '1',
  },
  {
    id: '3',
    title: 'Filing Deadline',
    description: 'Submit response brief for State v. Brown',
    date: '2024-04-18T00:00:00Z',
    time: '17:00',
    type: 'deadline',
    caseId: '3',
    createdBy: '3',
    companyId: '1',
    allDay: true,
  },
  {
    id: '4',
    title: 'Team Meeting',
    description: 'Weekly team status update',
    date: '2024-04-15T00:00:00Z',
    time: '09:00',
    endTime: '10:00',
    location: 'Main Conference Room',
    type: 'meeting',
    createdBy: '2',
    companyId: '1',
    attendees: ['2', '3', '4'],
  },
  {
    id: '5',
    title: 'Document Review',
    description: 'Review TechCorp acquisition contracts',
    date: '2024-04-20T00:00:00Z',
    time: '13:00',
    endTime: '16:00',
    type: 'other',
    caseId: '4',
    createdBy: '2',
    companyId: '1',
  },
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const { cases } = useCase();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (user && currentCompany) {
          // Filter events by company
          const filteredEvents = MOCK_EVENTS.filter(e => e.companyId === currentCompany.id);
          setEvents(filteredEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user, currentCompany]);

  const addEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  const updateEvent = async (id: string, eventUpdate: Partial<Event>): Promise<Event> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let updatedEvent: Event | undefined;
    
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === id) {
          updatedEvent = { ...event, ...eventUpdate };
          return updatedEvent;
        }
        return event;
      })
    );
    
    if (!updatedEvent) {
      throw new Error('Event not found');
    }
    
    return updatedEvent;
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    return true;
  };

  const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  return (
    <EventContext.Provider value={{
      events,
      isLoading,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
