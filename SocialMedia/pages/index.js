import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AuthPage from '../components/Auth/AuthPage'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <LoadingSpinner />
  }

  return <AuthPage />
}
