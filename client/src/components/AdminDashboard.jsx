import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import axios from 'axios';

export default function AdminDashboard() {
  const { logout } = useAuth();

  // State to store the list of users and the new user form data
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    f_name: '',
    f_email: '',
    f_mobile: '',
    f_designation: '',
    f_gender: '',
    f_course: '',
    
  });

  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/users', {
          method: 'GET',
          credentials: 'include',  // Make sure cookies are sent
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          throw new Error('Unauthorized');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle form field changes for new user registration
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Handle new user form submission (Create)
  const handleCreateUser = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/create/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      // Check if response status is not 2xx (success)
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error('Failed to create user');
      }
  
      const data = await response.json();
      setUsers([...users, data]); // Add the new user to the list
      setNewUser({
        f_name: '',
        f_email: '',
        f_mobile: '',
        f_designation: '',
        f_gender: '',
        f_course: '',
      }); // Reset the form
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  

  // Handle user delete (Delete)
  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/auth/user/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user._id !== id)); // Remove from list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle user edit (Update)
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.f_name,
      f_email: user.f_email,
      f_mobile: user.f_mobile,
      f_designation: user.f_designation,
      f_gender: user.f_gender,
      f_course: user.f_course,
    });
  };

  // Handle update of edited user
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/auth/user/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? { ...user, ...newUser } : user
        )
      );
      setNewUser({
        f_name: '',
        f_email: '',
        f_f_mobile: '',
        f_designation: '',
        f_gender: '',
        f_course: '',
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <h1 className="text-9xl">Admin Dashboard</h1>
      <button onClick={logout} className="ml-4 px-4 py-2 bg-red-500 text-white rounded">
        LogOut
      </button>

      {/* User Registration or Edit Form */}
      <div className="mt-8">
        <h2 className="text-2xl mb-4">{editingUser ? 'Edit User' : 'Register New User'}</h2>
        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
          <input
            type="text"
            name="f_name"
            value={newUser.f_name}
            onChange={handleInputChange}
            placeholder="Name"
            required
            className="p-2 mb-2 w-full"
          />
          <input
            type="f_email"
            name="f_email"
            value={newUser.f_email}
            onChange={handleInputChange}
            placeholder="f_email"
            required
            className="p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="f_mobile"
            value={newUser.f_mobile}
            onChange={handleInputChange}
            placeholder="f_mobile"
            required
            className="p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="f_designation"
            value={newUser.f_designation}
            onChange={handleInputChange}
            placeholder="f_designation"
            required
            className="p-2 mb-2 w-full"
          />
          <select
            name="f_gender"
            value={newUser.f_gender}
            onChange={handleInputChange}
            required
            className="p-2 mb-2 w-full"
          >
            <option value="">Select f_gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="f_course"
            value={newUser.f_course}
            onChange={handleInputChange}
            placeholder="f_course"
            required
            className="p-2 mb-2 w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {editingUser ? 'Update User' : 'Create User'}
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="mt-8">
        <h2 className="text-2xl mb-4">User List</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">f_email</th>
              <th className="border p-2">f_mobile</th>
              <th className="border p-2">f_designation</th>
              <th className="border p-2">f_gender</th>
              <th className="border p-2">f_course</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="border p-2">{user._id}</td>
                  <td className="border p-2">{user.f_name}</td>
                  <td className="border p-2">{user.f_email}</td>
                  <td className="border p-2">{user.f_mobile}</td>
                  <td className="border p-2">{user.f_designation}</td>
                  <td className="border p-2">{user.f_gender}</td>
                  <td className="border p-2">{user.f_course}</td>
                  <td className="border p-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border p-2 text-center">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
