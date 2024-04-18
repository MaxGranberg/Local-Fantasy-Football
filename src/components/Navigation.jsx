import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav className="flex justify-center space-x-4">
            <NavLink to="/" className="text-white hover:text-blue-300">Home</NavLink>
            <NavLink to="/myTeam" className="text-white hover:text-blue-300">My Team</NavLink>
            <NavLink to="/league" className="text-white hover:text-blue-300">League</NavLink>
        </nav>
    );
};

export default Navigation;