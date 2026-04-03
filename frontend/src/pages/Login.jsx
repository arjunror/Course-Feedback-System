import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post(
        '/api/auth/login', 
        formData
      );
      // Save user and token
      login(response.data, response.data.token);
      
      // Redirect based on role
      const role = response.data.role;
      if (role === 'admin') {
        navigate('/admin/users');
      } else if (role === 'faculty') {
        navigate('/analytics');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0F13',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#16161C',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Logo */}
        <h1 style={{
          color: '#6C63FF',
          fontSize: '28px',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '8px'
        }}>CFS</h1>
        <p style={{
          color: '#9898A8',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '14px'
        }}>Course Feedback System</p>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(255,101,132,0.1)',
            border: '1px solid rgba(255,101,132,0.3)',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '16px',
            color: '#FF6584',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#9898A8',
              fontSize: '13px',
              marginBottom: '6px'
            }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ 
                ...formData, 
                email: e.target.value 
              })}
              required
              style={{
                width: '100%',
                background: '#0F0F13',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px',
                color: '#EEEEF2',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#9898A8',
              fontSize: '13px',
              marginBottom: '6px'
            }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ 
                ...formData, 
                password: e.target.value 
              })}
              required
              style={{
                width: '100%',
                background: '#0F0F13',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px',
                color: '#EEEEF2',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#6C63FF',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Register link */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#9898A8',
          fontSize: '14px'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6C63FF' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;