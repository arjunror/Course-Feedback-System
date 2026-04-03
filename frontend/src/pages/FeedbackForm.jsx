import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const FeedbackForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    course: '',
    rating: 5,
    comment: '',
    categories: {
      contentQuality: 5,
      teachingClarity: 5,
      workload: 5
    },
    isAnonymous: false
  });

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

  const inputStyle = {
    width: '100%',
    background: '#0F0F13',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px',
    color: '#EEEEF2',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '16px'
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
      await axiosInstance.post('/api/feedback', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Feedback submitted successfully!');
      setTimeout(() => navigate('/feedback'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 
        'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  // Star rating component
  const StarRating = ({ value, onChange }) => (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: star <= value ? '#F5A623' : '#3A3A4A'
          }}
        >
          ★
        </span>
      ))}
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
      }}>Submit Feedback</h1>

      {success && (
        <div style={{
          background: 'rgba(67,217,162,0.1)',
          border: '1px solid rgba(67,217,162,0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#43D9A2',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(255,101,132,0.1)',
          border: '1px solid rgba(255,101,132,0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#FF6584',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: '#16161C',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '24px'
      }}>
        {/* Course selection */}
        <div>
          <label style={labelStyle}>Select Course</label>
          <select
            value={formData.course}
            onChange={(e) => setFormData({ 
              ...formData, course: e.target.value 
            })}
            required
            style={inputStyle}
          >
            <option value="">Choose a course...</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Overall rating */}
        <div>
          <label style={labelStyle}>Overall Rating</label>
          <StarRating
            value={formData.rating}
            onChange={(val) => setFormData({ 
              ...formData, rating: val 
            })}
          />
        </div>

        {/* Category ratings */}
        <div style={{
          background: '#0F0F13',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <label style={{ ...labelStyle, marginBottom: '12px' }}>
            Category Ratings
          </label>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Content Quality</label>
            <StarRating
              value={formData.categories.contentQuality}
              onChange={(val) => setFormData({
                ...formData,
                categories: { 
                  ...formData.categories, 
                  contentQuality: val 
                }
              })}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Teaching Clarity</label>
            <StarRating
              value={formData.categories.teachingClarity}
              onChange={(val) => setFormData({
                ...formData,
                categories: { 
                  ...formData.categories, 
                  teachingClarity: val 
                }
              })}
            />
          </div>

          <div>
            <label style={labelStyle}>Workload</label>
            <StarRating
              value={formData.categories.workload}
              onChange={(val) => setFormData({
                ...formData,
                categories: { 
                  ...formData.categories, 
                  workload: val 
                }
              })}
            />
          </div>
        </div>

        {/* Comment */}
        <div>
          <label style={labelStyle}>Comment</label>
          <textarea
            placeholder="Share your thoughts about this course..."
            value={formData.comment}
            onChange={(e) => setFormData({ 
              ...formData, comment: e.target.value 
            })}
            required
            rows={4}
            style={{
              ...inputStyle,
              resize: 'vertical'
            }}
          />
        </div>

        {/* Anonymous toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.isAnonymous}
            onChange={(e) => setFormData({ 
              ...formData, isAnonymous: e.target.checked 
            })}
          />
          <label htmlFor="anonymous" style={{
            color: '#9898A8',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Submit anonymously
          </label>
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
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;