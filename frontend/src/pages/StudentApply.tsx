import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import type { Event } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function StudentApply() {
  const { userName, userId } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [useExisting, setUseExisting] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [formData, setFormData] = useState({
    eventName: '',
    eventLocation: '',
    eventDate: '',
    eventDescription: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.events.getVerified();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleEventSelect = (eventId: string | null) => {
    if (!eventId) {
      return;
    }

    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(eventId);
      setFormData({
        eventName: event.eventName,
        eventLocation: event.eventLocation,
        eventDate: event.eventDate,
        eventDescription: event.eventDescription,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.eventName || !formData.eventDate) {
      setError('Please fill in all required fields (Event Name and Date).');
      return;
    }

    setIsSubmitting(true);
    const odData = {
      studentName: userName,
      studentRollNumber: userId,
      eventName: formData.eventName,
      eventLocation: formData.eventLocation,
      eventDate: formData.eventDate,
      eventDescription: formData.eventDescription,
    };

    try {
      const response = await api.od.apply(odData);
      if (response.id) {
        setSuccess('Your OD application was submitted successfully!');
        setTimeout(() => navigate('/student/dashboard'), 2000);
        return;
      }

      setError('Failed to submit OD application.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit OD application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Apply for On-Duty</h2>
          <p className="text-muted-foreground mt-2">
            Submit a new OD application by selecting a pre-verified event or entering manual details.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
             <AlertCircle className="text-red-500 h-5 w-5" />
             <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center gap-3">
             <CheckCircle2 className="text-green-500 h-5 w-5" />
             <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Fill out the form below to request OD approval.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center space-x-2 border rounded-lg p-4 bg-slate-50/50">
              <input
                type="checkbox"
                id="manual-entry"
                checked={!useExisting}
                onChange={(e) => setUseExisting(!e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="manual-entry" className="font-medium cursor-pointer flex-1">
                Enter Event Details Manually instead of using a pre-verified event list.
              </Label>
            </div>

            {useExisting && (
              <div className="mb-8 grid gap-2">
                <Label htmlFor="existing-event">Select Existing Event <span className="text-red-500">*</span></Label>
                <Select value={selectedEvent} onValueChange={handleEventSelect}>
                  <SelectTrigger id="existing-event">
                    <SelectValue placeholder="-- Select an Event --" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.eventName} - {event.eventDate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Separator />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="eventName">Event Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="eventName"
                    disabled={useExisting}
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="eventLocation">Location</Label>
                    <Input
                      id="eventLocation"
                      disabled={useExisting}
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="eventDate">Event Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="eventDate"
                      type="date"
                      disabled={useExisting}
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="eventDescription">Description / Additional Notes</Label>
                  <textarea
                    id="eventDescription"
                    disabled={useExisting}
                    value={formData.eventDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDescription: e.target.value })
                    }
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                 <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                   {isSubmitting ? "Submitting..." : "Submit Application"}
                 </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
