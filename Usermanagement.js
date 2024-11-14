import React, { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    const [loggedInUsers, setLoggedInUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5001/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers(); // Load users when the component mounts
    }, []);

    const handleAddOrUpdateUser = async () => {
        if (!username || !password) {
            alert("Please fill in both fields.");
            return;
        }

        const user = { username, password };

        if (editingUserId) {
            // Update existing user
            await fetch(`http://localhost:5001/users/${editingUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
        } else {
            // Add new user
            await fetch('http://localhost:5001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
        }

        fetchUsers(); // Refresh the user list after adding/updating
        resetFields();
    };

    const handleEditUser = (id) => {
        const user = users.find(u => u.id === id);
        setUsername(user.username);
        setPassword(user.password);
        setEditingUserId(id);
    };

    const handleDeleteUser = async (id) => {
        await fetch(`http://localhost:5001/users/${id}`, {
            method: 'DELETE',
        });
        fetchUsers(); // Refresh user list after deletion
    };

    const resetFields = () => {
        setUsername('');
        setPassword('');
        setEditingUserId(null);
    };

    const handleLogin = async (username, password) => {
        const user = users.find(u => u.username === username);
        if (user && user.password === password) {
            setLoggedInUsers(prev => [...prev, user]); // Save the user object
            alert(`${user.username} logged in successfully!`);
        } else {
            alert('Invalid username or password');
        }
    };

    const logoutUser = (username) => {
        setLoggedInUsers(prev => prev.filter(u => u.username !== username));
        alert(`${username} logged out`);
    };

    return (
        <div className="user-management-container">
            <h3>{editingUserId ? 'Update User' : 'Add User'}</h3>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="input-field"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field"
            />
            <button onClick={handleAddOrUpdateUser} className="action-button">
                {editingUserId ? 'Update User' : 'Add User'}
            </button>

            <h3>Users</h3>
            <div className="user-list">
                {users.length === 0 ? (
                    <p>No users available. Please add a user.</p>
                ) : (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>
                                        <button onClick={() => handleEditUser(user.id)} className="edit-button">Edit</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="delete-button">Delete</button>
                                        <button onClick={() => {
                                            const passwordInput = prompt(`Enter password for ${user.username}:`);
                                            if (passwordInput) {
                                                handleLogin(user.username, passwordInput);
                                            }
                                        }} className="login-button">Login</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <h3>Logged In Users</h3>
            <ul>
                {loggedInUsers.length === 0 ? (
                    <p>No users logged in.</p>
                ) : (
                    loggedInUsers.map((user, index) => (
                        <li key={index}>
                            {user.username} <button onClick={() => logoutUser(user.username)}>Logout</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default UserManagement;