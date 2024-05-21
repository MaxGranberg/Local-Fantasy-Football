import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from './AuthContext';

const Navigation = () => {
  const { role } = useContext(AuthContext);

  return (
    <nav className="bg-blue-500 text-white shadow-lg">
      <ul className="flex justify-around items-center p-4 space-x-4">
        <li>
          <NavLink 
            to="/" 
            exact
            className="text-white hover:text-yellow-300 transition duration-300 ease-in-out"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/myTeam" 
            className="text-white hover:text-yellow-300 transition duration-300 ease-in-out"
          >
            My Team
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/league" 
            className="text-white hover:text-yellow-300 transition duration-300 ease-in-out"
          >
            League Standings
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/fixtures" 
            className="text-white hover:text-yellow-300 transition duration-300 ease-in-out"
          >
            Results & Fixtures
          </NavLink>
        </li>
        {role === 'admin' && (
          <li>
            <NavLink 
              to="/admin" 
              className="text-white hover:text-yellow-300 transition duration-300 ease-in-out"
            >
              Admin Dashboard
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
