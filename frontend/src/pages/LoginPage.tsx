import React, { useState } from 'react'
import { useAuth } from '@app/AuthContext'
import { Navigate } from 'react-router-dom'

export default function LoginPage(){
  const { session, login } = useAuth()
  const [usuario,setUsuario] = useState('admin')
  const [senha,setSenha] = useState('admin123')
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)

  if (session) return <Navigate to="/aeronaves" replace />

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(usuario, senha) } catch(e:any){ setError(e?.response?.data?.error || 'Falha no login') } finally { setLoading(false) }
  }

  return (
    <div style={{maxWidth:380, margin:'60px auto'}} className="card">
      <h2 style={{marginTop:0}}>Entrar</h2>
      <form onSubmit={onSubmit} className="col" style={{gap:12}}>
        <input value={usuario} onChange={e=>setUsuario(e.target.value)} placeholder="Usuário" />
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" />
        <button className="btn primary" disabled={loading} type="submit">{loading?'Autenticando...':'Login'}</button>
      </form>
      {error && <p style={{color:'var(--danger)'}}>{error}</p>}
      <p className="muted" style={{fontSize:12, marginTop:16}}>Use credenciais de um usuário já cadastrado via backend (ex: admin).</p>
    </div>
  )
}
