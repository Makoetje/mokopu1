import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Auth from './AuthSection'; 
import Dashboard from './Dashboard'; 
import Inventory from './Inventory'; 
import NavSection from './NavSection'; 
import Usermanagement from './Usermanagement'; 
import Header from './Header'; 
import './App.css';

const App = () => {
    const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
    const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || []);
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')) || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser); 
    const navigate = useNavigate(); 

    useEffect(() => {
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('products', JSON.stringify(products));
    }, [users, products]);

    const handleLogout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
        sessionStorage.removeItem('currentUser');
        navigate('/auth');
    };

    const handleLogin = (user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/dashboard'); // Navigate to the dashboard after login
    };

    return (
        <div className="app-container">
            <Header currentUser={currentUser} onLogout={handleLogout} />
                
            {/* Render NavSection only if the user is logged in */}
            {isLoggedIn && <NavSection onLogout={handleLogout} />}

            <main>
                <Routes>
                    <Route path="/auth" element={!isLoggedIn ? (
                        <Auth 
                            users={users} 
                            setUsers={setUsers} 
                            setCurrentUser={handleLogin} 
                            setIsLoggedIn={setIsLoggedIn} 
                        />
                    ) : (
                        <Navigate to="/dashboard" replace />
                    )} />
                    
                    <Route path="/dashboard" element={isLoggedIn ? (
                        <Dashboard 
                            products={products} 
                            totalProducts={products.length} 
                            totalQuantity={products.reduce((total, product) => total + product.quantity, 0)} 
                            totalValue={products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)} 
                        />
                    ) : (
                        <Navigate to="/auth" replace />
                    )} />
                    
                    <Route path="/inventory" element={isLoggedIn ? (
                        <Inventory 
                            products={products} 
                            setProducts={setProducts} 
                        />
                    ) : (
                        <Navigate to="/auth" replace />
                    )} />

                    <Route path="/usermanagement" element={isLoggedIn ? (
                        <Usermanagement 
                            users={users} 
                            setUsers={setUsers} 
                            currentUser={currentUser} 
                            setCurrentUser={setCurrentUser} 
                        />
                    ) : (
                        <Navigate to="/auth" replace />
                    )} />

                    <Route path="/" element={isLoggedIn ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <Navigate to="/auth" replace />
                    )} />
                </Routes>
            </main>
        </div>
    );
};

// Wrap App component with Router in the main entry point (e.g., index.js)
const MainApp = () => (
    <Router>
        <App />
    </Router>
);

export default MainApp;
