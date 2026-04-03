import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data);
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axiosInstance.put(
          `/api/auth/users/${editingUser._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axiosInstance.post('/api/auth/register', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', 
        password: '', role: 'student' });
      fetchUsers();
    } catch (error) {
      setError('Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axiosInstance.delete(`/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      setError('Failed to delete user');
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

  const roleColor = (role) => {
    if (role === 'admin') return '#FF6584';
    if (role === 'faculty') return '#6C63FF';
    return '#43D9A2';
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
        }}>Manage Users</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingUser(null);
            setFormData({ name: '', email: '', 
              password: '', role: 'student' });
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
        >+ Add User</button>
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
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ 
                ...formData, name: e.target.value 
              })}
              required
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ 
                ...formData, email: e.target.value 
              })}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder={editingUser ? 
                "New password (leave blank to keep)" : 
                "Password"}
              value={formData.password}
              onChange={(e) => setFormData({ 
                ...formData, password: e.target.value 
              })}
              required={!editingUser}
              style={inputStyle}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ 
                ...formData, role: e.target.value 
              })}
              style={inputStyle}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
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
                {editingUser ? 'Save Changes' : 'Add User'}
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

      {/* Users list */}
      {loading && (
        <p style={{ color: '#9898A8' }}>Loading users...</p>
      )}

      {users.map((user) => (
        <div key={user._id} style={{
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
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px'
            }}>
              <span style={{
                color: '#EEEEF2',
                fontWeight: '500',
                fontSize: '15px'
              }}>{user.name}</span>
              <span style={{
                background: `rgba(${
                  user.role === 'admin' ? '255,101,132' :
                  user.role === 'faculty' ? '108,99,255' :
                  '67,217,162'
                },0.15)`,
                color: roleColor(user.role),
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '11px'
              }}>{user.role}</span>
            </div>
            <div style={{
              color: '#9898A8',
              fontSize: '13px'
            }}>{user.email}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleEdit(user)}
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
              onClick={() => handleDelete(user._id)}
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
      ))}
    </div>
  );
};

export default AdminUsers;