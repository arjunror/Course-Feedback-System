import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminEnrollments = () => {
  const { token } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    course: ''
  });

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axiosInstance.get('/api/enrollments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(response.data.data);
    } catch (error) {
      setError('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get(
        '/api/auth/users?role=student',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data.data);
    } catch (error) {
      console.error('Failed to load students');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.data);
    } catch (error) {
      console.error('Failed to load courses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/enrollments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ student: '', course: '' });
      fetchEnrollments();
    } catch (error) {
      setError(error.response?.data?.message ||
        'Failed to create enrollment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this enrollment?')) return;
    try {
      await axiosInstance.delete(`/api/enrollments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(enrollments.filter(e => e._id !== id));
    } catch (error) {
      setError('Failed to remove enrollment');
    }
  };

  const inputStyle = {
    width: '100%',
    background: '#0F0F13',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px',
    color: '#EEEEF2',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '12px'
  };

  const statusColor = (status) => {
    if (status === 'active') return '#43D9A2';
    if (status === 'completed') return '#6C63FF';
    return '#FF6584';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0F13',
      padding: '24px 16px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{
          color: '#EEEEF2',
          fontSize: '22px',
          fontWeight: '600'
        }}>Manage Enrollments</h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: '#6C63FF',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >+ Enroll Student</button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255,101,132,0.1)',
          border: '1px solid rgba(255,101,132,0.3)',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '16px',
          color: '#FF6584',
          fontSize: '14px'
        }}>{error}</div>
      )}

      {/* Enrollment Form */}
      {showForm && (
        <div style={{
          background: '#16161C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h2 style={{
            color: '#EEEEF2',
            fontSize: '16px',
            marginBottom: '16px'
          }}>Enroll Student</h2>
          <form onSubmit={handleSubmit}>
            <select
              value={formData.student}
              onChange={(e) => setFormData({
                ...formData, student: e.target.value
              })}
              required
              style={inputStyle}
            >
              <option value="">Select student...</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} - {s.email}
                </option>
              ))}
            </select>
            <select
              value={formData.course}
              onChange={(e) => setFormData({
                ...formData, course: e.target.value
              })}
              required
              style={inputStyle}
            >
              <option value="">Select course...</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{
                background: '#43D9A2',
                color: '#0F0F13',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>Enroll</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: 'transparent',
                  color: '#9898A8',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Enrollments list */}
      {loading && (
        <p style={{ color: '#9898A8' }}>Loading enrollments...</p>
      )}

      {!loading && enrollments.length === 0 && (
        <p style={{ color: '#9898A8' }}>No enrollments found.</p>
      )}

      {enrollments.map((enrollment) => (
        <div key={enrollment._id} style={{
          background: '#16161C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              color: '#EEEEF2',
              fontWeight: '500',
              fontSize: '15px',
              marginBottom: '4px'
            }}>
              {enrollment.student?.name}
            </div>
            <div style={{
              color: '#9898A8',
              fontSize: '13px',
              marginBottom: '4px'
            }}>
              {enrollment.course?.code} - {enrollment.course?.title}
            </div>
            <span style={{
              background: `rgba(${
                enrollment.status === 'active' ? '67,217,162' :
                enrollment.status === 'completed' ? '108,99,255' :
                '255,101,132'
              },0.15)`,
              color: statusColor(enrollment.status),
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '11px'
            }}>{enrollment.status}</span>
          </div>
          <button
            onClick={() => handleDelete(enrollment._id)}
            style={{
              background: 'rgba(255,101,132,0.12)',
              color: '#FF6584',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >Remove</button>
        </div>
      ))}
    </div>
  );
};

export default AdminEnrollments;