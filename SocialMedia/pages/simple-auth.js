// Simple Firebase connection test without any React context
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC72xLjQ0EfQfEoG6clrSy5ttzd4Kck3vA",
  authDomain: "socialmedia-198d4.firebaseapp.com",
  projectId: "socialmedia-198d4",
  storageBucket: "socialmedia-198d4.firebasestorage.app",
  messagingSenderId: "695409960314",
  appId: "1:695409960314:web:12544d1d8d9145759922c3",
  measurementId: "G-2S915SKLX3"
}

export default function SimpleAuth() {
  const testBasicFirebase = () => {
    try {
      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)
      const provider = new GoogleAuthProvider()
      
      console.log('✅ Firebase initialized successfully')
      console.log('App:', app)
      console.log('Auth:', auth)
      console.log('Provider:', provider)
      
      alert('✅ Firebase initialization successful! Check console for details.')
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error)
      alert('❌ Firebase initialization failed: ' + error.message)
    }
  }

  const testGoogleAuth = async () => {
    try {
      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)
      const provider = new GoogleAuthProvider()
      
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      console.log('🔄 Starting Google authentication...')
      const result = await signInWithPopup(auth, provider)
      
      console.log('✅ Authentication successful!')
      console.log('User:', result.user)
      
      alert(`✅ Welcome ${result.user.displayName}! Authentication successful.`)
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      
      let errorMessage = 'Authentication failed: ' + error.message
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = '🚫 Popup was blocked. Please allow popups and try again.'
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = '❌ Authentication cancelled by user.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = '🌐 Network error. Check your internet connection.'
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = '🚫 Domain not authorized. Add localhost to Firebase authorized domains.'
      }
      
      alert(errorMessage)
    }
  }

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>
        🔥 Simple Firebase Test
      </h1>
      
      <p style={{ 
        fontSize: '16px', 
        lineHeight: '1.6', 
        color: '#666',
        marginBottom: '30px'
      }}>
        This page tests Firebase authentication without any React context or additional dependencies.
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testBasicFirebase}
          style={{
            backgroundColor: '#FF6B35',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '10px',
            marginBottom: '10px'
          }}
        >
          🔧 Test Firebase Init
        </button>
        
        <button
          onClick={testGoogleAuth}
          style={{
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          🔐 Test Google Auth
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '30px',
        textAlign: 'left'
      }}>
        <h3 style={{ marginTop: 0 }}>📋 Before Testing:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Open browser Developer Tools (F12)</li>
          <li>Go to Console tab</li>
          <li>Allow popups for this site</li>
          <li>Click "Test Firebase Init" first</li>
          <li>Then click "Test Google Auth"</li>
          <li>Check console for detailed logs</li>
        </ol>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <a 
          href="/debug-auth" 
          style={{ 
            color: '#007bff', 
            textDecoration: 'none',
            marginRight: '20px'
          }}
        >
          → Advanced Debug Tool
        </a>
        <a 
          href="/" 
          style={{ 
            color: '#007bff', 
            textDecoration: 'none'
          }}
        >
          → Back to Main App
        </a>
      </div>
    </div>
  )
}
