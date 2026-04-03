import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const FeedbackList = () => {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axiosInstance.get('/api/feedback', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(response.data.data);
    } catch (error) {
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await axiosInstance.delete(`/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(feedbacks.filter(f => f._id !== id));
    } catch (error) {
      setError('Failed to delete feedback');
    }
  };

  const handleEdit = (feedback) => {
    setEditingId(feedback._id);
    setEditData({
      rating: feedback.rating,
      comment: feedback.comment
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axiosInstance.put(`/api/feedback/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchFeedback();
    } catch (error) {
      setError('Failed to update feedback');
    }
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
      }}>My Feedback</h1>

      {error && (
        <p style={{ color: '#FF6584', marginBottom: '16px' }}>{error}</p>
      )}

      {loading && (
        <p style={{ color: '#9898A8' }}>Loading...</p>
      )}

      {!loading && feedbacks.length === 0 && (
        <p style={{ color: '#9898A8' }}>
          No feedback submitted yet.
        </p>
      )}

      {feedbacks.map((feedback) => (
        <div key={feedback._id} style={{
          background: '#16161C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          {editingId === feedback._id ? (
            // Edit mode
            <div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  color: '#9898A8',
                  fontSize: '13px',
                  display: 'block',
                  marginBottom: '6px'
                }}>Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setEditData({ 
                        ...editData, rating: star 
                      })}
                      style={{
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: star <= editData.rating ? 
                          '#F5A623' : '#3A3A4A'
                      }}
                    >★</span>
                  ))}
                </div>
              </div>
              <textarea
                value={editData.comment}
                onChange={(e) => setEditData({ 
                  ...editData, comment: e.target.value 
                })}
                rows={3}
                style={{
                  width: '100%',
                  background: '#0F0F13',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#EEEEF2',
                  fontSize: '14px',
                  marginBottom: '12px',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleUpdate(feedback._id)}
                  style={{
                    background: '#43D9A2',
                    color: '#0F0F13',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >Save</button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{
                    background: 'transparent',
                    color: '#9898A8',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >Cancel</button>
              </div>
            </div>
          ) : (
            // View mode
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{
                  color: '#EEEEF2',
                  fontWeight: '500',
                  fontSize: '15px'
                }}>
                  {feedback.course?.title || 'Course'}
                </span>
                <span style={{
                  background: 'rgba(108,99,255,0.15)',
                  color: '#6C63FF',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {feedback.course?.code}
                </span>
              </div>
              <Stars rating={feedback.rating} />
              <p style={{
                color: '#9898A8',
                fontSize: '14px',
                margin: '10px 0'
              }}>
                {feedback.comment}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(feedback)}
                  style={{
                    background: 'rgba(108,99,255,0.15)',
                    color: '#6C63FF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >Edit</button>
                <button
                  onClick={() => handleDelete(feedback._id)}
                  style={{
                    background: 'rgba(255,101,132,0.12)',
                    color: '#FF6584',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;