import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { Protected } from './Protected'
import LoginPage from '@pages/LoginPage'
import AeronavesListPage from '@pages/aeronaves/ListPage'
import AeronavesNewPage from '@pages/aeronaves/NewPage'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, logout } = useAuth()
  return (
    <>
      <div className="topbar">
        <div className="brand">Aeronaves</div>
        <nav className="nav">
          {session && <NavLink to="/aeronaves">Aeronaves</NavLink>}
          {session && <NavLink to="/aeronaves/nova">Nova</NavLink>}
        </nav>
        <div>
          {session ? (
            <button className="btn" onClick={logout}>Sair ({session.nivel})</button>
          ) : (
            <NavLink to="/login">Entrar</NavLink>
          )}
        </div>
      </div>
      <div className="container">{children}</div>
    </>
  )
}

export const AppRouter: React.FC = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Protected><Layout><AeronevesHome /></Layout></Protected>} />
      <Route path="/aeronaves" element={<Protected><Layout><AeronevesHome /></Layout></Protected>} />
      <Route path="/aeronaves/nova" element={<Protected allow={['ADMINISTRADOR']}><Layout><AeronavesNewPage /></Layout></Protected>} />
    </Routes>
  </AuthProvider>
)

const AeronevesHome: React.FC = () => <AeronevesWrapper />

const AeronevesWrapper: React.FC = () => (
  <AeronavesListPage />
)
