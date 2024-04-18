import React, {
  useState, useEffect, useContext
} from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
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
      <div className="App">
        <h1>Welcome to My Fantasy Football Game</h1>
        {isAuthenticated && (
          <button type="button" className="logout-button" onClick={logout}>
            Logout
          </button>
        )}
      </div>
      {flashMessage && <div className="flash-message-success">{flashMessage}</div>}
      {isAuthenticated ? (
        <div className="">
          <p>Du är inloggad</p>
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
    </>
  )
}

export default App;
