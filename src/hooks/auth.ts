// src/hooks/useAuth.ts
import { use } from 'react'
import { AuthContext } from '../context/auth'

export function useAuth() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }
  return context
}
