import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = {
    color: '#9898A8',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '6px 12px',
    borderRadius: '8px'
  };

  return (
    <nav style={{
      background: '#16161C',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{
        color: '#6C63FF',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: '600'
      }}>CFS</Link>

      {/* Navigation links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <>
            {/* Student links */}
            {user.role === 'student' && (
              <>
                <Link to="/dashboard" style={linkStyle}>
                  Dashboard
                </Link>
                <Link to="/courses" style={linkStyle}>
                  Courses
                </Link>
                <Link to="/feedback/submit" style={linkStyle}>
                  Submit Feedback
                </Link>
                <Link to="/feedback" style={linkStyle}>
                  My Feedback
                </Link>
              </>
            )}

            {/* Faculty links */}
            {user.role === 'faculty' && (
              <>
                <Link to="/dashboard" style={linkStyle}>
                  Dashboard
                </Link>
                <Link to="/courses" style={linkStyle}>
                  My Courses
                </Link>
                <Link to="/analytics" style={linkStyle}>
                  Analytics
                </Link>
              </>
            )}

            {/* Admin links */}
            {user.role === 'admin' && (
              <>
                <Link to="/dashboard" style={linkStyle}>
                  Dashboard
                </Link>
                <Link to="/admin/users" style={linkStyle}>
                  Users
                </Link>
                <Link to="/admin/courses" style={linkStyle}>
                  Courses
                </Link>
                <Link to="/admin/enrollments" style={linkStyle}>
                  Enrollments
                </Link>
                <Link to="/analytics" style={linkStyle}>
                  Analytics
                </Link>
              </>
            )}

            {/* User info + logout */}
            <span style={{
              color: '#9898A8',
              fontSize: '13px',
              marginLeft: '8px'
            }}>
              {user.name}
            </span>
            <span style={{
              background: 'rgba(108,99,255,0.15)',
              color: '#6C63FF',
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '11px'
            }}>{user.role}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,101,132,0.12)',
                color: '#FF6584',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                marginLeft: '8px'
              }}
            >Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{
              background: '#6C63FF',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '14px',
              padding: '6px 14px',
              borderRadius: '8px'
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;