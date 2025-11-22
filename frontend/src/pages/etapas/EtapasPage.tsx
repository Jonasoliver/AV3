import { useEffect, useState } from 'react'
import { http, Etapa, Funcionario } from '../../api/client'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { EmptyState } from '../../components/EmptyState'

export default function EtapasPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [nome, setNome] = useState('')
  const [prazo, setPrazo] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedEtapa, setSelectedEtapa] = useState<number | null>(null)
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState('')
  const navigate = useNavigate()

  async function carregar() {
    try {
      setLoading(true)
      const [etapasRes, funcRes] = await Promise.all([
        http.get(`/aeronaves/${codigo}/etapas`),
        http.get('/funcionarios')
      ])
      setEtapas(etapasRes.data)
      setFuncionarios(funcRes.data)
    } catch (e: any) {
      if (e?.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [codigo])

  async function adicionarEtapa() {
    setMsg('')
    if (!nome) {
      setMsg('Nome da etapa é obrigatório')
      return
    }
    try {
      await http.post(`/aeronaves/${codigo}/etapas`, {
        nome,
        prazo: prazo || undefined
      })
      setMsg('Etapa adicionada com sucesso')
      setNome('')
      setPrazo('')
      await carregar()
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao adicionar etapa')
    }
  }

  async function iniciarEtapa(id: number) {
    try {
      await http.post(`/etapas/${id}/iniciar`)
      setMsg('Etapa iniciada')
      await carregar()
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao iniciar etapa')
    }
  }

  async function finalizarEtapa(id: number) {
    try {
      await http.post(`/etapas/${id}/finalizar`)
      setMsg('Etapa finalizada')
      await carregar()
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao finalizar etapa')
    }
  }

  async function atribuirFuncionario() {
    if (!selectedEtapa || !selectedFuncionarioId) {
      setMsg('Selecione uma etapa e um funcionário')
      return
    }
    try {
      await http.post(`/etapas/${selectedEtapa}/funcionarios`, {
        funcionario_id: selectedFuncionarioId
      })
      setMsg('Funcionário atribuído à etapa')
      setSelectedEtapa(null)
      setSelectedFuncionarioId('')
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao atribuir funcionário')
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <PageHeader title={`Etapas - Aeronave ${codigo}`} />
      
      <div className="form">
        <h3>Adicionar Nova Etapa</h3>
        <div className="form-group">
          <label>Nome da Etapa *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Montagem da Fuselagem"
          />
        </div>
        <div className="form-group">
          <label>Prazo</label>
          <input
            type="text"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            placeholder="Ex: 30 dias"
          />
        </div>
        <button className="btn" onClick={adicionarEtapa}>
          Adicionar Etapa
        </button>
      </div>

      <div className="form" style={{ marginTop: '20px' }}>
        <h3>Atribuir Funcionário à Etapa</h3>
        <div className="form-group">
          <label>Etapa</label>
          <select value={selectedEtapa || ''} onChange={(e) => setSelectedEtapa(Number(e.target.value))}>
            <option value="">Selecione uma etapa</option>
            {etapas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome} - {e.status}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Funcionário</label>
          <select value={selectedFuncionarioId} onChange={(e) => setSelectedFuncionarioId(e.target.value)}>
            <option value="">Selecione um funcionário</option>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome} - {f.nivel_permissao}
              </option>
            ))}
          </select>
        </div>
        <button className="btn" onClick={atribuirFuncionario}>
          Atribuir Funcionário
        </button>
      </div>

      {msg && <div className="message" style={{ margin: '20px 0' }}>{msg}</div>}

      <h3>Lista de Etapas</h3>
      {etapas.length === 0 ? (
        <EmptyState title="Nenhuma etapa cadastrada para esta aeronave" />
      ) : (
        <Table headers={['Ordem', 'Nome', 'Prazo', 'Status', 'Ações']}>
          {etapas.map((e) => (
            <tr key={e.id}>
              <td>{e.ordem}</td>
              <td>{e.nome}</td>
              <td>{e.prazo || '-'}</td>
              <td>{e.status}</td>
              <td>
                {e.status === 'PENDENTE' && (
                  <button className="btn" onClick={() => iniciarEtapa(e.id)}>
                    Iniciar
                  </button>
                )}
                {e.status === 'ANDAMENTO' && (
                  <button className="btn" onClick={() => finalizarEtapa(e.id)}>
                    Finalizar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}
