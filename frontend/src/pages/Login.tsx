import { useState } from 'react'
import { http, auth } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [usuario,setUsuario] = useState('admin')
  const [senha,setSenha] = useState('admin123')
  const [error,setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setError('')
    try{
      const res = await http.post('/auth/login', { usuario, senha })
      auth.setToken(res.data.token)
      navigate('/aeronaves')
    }catch(e:any){
      setError(e?.response?.data?.error || 'Falha no login')
    }
  }

  return (
    <div style={{maxWidth:400, margin:'40px auto'}}>
      <h3>Entrar</h3>
      <form onSubmit={onSubmit} style={{display:'flex', flexDirection:'column', gap:8}}>
        <input placeholder="Usuário" value={usuario} onChange={e=>setUsuario(e.target.value)} />
        <input placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  )
}
