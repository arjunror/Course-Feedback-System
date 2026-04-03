import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Analytics = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
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
    }
  };

  const fetchAnalytics = async (courseId) => {
    setLoading(true);
    try {
      const [analyticsRes, feedbackRes] = await Promise.all([
        axiosInstance.get(`/api/feedback/analytics/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axiosInstance.get('/api/feedback', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAnalytics(analyticsRes.data.data);
      setFeedback(feedbackRes.data.data);
    } catch (error) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    if (courseId) fetchAnalytics(courseId);
  };

  const Stars = ({ rating }) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{
          color: star <= rating ? '#F5A623' : '#3A3A4A',
          fontSize: '16px'
        }}>★</span>
      ))}
    </div>
  );

  const BarChart = ({ value, max = 5 }) => (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '4px',
      height: '8px',
      marginTop: '4px'
    }}>
      <div style={{
        background: '#6C63FF',
        borderRadius: '4px',
        height: '8px',
        width: `${(value / max) * 100}%`
      }} />
    </div>
  );

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
      }}>Course Analytics</h1>

      {/* Course selector */}
      <select
        value={selectedCourse}
        onChange={handleCourseChange}
        style={{
          width: '100%',
          background: '#16161C',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '12px',
          color: '#EEEEF2',
          fontSize: '14px',
          marginBottom: '20px',
          outline: 'none'
        }}
      >
        <option value="">Select a course...</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.code} - {course.title}
          </option>
        ))}
      </select>

      {error && (
        <p style={{ color: '#FF6584' }}>{error}</p>
      )}

      {loading && (
        <p style={{ color: '#9898A8' }}>Loading analytics...</p>
      )}

      {analytics && !loading && (
        <>
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: '#16161C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#F5A623',
                fontSize: '28px',
                fontWeight: '600'
              }}>
                {analytics.averageRating}
              </div>
              <div style={{
                color: '#9898A8',
                fontSize: '12px'
              }}>Average rating</div>
            </div>
            <div style={{
              background: '#16161C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#6C63FF',
                fontSize: '28px',
                fontWeight: '600'
              }}>
                {analytics.totalResponses}
              </div>
              <div style={{
                color: '#9898A8',
                fontSize: '12px'
              }}>Total responses</div>
            </div>
          </div>

          {/* Category averages */}
          {analytics.categories && 
           Object.keys(analytics.categories).length > 0 && (
            <div style={{
              background: '#16161C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h2 style={{
                color: '#EEEEF2',
                fontSize: '15px',
                fontWeight: '500',
                marginBottom: '16px'
              }}>Category Averages</h2>

              {Object.entries(analytics.categories).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      color: '#9898A8',
                      fontSize: '13px'
                    }}>
                      {key === 'contentQuality' ? 'Content Quality' :
                       key === 'teachingClarity' ? 'Teaching Clarity' :
                       'Workload'}
                    </span>
                    <span style={{
                      color: '#6C63FF',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>{value}/5</span>
                  </div>
                  <BarChart value={parseFloat(value)} />
                </div>
              ))}
            </div>
          )}

          {/* Recent feedback */}
          <h2 style={{
            color: '#EEEEF2',
            fontSize: '15px',
            fontWeight: '500',
            marginBottom: '12px'
          }}>Student Feedback</h2>

          {feedback.length === 0 && (
            <p style={{ color: '#9898A8' }}>No feedback yet.</p>
          )}

          {feedback.map((f) => (
            <div key={f._id} style={{
              background: '#16161C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <Stars rating={f.rating} />
                <span style={{
                  color: '#9898A8',
                  fontSize: '12px'
                }}>
                  {f.isAnonymous ? 'Anonymous' : f.student?.name}
                </span>
              </div>
              <p style={{
                color: '#9898A8',
                fontSize: '14px'
              }}>{f.comment}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Analytics;