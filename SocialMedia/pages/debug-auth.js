import { onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth, googleProvider } from '../lib/firebase'

export default function DebugAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    // Check Firebase initialization
    setDebugInfo({
      firebaseApp: !!auth.app,
      authDomain: auth.app?.options.authDomain,
      projectId: auth.app?.options.projectId,
      apiKey: auth.app?.options.apiKey ? 'Present' : 'Missing',
      currentDomain: window.location.hostname,
      currentPort: window.location.port,
      currentProtocol: window.location.protocol,
    })

    // Listen to auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      console.log('Auth state changed:', user)
    })

    return unsubscribe
  }, [])

  const testGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting Google Sign-In...')
      console.log('Auth instance:', auth)
      console.log('Google provider:', googleProvider)
      
      const result = await signInWithPopup(auth, googleProvider)
      console.log('Sign-in successful:', result)
      
      setUser(result.user)
    } catch (error) {
      console.error('Detailed error:', error)
      setError({
        code: error.code,
        message: error.message,
        details: error.customData || {},
        stack: error.stack
      })
    } finally {
      setLoading(false)
    }
  }

  const testDirectAuth = () => {
    // Test if we can access Firebase auth directly
    try {
      console.log('Firebase Auth object:', auth)
      console.log('Auth current user:', auth.currentUser)
      console.log('Auth config:', auth.config)
      alert('Firebase Auth is accessible - check console for details')
    } catch (err) {
      console.error('Firebase Auth error:', err)
      alert('Firebase Auth is not accessible: ' + err.message)
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
        🔧 Firebase Authentication Debug Tool
      </h1>
      
      {/* User Status */}
      <div style={{ 
        backgroundColor: user ? '#d4edda' : '#f8d7da', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px',
        border: `1px solid ${user ? '#c3e6cb' : '#f5c6cb'}`
      }}>
        <h2>👤 Authentication Status</h2>
        <p><strong>User:</strong> {user ? `✅ ${user.displayName} (${user.email})` : '❌ Not authenticated'}</p>
        <p><strong>Loading:</strong> {loading ? '⏳ Yes' : '✅ No'}</p>
      </div>

      {/* Debug Information */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h2>🔍 Debug Information</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {Object.entries(debugInfo).map(([key, value]) => (
              <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}>{key}:</td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <h2>❌ Error Details</h2>
          <p><strong>Code:</strong> <code>{error.code}</code></p>
          <p><strong>Message:</strong> {error.message}</p>
          {error.details && (
            <details>
              <summary>Additional Details</summary>
              <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '3px' }}>
                {JSON.stringify(error.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <h2>🧪 Test Actions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={testGoogleSignIn}
            disabled={loading}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Signing in...' : '🔐 Test Google Sign-In'}
          </button>
          
          <button 
            onClick={testDirectAuth}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔍 Test Firebase Access
          </button>
          
          <button 
            onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
            style={{
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🚀 Open Firebase Console
          </button>
        </div>
      </div>

      {/* Troubleshooting Steps */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <h2>🛠️ Troubleshooting Steps</h2>
        <ol style={{ lineHeight: '1.6' }}>
          <li>
            <strong>Check Firebase Console:</strong>
            <ul>
              <li>Go to Authentication → Sign-in method</li>
              <li>Ensure Google provider is enabled</li>
              <li>Check authorized domains include: <code>localhost</code></li>
            </ul>
          </li>
          <li>
            <strong>Browser Settings:</strong>
            <ul>
              <li>Allow popups for localhost:3000</li>
              <li>Disable popup blockers</li>
              <li>Enable third-party cookies</li>
            </ul>
          </li>
          <li>
            <strong>Network Issues:</strong>
            <ul>
              <li>Check internet connection</li>
              <li>Disable VPN if active</li>
              <li>Try different browser</li>
            </ul>
          </li>
          <li>
            <strong>Console Errors:</strong>
            <ul>
              <li>Open browser developer tools (F12)</li>
              <li>Check console for Firebase errors</li>
              <li>Look for CORS or network errors</li>
            </ul>
          </li>
        </ol>
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/" style={{ 
          color: '#007bff', 
          textDecoration: 'none',
          marginRight: '20px'
        }}>← Back to Main App</a>
        <a href="/test-auth" style={{ 
          color: '#007bff', 
          textDecoration: 'none'
        }}>Simple Auth Test →</a>
      </div>
    </div>
  )
}
