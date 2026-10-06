import { createContext } from 'react'

export interface AuthData {
  idInstance: string
  apiTokenInstance: string
}

export interface AuthContextType {
  authData: AuthData | null
  login: (data: AuthData) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
