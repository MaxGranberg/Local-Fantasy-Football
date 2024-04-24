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

   useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');
    setIsAuthenticated(!!token);
    setUserId(storedUserId);
  }, []);

  const login = (token, userId) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserId(null);
  };

  /**  Need to add logout to api?
  const logout = async () => {
    const response = await fetch('https://api/v1/logout', {
      method: 'POST',
      credentials: 'include', // Make sure to include credentials in the request
    })

    if (response.ok) {
      setIsAuthenticated(false)
      window.location.reload()
    }
  }
 */

  const value = useMemo(() => ({
    isAuthenticated,
    userId,
    login,
    logout,
  }), [isAuthenticated, userId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthContext
