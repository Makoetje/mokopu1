import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavSection = ({ onLogout }) => {
    const location = useLocation(); // Hook to get the current route location

    return (
        <nav>
            <div className="link-container">
                <ul>
                    <li>
                        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/inventory" className={location.pathname === '/inventory' ? 'active' : ''}>Product Management</Link>
                    </li>
                    <li>
                        <Link to="/userManagement" className={location.pathname === '/userManagement' ? 'active' : ''}>User Management</Link>
                    </li>
                    <li>
                        <button onClick={onLogout} className="logout-button">Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavSection;