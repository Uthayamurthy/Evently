import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import type { ODRequest } from '../types';

export default function FacultyDashboard() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingODs, setPendingODs] = useState<ODRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPendingODs();
  }, []);

  const loadPendingODs = async () => {
    try {
      const data = await api.od.getPending();
      setPendingODs(data);
    } catch (error) {
      console.error('Failed to load pending ODs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.od.approve(id);
      loadPendingODs();
    } catch (error) {
      console.error('Failed to approve OD:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.od.reject(id);
      loadPendingODs();
    } catch (error) {
      console.error('Failed to reject OD:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Faculty Dashboard</h1>
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
            onClick={() => navigate('/faculty/records')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
          >
            View Records by Month
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">Pending OD Requests</h2>

        {loading ? (
          <p>Loading...</p>
        ) : pendingODs.length === 0 ? (
          <p className="text-gray-600">No pending OD requests.</p>
        ) : (
          <div className="grid gap-4">
            {pendingODs.map((od) => (
              <div
                key={od.id}
                className="bg-white border-l-4 border-yellow-500 rounded-lg p-4 shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{od.eventName}</h3>
                    <p className="mt-1 text-gray-600">
                      <span className="font-semibold">Student:</span> {od.studentName} (
                      {od.studentRollNumber})
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {od.eventLocation}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> {od.eventDate}
                    </p>
                    <p>
                      <span className="font-semibold">Description:</span>{' '}
                      {od.eventDescription}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(od.id)}
                      disabled={actionLoading === od.id}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {actionLoading === od.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(od.id)}
                      disabled={actionLoading === od.id}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}