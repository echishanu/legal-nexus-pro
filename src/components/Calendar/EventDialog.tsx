
import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useCase } from '@/contexts/CaseContext';
import { useEvent } from '@/contexts/EventContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Switch,
} from '@/components/ui/switch';
import { Event } from '@/contexts/EventContext';
import { cn } from '@/lib/utils';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  event?: Event;
}

type EventFormValues = {
  title: string;
  description: string;
  date: Date;
  time: string;
  endTime?: string;
  location?: string;
  type: 'court' | 'meeting' | 'deadline' | 'reminder' | 'other';
  caseId?: string;
  allDay: boolean;
  reminderSet: boolean;
};

const EventDialog: React.FC<EventDialogProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate,
  event 
}) => {
  const { cases } = useCase();
  const { addEvent, updateEvent } = useEvent();
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  
  const isEditMode = !!event;
  
  const form = useForm<EventFormValues>({
    defaultValues: event
      ? {
          title: event.title,
          description: event.description,
          date: new Date(event.date),
          time: event.time,
          endTime: event.endTime || '',
          location: event.location || '',
          type: event.type,
          caseId: event.caseId || undefined,
          allDay: event.allDay || false,
          reminderSet: event.reminderSet || false,
        }
      : {
          title: '',
          description: '',
          date: selectedDate,
          time: '09:00',
          endTime: '10:00',
          location: '',
          type: 'meeting',
          caseId: undefined,
          allDay: false,
          reminderSet: false,
        },
  });
  
  const allDay = form.watch('allDay');
  
  const onSubmit = async (values: EventFormValues) => {
    try {
      if (!currentCompany || !user) {
        toast.error('Unable to create event: missing company or user information');
        return;
      }

      const eventData = {
        title: values.title,
        description: values.description,
        date: values.date.toISOString(),
        time: values.time,
        endTime: values.allDay ? undefined : values.endTime,
        location: values.location,
        type: values.type,
        caseId: values.caseId,
        allDay: values.allDay,
        reminderSet: values.reminderSet,
        companyId: currentCompany.id,
        createdBy: user.id,
      };

      if (isEditMode && event) {
        await updateEvent(event.id, eventData);
        toast.success('Event updated successfully');
      } else {
        await addEvent(eventData);
        toast.success('Event created successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} event`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter event title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="court">Court</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">All-day Event</FormLabel>
                    <FormDescription>
                      Set if this event lasts the entire day
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {!allDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field} 
                            type="time" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field} 
                            type="time" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="caseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Case (optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a case" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {cases.map((caseItem) => (
                        <SelectItem key={caseItem.id} value={caseItem.id}>
                          {caseItem.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reminderSet"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Set Reminder</FormLabel>
                    <FormDescription>
                      Get notified before this event
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter event description"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
