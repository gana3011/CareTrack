'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, SYNC_USER, UPDATE_USER, DELETE_USER } from '@/lib/graphql-operations';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    role: 'worker'
  });

  // Query to get all users
  const { data, loading, error, refetch } = useQuery(GET_USERS);

  // Mutations
  const [syncUser] = useMutation(SYNC_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await syncUser({
        variables: {
          userId: formData.userId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        },
      });
      setFormData({ userId: '', name: '', email: '', role: 'worker' });
      alert('User synced successfully!');
    } catch (error) {
      console.error('Error syncing user:', error);
      alert('Error syncing user');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({ variables: { id } });
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management (GraphQL)</h2>
      
      {/* Form to add/sync users */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Sync User</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>User ID:</label>
          <input
            type="text"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Role:</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="worker">Worker</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
          Sync User
        </button>
      </form>

      {/* Display users */}
      <h3>Users List</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        {data?.users?.map((user) => (
          <div key={user.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>User ID:</strong> {user.userId}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
            <button
              onClick={() => handleDelete(user.id)}
              style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
