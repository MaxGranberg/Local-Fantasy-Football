import React, {
  useState, useEffect, useContext
} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './components/Home';
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import MyTeam from './components/MyTeam'
import League from './components/League'
import AuthContext from './components/AuthContext'

function App() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [flashMessage, setFlashMessage] = useState(null)

  const { isAuthenticated, setIsAuthenticated, logout } = useContext(AuthContext)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFlashMessage(null)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [flashMessage])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleRegister = () => {
    setIsRegistered(true)
  }

  const switchToLogin = () => {
    setIsRegistered(false)
  }

  return (
    <>
    <Router>
      <div className="header-container">
        <Header />
        {isAuthenticated && (
          <button type="button" className="logout-button" onClick={logout}>
            Logout
          </button>
        )}
      </div>
      {flashMessage && <div className="flash-message-success">{flashMessage}</div>}
      {isAuthenticated ? (
        <div>
        <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/myTeam" element={<MyTeam />} />
            <Route path="/league" element={<League />} />
          </Routes>
        </div>
      ) : (
        <div className="login-container">
          {!isRegistered ? (
            <LoginForm
              onLogin={handleLogin}
              onRegister={handleRegister}
              setGlobalFlashMessage={setFlashMessage}
            />
          ) : (
            <RegisterForm
              onRegister={switchToLogin}
              onBackToLogin={switchToLogin}
              setGlobalFlashMessage={setFlashMessage}
            />
          )}
        </div>
      )}
      </Router>
    </>
  )
}

export default App;
