import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminCourses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    semester: '',
    faculty: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchFaculty();
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

  const fetchFaculty = async () => {
    try {
      const response = await axiosInstance.get(
        '/api/auth/users?role=faculty',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFaculty(response.data.data);
    } catch (error) {
      console.error('Failed to load faculty');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axiosInstance.put(
          `/api/courses/${editingCourse._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axiosInstance.post('/api/courses', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setEditingCourse(null);
      setFormData({
        title: '', description: '',
        code: '', semester: '', faculty: ''
      });
      fetchCourses();
    } catch (error) {
      setError('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      code: course.code,
      semester: course.semester,
      faculty: course.faculty?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await axiosInstance.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(courses.filter(c => c._id !== id));
    } catch (error) {
      setError('Failed to delete course');
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
        }}>Manage Courses</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCourse(null);
            setFormData({
              title: '', description: '',
              code: '', semester: '', faculty: ''
            });
          }}
          style={{
            background: '#6C63FF',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >+ Add Course</button>
      </div>

      {error && (
        <p style={{ color: '#FF6584', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {/* Add/Edit Form */}
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
          }}>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Course title"
              value={formData.title}
              onChange={(e) => setFormData({
                ...formData, title: e.target.value
              })}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Course code (e.g. IFN636)"
              value={formData.code}
              onChange={(e) => setFormData({
                ...formData, code: e.target.value
              })}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Semester (e.g. Semester 1 2025)"
              value={formData.semester}
              onChange={(e) => setFormData({
                ...formData, semester: e.target.value
              })}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="Course description"
              value={formData.description}
              onChange={(e) => setFormData({
                ...formData, description: e.target.value
              })}
              required
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <select
              value={formData.faculty}
              onChange={(e) => setFormData({
                ...formData, faculty: e.target.value
              })}
              required
              style={inputStyle}
            >
              <option value="">Select faculty...</option>
              {faculty.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
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
              }}>
                {editingCourse ? 'Save Changes' : 'Add Course'}
              </button>
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

      {/* Courses list */}
      {loading && (
        <p style={{ color: '#9898A8' }}>Loading courses...</p>
      )}

      {!loading && courses.length === 0 && (
        <p style={{ color: '#9898A8' }}>No courses found.</p>
      )}

      {courses.map((course) => (
        <div key={course._id} style={{
          background: '#16161C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '12px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '4px'
              }}>
                <span style={{
                  color: '#EEEEF2',
                  fontWeight: '500',
                  fontSize: '15px'
                }}>{course.title}</span>
                <span style={{
                  background: 'rgba(108,99,255,0.15)',
                  color: '#6C63FF',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '11px'
                }}>{course.code}</span>
              </div>
              <div style={{
                color: '#9898A8',
                fontSize: '13px',
                marginBottom: '4px'
              }}>
                {course.semester}
              </div>
              <div style={{
                color: '#9898A8',
                fontSize: '13px'
              }}>
                Faculty: {course.faculty?.name || 'Not assigned'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleEdit(course)}
                style={{
                  background: 'rgba(108,99,255,0.15)',
                  color: '#6C63FF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >Edit</button>
              <button
                onClick={() => handleDelete(course._id)}
                style={{
                  background: 'rgba(255,101,132,0.12)',
                  color: '#FF6584',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >Delete</button>
            </div>
          </div>
          <p style={{
            color: '#9898A8',
            fontSize: '13px'
          }}>{course.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminCourses;