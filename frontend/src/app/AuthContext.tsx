import React, { createContext, useContext, useEffect, useState } from 'react'
import { http, auth } from '../api/client'

export type Session = { id: string; nome: string; nivel: string; token: string }

interface AuthContextType {
  session: Session | null
  login: (usuario: string, senha: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const token = auth.getToken()
    if (token) {
      // tentativa simplificada para recuperar minimal user (sem endpoint dedicado)
      // usuário completo não é retornado sem login; mantemos apenas token
      setSession({ id: 'unknown', nome: 'Sessão', nivel: 'OPERADOR', token })
    }
  }, [])

  async function login(usuario: string, senha: string) {
    const res = await http.post('/auth/login', { usuario, senha })
    auth.setToken(res.data.token)
    setSession({ ...res.data.funcionario, token: res.data.token })
  }
  function logout() {
    auth.clear(); setSession(null)
  }

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
