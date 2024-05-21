import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState('')

   useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setUserId(storedUserId);
    setRole(storedRole)
  }, []);

  const login = (token, userId, userRole) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', userRole);
    setIsAuthenticated(true);
    setUserId(userId);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserId(null);
    setRole('');
  };

  const value = useMemo(() => ({
    isAuthenticated,
    userId,
    role,
    login,
    logout,
  }), [isAuthenticated, userId, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthContext
