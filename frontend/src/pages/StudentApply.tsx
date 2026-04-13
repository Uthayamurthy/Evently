import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import type { Event } from '../types';

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

  const handleEventSelect = (eventId: string) => {
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
      setError('Please fill in all required fields');
      return;
    }

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
        setSuccess('OD application submitted successfully!');
        setTimeout(() => navigate('/student/dashboard'), 2000);
        return;
      }

      setError('Failed to submit OD application');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit OD application');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <button onClick={() => navigate('/student/dashboard')} className="text-white">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Apply for OD</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!useExisting}
                onChange={(e) => setUseExisting(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="font-semibold">Enter Event Details Manually</span>
            </label>
          </div>

          {useExisting && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Existing Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => handleEventSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select an Event --</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.eventName} - {event.eventDate}
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Event Location
                  </label>
                  <input
                    type="text"
                    value={formData.eventLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, eventLocation: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Event Description
                </label>
                <textarea
                  value={formData.eventDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit OD Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
