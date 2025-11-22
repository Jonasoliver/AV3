import { useEffect, useState } from 'react'
import { http, Teste } from '../../api/client'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { EmptyState } from '../../components/EmptyState'

export default function TestesPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const [testes, setTestes] = useState<Teste[]>([])
  const [tipo, setTipo] = useState<'ELETRICO' | 'HIDRAULICO' | 'AERODINAMICO'>('ELETRICO')
  const [resultado, setResultado] = useState<'APROVADO' | 'REPROVADO'>('APROVADO')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function carregar() {
    try {
      setLoading(true)
      const res = await http.get(`/aeronaves/${codigo}/testes`)
      setTestes(res.data)
    } catch (e: any) {
      if (e?.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [codigo])

  async function adicionarTeste() {
    setMsg('')
    try {
      await http.post(`/aeronaves/${codigo}/testes`, {
        tipo,
        resultado
      })
      setMsg('Teste registrado com sucesso')
      await carregar()
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao registrar teste')
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <PageHeader title={`Testes - Aeronave ${codigo}`} />
      
      <div className="form">
        <h3>Registrar Novo Teste</h3>
        <div className="form-group">
          <label>Tipo de Teste</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
            <option value="ELETRICO">ELÉTRICO</option>
            <option value="HIDRAULICO">HIDRÁULICO</option>
            <option value="AERODINAMICO">AERODINÂMICO</option>
          </select>
        </div>
        <div className="form-group">
          <label>Resultado</label>
          <select value={resultado} onChange={(e) => setResultado(e.target.value as any)}>
            <option value="APROVADO">APROVADO</option>
            <option value="REPROVADO">REPROVADO</option>
          </select>
        </div>
        <button className="btn" onClick={adicionarTeste}>
          Registrar Teste
        </button>
        {msg && <div className="message">{msg}</div>}
      </div>

      <h3>Lista de Testes</h3>
      {testes.length === 0 ? (
        <EmptyState title="Nenhum teste registrado para esta aeronave" />
      ) : (
        <Table headers={['ID', 'Tipo', 'Resultado']}>
          {testes.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.tipo}</td>
              <td>
                <span style={{ 
                  color: t.resultado === 'APROVADO' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {t.resultado}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}
