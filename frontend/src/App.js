import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackList from './pages/FeedbackList';
import Analytics from './pages/Analytics';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminEnrollments from './pages/AdminEnrollments';

// Protected route component
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All roles */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />

        {/* Student only */}
        <Route path="/feedback/submit" element={
          <ProtectedRoute roles={['student']}>
            <FeedbackForm />
          </ProtectedRoute>
        } />

        <Route path="/feedback" element={
          <ProtectedRoute roles={['student']}>
            <FeedbackList />
          </ProtectedRoute>
        } />

        {/* Faculty only */}
        <Route path="/analytics" element={
          <ProtectedRoute roles={['faculty', 'admin']}>
            <Analytics />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />

        <Route path="/admin/courses" element={
          <ProtectedRoute roles={['admin']}>
            <AdminCourses />
          </ProtectedRoute>
        } />

        <Route path="/admin/enrollments" element={
          <ProtectedRoute roles={['admin']}>
            <AdminEnrollments />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;