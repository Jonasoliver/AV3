import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { Protected } from './Protected'
import LoginPage from '@pages/LoginPage'
import AeronavesListPage from '@pages/aeronaves/ListPage'
import AeronavesNewPage from '@pages/aeronaves/NewPage'
import FuncionariosListPage from '@pages/funcionarios/ListPage'
import FuncionariosNewPage from '@pages/funcionarios/NewPage'
import PecasPage from '@pages/pecas/PecasPage'
import EtapasPage from '@pages/etapas/EtapasPage'
import TestesPage from '@pages/testes/TestesPage'
import RelatorioPage from '@pages/relatorios/RelatorioPage'
import QualidadePage from '@pages/relatorios/QualidadePage'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, logout } = useAuth()
  return (
    <>
      <div className="topbar">
        <div className="brand">Aeronaves</div>
        <nav className="nav">
          {session && <NavLink to="/aeronaves">Aeronaves</NavLink>}
          {session && (session.nivel === 'ADMINISTRADOR' || session.nivel === 'ENGENHEIRO') && <NavLink to="/aeronaves/nova">Nova Aeronave</NavLink>}
          {session && <NavLink to="/funcionarios">Funcionários</NavLink>}
          {session && session.nivel === 'ADMINISTRADOR' && <NavLink to="/funcionarios/novo">Novo Funcionário</NavLink>}
          {session && <NavLink to="/qualidade">Qualidade</NavLink>}
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
      <Route path="/" element={<Protected><Layout><AeronavesListPage /></Layout></Protected>} />
      <Route path="/aeronaves" element={<Protected><Layout><AeronavesListPage /></Layout></Protected>} />
      <Route path="/aeronaves/nova" element={<Protected allow={['ADMINISTRADOR', 'ENGENHEIRO']}><Layout><AeronavesNewPage /></Layout></Protected>} />
      <Route path="/aeronaves/:codigo/pecas" element={<Protected allow={['ADMINISTRADOR', 'ENGENHEIRO']}><Layout><PecasPage /></Layout></Protected>} />
      <Route path="/aeronaves/:codigo/etapas" element={<Protected allow={['ADMINISTRADOR', 'ENGENHEIRO']}><Layout><EtapasPage /></Layout></Protected>} />
      <Route path="/aeronaves/:codigo/testes" element={<Protected><Layout><TestesPage /></Layout></Protected>} />
      <Route path="/aeronaves/:codigo/relatorio" element={<Protected allow={['ADMINISTRADOR', 'ENGENHEIRO']}><Layout><RelatorioPage /></Layout></Protected>} />
      <Route path="/funcionarios" element={<Protected><Layout><FuncionariosListPage /></Layout></Protected>} />
      <Route path="/funcionarios/novo" element={<Protected allow={['ADMINISTRADOR']}><Layout><FuncionariosNewPage /></Layout></Protected>} />
      <Route path="/qualidade" element={<Protected><Layout><QualidadePage /></Layout></Protected>} />
    </Routes>
  </AuthProvider>
)
