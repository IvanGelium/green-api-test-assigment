import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../../providers/auth'

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
