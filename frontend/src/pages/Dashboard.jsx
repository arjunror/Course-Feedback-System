import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cardStyle = {
    background: '#16161C',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '24px',
    cursor: 'pointer',
    marginBottom: '16px'
  };

  const titleStyle = {
    color: '#EEEEF2',
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '6px'
  };

  const subStyle = {
    color: '#9898A8',
    fontSize: '13px'
  };

  // Student dashboard
  const StudentDashboard = () => (
    <>
      <div style={cardStyle} onClick={() => navigate('/courses')}>
        <div style={titleStyle}>My Courses</div>
        <div style={subStyle}>View your enrolled courses</div>
      </div>
      <div style={cardStyle} onClick={() => navigate('/feedback/submit')}>
        <div style={titleStyle}>Submit Feedback</div>
        <div style={subStyle}>Give feedback for your courses</div>
      </div>
      <div style={cardStyle} onClick={() => navigate('/feedback')}>
        <div style={titleStyle}>My Feedback</div>
        <div style={subStyle}>View and edit your submitted feedback</div>
      </div>
    </>
  );

  // Faculty dashboard
  const FacultyDashboard = () => (
    <>
      <div style={cardStyle} onClick={() => navigate('/courses')}>
        <div style={titleStyle}>My Courses</div>
        <div style={subStyle}>View your assigned courses</div>
      </div>
      <div style={cardStyle} onClick={() => navigate('/analytics')}>
        <div style={titleStyle}>Analytics</div>
        <div style={subStyle}>View feedback analytics for your courses</div>
      </div>
    </>
  );

  // Admin dashboard
  const AdminDashboard = () => (
    <>
      <div style={cardStyle} onClick={() => navigate('/admin/users')}>
        <div style={titleStyle}>Manage Users</div>
        <div style={subStyle}>Add, edit and delete users</div>
      </div>
      <div style={cardStyle} onClick={() => navigate('/admin/courses')}>
        <div style={titleStyle}>Manage Courses</div>
        <div style={subStyle}>Add, edit and delete courses</div>
      </div>
      <div style={cardStyle} onClick={() => navigate('/admin/enrollments')}>
        <div style={titleStyle}>Manage Enrollments</div>
        <div style={subStyle}>Assign students to courses</div>
      </div>
      <div style={cardStyle} onClick={() => navigate('/analytics')}>
        <div style={titleStyle}>View Analytics</div>
        <div style={subStyle}>View all course feedback analytics</div>
      </div>
    </>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0F13',
      padding: '24px 16px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          color: '#EEEEF2',
          fontSize: '22px',
          fontWeight: '600',
          marginBottom: '4px'
        }}>
          Welcome, {user?.name}!
        </h1>
        <p style={{ color: '#9898A8', fontSize: '14px' }}>
          <span style={{
            background: 'rgba(108,99,255,0.15)',
            color: '#6C63FF',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '12px'
          }}>
            {user?.role}
          </span>
        </p>
      </div>

      {/* Role based dashboard */}
      {user?.role === 'student' && <StudentDashboard />}
      {user?.role === 'faculty' && <FacultyDashboard />}
      {user?.role === 'admin' && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;