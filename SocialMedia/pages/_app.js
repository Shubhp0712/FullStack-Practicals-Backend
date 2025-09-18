import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../contexts/AuthContext'
import { SocketProvider } from '../contexts/SocketContext'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen bg-background dark:bg-dark">
          <Component {...pageProps} />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </SocketProvider>
    </AuthProvider>
  )
}
