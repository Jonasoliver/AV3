import { Link, Outlet, useNavigate } from 'react-router-dom'
import { auth } from './api/client'

export default function App() {
  const navigate = useNavigate()
  const logged = !!auth.getToken()
  const onLogout = () => { auth.clear(); navigate('/login') }

  return (
    <div style={{fontFamily:'sans-serif', maxWidth: 900, margin: '16px auto'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Aeronaves</h2>
        <nav style={{display:'flex', gap:16}}>
          <Link to="/aeronaves">Aeronaves</Link>
          {logged ? <button onClick={onLogout}>Sair</button> : <Link to="/login">Entrar</Link>}
        </nav>
      </header>
      <hr />
      <Outlet />
    </div>
  )
}
