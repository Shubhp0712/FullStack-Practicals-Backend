import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Dashboard from '../components/Dashboard/Dashboard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return <Dashboard />
}
