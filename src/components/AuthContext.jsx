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

   useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
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
    login,
    logout,
  }), [isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthContext
