import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from './AuthContext'

function LoginForm({ onRegister, setGlobalFlashMessage }) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [flashMessage, setFlashMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })

      const data = await response.json();

      if (!response.ok) {
        // Handle authentication error
        setFlashMessage('Login failed. Please check your username and password.')
        return
      }

      login(data.access_token, data.id, data.role);
    } catch (error) {
      // Handle request error
      setFlashMessage('An error occurred. Please try again later.')
    }
  }

  return (
    <form className="login-form max-w-md mx-auto mt-10 px-8 py-6 bg-white shadow-lg rounded-lg border-4 border-double border-blue-500" onSubmit={handleSubmit}>
      {flashMessage && <div className="flash-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{flashMessage}</div>}
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Login
        </button>
        <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={onRegister}>
          Register
        </button>
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  onRegister: PropTypes.func.isRequired,
  setGlobalFlashMessage: PropTypes.func.isRequired,
}

export default LoginForm
