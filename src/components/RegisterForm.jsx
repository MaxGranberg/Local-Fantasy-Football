import React, { useState } from 'react'
import PropTypes from 'prop-types'

function RegisterForm({ onBackToLogin, setGlobalFlashMessage }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [flashMessage, setFlashMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if passwords match
    if (password !== confirmPassword) {
      setFlashMessage('Passwords do not match.')
      return
    }

    if (password.length < 10) {
      setFlashMessage('Password needs to be 10 characters or more.')
      return
    }

    if (username.length < 3) {
      setFlashMessage('Username needs to be 3 characters or more')
      return
    }

    if (/^\d/.test(username)) {
      setFlashMessage('Username cant have a number as the first character')
      return
    }

    try {
      const response = await fetch('https://fflapi-a68806964222.herokuapp.com/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, }),
      })

      if (!response.ok) {
        // Handle registration error, error most likely to be not a unique username.
        // My custom errors from server is not being sent after deploying on Heroku.
        setFlashMessage('Registration failed. Try another username.')
        return
      }

      // Registration was successful, navigate back to login form
      onBackToLogin()
      setGlobalFlashMessage('Registration successful, you can now login!')
    } catch (error) {
      // Handle request error
      setFlashMessage('An error occurred. Please try again later.')
    }
  }

  return (
    <form className="max-w-md mx-auto mt-10 px-8 py-6 bg-white shadow-lg rounded-lg" onSubmit={handleSubmit}>
      {flashMessage && <div className="flash-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{flashMessage}</div>}
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Register
        </button>
        <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={onBackToLogin}>
          Back to Login
        </button>
      </div>
    </form>
  )
}

RegisterForm.propTypes = {
  onBackToLogin: PropTypes.func.isRequired,
  setGlobalFlashMessage: PropTypes.func.isRequired,
}

export default RegisterForm
