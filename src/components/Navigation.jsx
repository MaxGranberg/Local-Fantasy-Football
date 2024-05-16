import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from './AuthContext';

const Navigation = () => {
  const { role } = useContext(AuthContext);

    return (
        <nav className="bg-blue-500 text-white shadow-md">
          <ul className="flex justify-around p-4">
            <NavLink to="/" className="text-white hover:text-blue-300">Home</NavLink>
            <NavLink to="/myTeam" className="text-white hover:text-blue-300">My Team</NavLink>
            <NavLink to="/league" className="text-white hover:text-blue-300">League Standings</NavLink>
            <NavLink to="/fixtures" className="text-white hover:text-blue-300">Results & Fixtures</NavLink>
            {role === 'admin' && <NavLink to="/admin" className="text-white hover:text-blue-300">Admin Dashboard</NavLink>}
          </ul>
        </nav>
    );
};

export default Navigation;