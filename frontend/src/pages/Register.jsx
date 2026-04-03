import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputStyle = {
    width: '100%',
    background: '#0F0F13',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px',
    color: '#EEEEF2',
    fontSize: '14px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    color: '#9898A8',
    fontSize: '13px',
    marginBottom: '6px'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/api/auth/register', formData);
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
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
        }}>Create your account</p>

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
            <label style={labelStyle}>Full name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ 
                ...formData, name: e.target.value 
              })}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ 
                ...formData, email: e.target.value 
              })}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ 
                ...formData, password: e.target.value 
              })}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ 
                ...formData, role: e.target.value 
              })}
              style={{
                ...inputStyle,
                cursor: 'pointer'
              }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#43D9A2',
              color: '#0F0F13',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Login link */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#9898A8',
          fontSize: '14px'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6C63FF' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;