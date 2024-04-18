import React, {
  useState, useEffect
} from 'react'
import RegisterForm from './components/RegisterForm'

function App() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [flashMessage, setFlashMessage] = useState(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFlashMessage(null)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [flashMessage])

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
    </div>
    {flashMessage && <div className="flash-message-success">{flashMessage}</div>}
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
  </>
)}

export default App;
