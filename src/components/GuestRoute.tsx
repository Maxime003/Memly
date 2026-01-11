import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

interface GuestRouteProps {
  children: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}
