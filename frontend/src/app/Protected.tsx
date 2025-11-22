import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const Protected: React.FC<{ children: React.ReactNode; allow?: string[] }> = ({ children, allow }) => {
  const { session } = useAuth()
  if (!session) return <Navigate to="/login" replace />
  if (allow && !allow.includes(session.nivel)) return <Navigate to="/" replace />
  return <>{children}</>
}
