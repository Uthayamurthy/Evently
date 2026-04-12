import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import type { ODRequest } from '../types';

export default function StudentDashboard() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [odRequests, setOdRequests] = useState<ODRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadODs();
  }, []);

  const loadODs = async () => {
    try {
      const data = await api.od.getMyODs();
      setOdRequests(data);
    } catch (error) {
      console.error('Failed to load ODs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {userName}</span>
            <button
              onClick={logout}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate('/student/apply')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
          >
            Apply for OD
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">My OD Requests</h2>

        {loading ? (
          <p>Loading...</p>
        ) : odRequests.length === 0 ? (
          <p className="text-gray-600">No OD requests found.</p>
        ) : (
          <div className="grid gap-4">
            {odRequests.map((od) => (
              <div
                key={od.id}
                className={`border-l-4 rounded-lg p-4 shadow ${getStatusColor(od.status)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{od.eventName}</h3>
                    <p className="mt-1">
                      <span className="font-semibold">Location:</span> {od.eventLocation}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> {od.eventDate}
                    </p>
                    <p>
                      <span className="font-semibold">Description:</span> {od.eventDescription}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold border">
                    {od.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}