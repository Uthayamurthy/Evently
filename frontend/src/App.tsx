import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StudentApply from './pages/StudentApply';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyRecords from './pages/FacultyRecords';
import { FacultyLayout } from './components/layout/FacultyLayout';
import { StudentLayout } from './components/layout/StudentLayout';
import { TooltipProvider } from '@/components/ui/tooltip';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { token, role } = useAuth();
  const isAuthenticated = Boolean(token && role);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { token, role } = useAuth();
  const isAuthenticated = Boolean(token && role);
  const defaultRoute = role === 'FACULTY' ? '/faculty/dashboard' : '/student/dashboard';

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to={defaultRoute} replace /> : <Login />}
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/apply"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentLayout>
              <StudentApply />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRole="FACULTY">
            <FacultyLayout>
              <FacultyDashboard />
            </FacultyLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/records"
        element={
          <ProtectedRoute allowedRole="FACULTY">
            <FacultyLayout>
              <FacultyRecords />
            </FacultyLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
