import React, { useState } from 'react';

const Auth = ({ users, setUsers, setCurrentUser, setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isExistingUser, setIsExistingUser] = useState(false);

    const handleLogin = async () => {
        const response = await fetch('http://localhost:5001/users'); // Adjust the URL accordingly
        const usersData = await response.json();
        const existingUser = usersData.find(user => user.username === username);

        if (existingUser && existingUser.password === password) {
            setCurrentUser(existingUser);
            setIsLoggedIn(true);
            sessionStorage.setItem('currentUser', JSON.stringify(existingUser));
            setFeedback("Login successful! Welcome back.");
        } else {
            setFeedback("Incorrect username or password. Please try again.");
        }
    };

    const handleSignUp = async () => {
        const newUser = { username, password };
        
        const response = await fetch('http://localhost:5001/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        
        if (response.ok) {
            const result = await response.json();
            setUsers((prevUsers) => [...prevUsers, result]);
            setFeedback("Sign-up successful! You can now log in.");
            setUsername('');
            setPassword('');
            setIsExistingUser(true);
        } else {
            setFeedback("Sign-up failed. Please try again.");
        }
    };

    const handleAuth = (event) => {
        event.preventDefault();

        if (isExistingUser) {
            handleLogin();
        } else {
            handleSignUp();
        }
    };

    return (
        <div>
            <h2>{isExistingUser ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleAuth}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setFeedback('');
                    }}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setFeedback('');
                    }}
                    placeholder="Password"
                    required
                />
                <button type="submit">{isExistingUser ? 'Login' : 'Sign Up'}</button>
            </form>
            {feedback && <div style={{ color: 'red', marginTop: '10px' }}>{feedback}</div>}

            {/* Toggle between sign-up and login */}
            {!isExistingUser ? (
                <p>Already have an account? 
                    <button onClick={() => setIsExistingUser(true)}>Log in here</button>
                </p>
            ) : (
                <p>Don't have an account? 
                    <button onClick={() => setIsExistingUser(false)}>Sign up here</button>
                </p>
            )}
        </div>
    );
};

export default Auth;