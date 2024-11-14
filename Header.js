import React from 'react';

const Header = ({ currentUser }) => {
    return (
        <header className="header">
            <div className="marquee">
                <h1>WINGS CAFE INVENTORY </h1>
            </div>
            {currentUser && (
                <div className="welcome-message">
                    <h2>Welcome, {currentUser.username}!</h2>
                </div>
            )}
            {/* Removed logout button from the header */}
        </header>
    );
};

export default Header;