import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function TestAuth() {
  const { user, login, logout, loading } = useAuth()
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    try {
      setError(null)
      await login()
    } catch (err) {
      setError(err.message)
      console.error('Login error:', err)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Firebase Auth Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>User:</strong> {user ? user.displayName : 'Not logged in'}
      </div>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid red',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        {user ? (
          <div>
            <p>Welcome, {user.displayName}!</p>
            <p>Email: {user.email}</p>
            <img 
              src={user.photoURL} 
              alt="Profile" 
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            <br />
            <button onClick={logout} style={{ marginTop: '10px' }}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        )}
      </div>
      
      <div>
        <h3>Troubleshooting:</h3>
        <ul>
          <li>Check browser console for errors</li>
          <li>Ensure popups are allowed</li>
          <li>Verify Firebase project is active</li>
          <li>Check if localhost:3000 is in authorized domains</li>
        </ul>
      </div>
    </div>
  )
}
