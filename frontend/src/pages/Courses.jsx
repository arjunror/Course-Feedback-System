import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Courses = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.data);
    } catch (error) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0F13',
      padding: '24px 16px'
    }}>
      <h1 style={{
        color: '#EEEEF2',
        fontSize: '22px',
        fontWeight: '600',
        marginBottom: '20px'
      }}>
        {user?.role === 'student' ? 'My Courses' : 'Assigned Courses'}
      </h1>

      {loading && (
        <p style={{ color: '#9898A8' }}>Loading courses...</p>
      )}

      {error && (
        <p style={{ color: '#FF6584' }}>{error}</p>
      )}

      {!loading && courses.length === 0 && (
        <p style={{ color: '#9898A8' }}>No courses found.</p>
      )}

      {courses.map((course) => (
        <div key={course._id} style={{
          background: '#16161C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px'
          }}>
            <h2 style={{
              color: '#EEEEF2',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              {course.title}
            </h2>
            <span style={{
              background: 'rgba(108,99,255,0.15)',
              color: '#6C63FF',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '12px'
            }}>
              {course.code}
            </span>
          </div>
          <p style={{
            color: '#9898A8',
            fontSize: '13px',
            marginBottom: '8px'
          }}>
            {course.description}
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            color: '#9898A8'
          }}>
            <span>Semester: {course.semester}</span>
            <span>Faculty: {course.faculty?.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Courses;