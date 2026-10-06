import type { AuthData } from '../context/auth'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(() => {
    const id = localStorage.getItem('idInstance')
    const token = localStorage.getItem('apiTokenInstance')

    if (id && token) {
      return { idInstance: id, apiTokenInstance: token }
    }
    return null
  })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const hasTokens = !!(authData)
    if (!hasTokens)
      navigate('/login')
  }, [authData, location.pathname, navigate])

  const login = (data: AuthData) => {
    if (!(data?.apiTokenInstance && data?.idInstance))
      return console.error('Не переданые данные авторизации')
    localStorage.setItem('idInstance', data.idInstance)
    localStorage.setItem('apiTokenInstance', data.apiTokenInstance)
    setAuthData(data)
    navigate('/chat')
  }

  const logout = () => {
    localStorage.removeItem('idInstance')
    localStorage.removeItem('apiTokenInstance')
    setAuthData(null)
    navigate('/login')
  }

  return (
    <AuthContext value={{ authData, login, logout }}>
      {children}
    </AuthContext>
  )
}
