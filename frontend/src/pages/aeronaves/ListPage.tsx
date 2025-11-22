import React, { useEffect, useState } from 'react'
import { http } from '../../api/client'
import { PageHeader } from '@components/PageHeader'
import { Table } from '@components/Table'
import { EmptyState } from '@components/EmptyState'
import { Link } from 'react-router-dom'

interface Aeronave { codigo:string; modelo:string; tipo:string; capacidade?:number; alcance?:number }

export default function AeronavesListPage(){
  const [lista,setLista] = useState<Aeronave[]>([])
  const [filtro,setFiltro] = useState('')
  const [loading,setLoading] = useState(true)
  const filtered = lista.filter(a => a.codigo.includes(filtro.toUpperCase()) || a.modelo.toLowerCase().includes(filtro.toLowerCase()))

  async function carregar(){
    setLoading(true)
    try { const res = await http.get('/aeronaves'); setLista(res.data) } finally { setLoading(false) }
  }
  useEffect(()=>{carregar()},[])

  return (
    <div>
      <PageHeader title="Aeronaves" actions={<input placeholder="Filtrar" value={filtro} onChange={e=>setFiltro(e.target.value)} /> } />
      {loading && <p className="muted">Carregando...</p>}
      {!loading && filtered.length===0 && <EmptyState title="Nenhuma aeronave" />}
      {!loading && filtered.length>0 && (
        <Table headers={["Código","Modelo","Tipo","Capacidade","Alcance","Ações"]}>
          {filtered.map(a => (
            <tr key={a.codigo}>
              <td>{a.codigo}</td>
              <td>{a.modelo}</td>
              <td>{a.tipo}</td>
              <td>{a.capacidade ?? '-'}</td>
              <td>{a.alcance ?? '-'}</td>
              <td>
                <Link to={`/aeronaves/${a.codigo}/pecas`} style={{ marginRight: '10px' }}>Peças</Link>
                <Link to={`/aeronaves/${a.codigo}/etapas`} style={{ marginRight: '10px' }}>Etapas</Link>
                <Link to={`/aeronaves/${a.codigo}/testes`} style={{ marginRight: '10px' }}>Testes</Link>
                <Link to={`/aeronaves/${a.codigo}/relatorio`}>Relatório</Link>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}
