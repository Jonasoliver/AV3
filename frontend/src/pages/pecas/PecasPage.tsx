import { useEffect, useState } from 'react'
import { http, Peca } from '../../api/client'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { EmptyState } from '../../components/EmptyState'

export default function PecasPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const [pecas, setPecas] = useState<Peca[]>([])
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'NACIONAL' | 'IMPORTADA'>('NACIONAL')
  const [fornecedor, setFornecedor] = useState('')
  const [status, setStatus] = useState<'EM_PRODUCAO' | 'EM_TRANSPORTE' | 'PRONTA'>('EM_PRODUCAO')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function carregar() {
    try {
      setLoading(true)
      const res = await http.get(`/aeronaves/${codigo}/pecas`)
      setPecas(res.data)
    } catch (e: any) {
      if (e?.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [codigo])

  async function adicionar() {
    setMsg('')
    if (!nome) {
      setMsg('Nome da peça é obrigatório')
      return
    }
    try {
      await http.post(`/aeronaves/${codigo}/pecas`, {
        nome,
        tipo,
        fornecedor: fornecedor || undefined,
        status
      })
      setMsg('Peça adicionada com sucesso')
      setNome('')
      setFornecedor('')
      await carregar()
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao adicionar peça')
    }
  }

  async function atualizarStatus(id: number, novoStatus: string) {
    try {
      await http.patch(`/aeronaves/${codigo}/pecas/${id}/status`, { status: novoStatus })
      setMsg('Status atualizado')
      await carregar()
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao atualizar status')
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <PageHeader title={`Peças - Aeronave ${codigo}`} />
      
      <div className="form">
        <h3>Adicionar Nova Peça</h3>
        <div className="form-group">
          <label>Nome da Peça *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Motor Turbofan"
          />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
            <option value="NACIONAL">NACIONAL</option>
            <option value="IMPORTADA">IMPORTADA</option>
          </select>
        </div>
        <div className="form-group">
          <label>Fornecedor</label>
          <input
            type="text"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            placeholder="Nome do fornecedor"
          />
        </div>
        <div className="form-group">
          <label>Status Inicial</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="EM_PRODUCAO">EM PRODUÇÃO</option>
            <option value="EM_TRANSPORTE">EM TRANSPORTE</option>
            <option value="PRONTA">PRONTA</option>
          </select>
        </div>
        <button className="btn" onClick={adicionar}>
          Adicionar Peça
        </button>
        {msg && <div className="message">{msg}</div>}
      </div>

      <h3>Lista de Peças</h3>
      {pecas.length === 0 ? (
        <EmptyState title="Nenhuma peça cadastrada para esta aeronave" />
      ) : (
        <Table headers={['ID', 'Nome', 'Tipo', 'Fornecedor', 'Status', 'Ações']}>
          {pecas.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.tipo}</td>
              <td>{p.fornecedor || '-'}</td>
              <td>{p.status}</td>
              <td>
                {p.status !== 'PRONTA' && (
                  <select
                    onChange={(e) => atualizarStatus(p.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Alterar status</option>
                    {p.status === 'EM_PRODUCAO' && <option value="EM_TRANSPORTE">EM TRANSPORTE</option>}
                    {p.status === 'EM_PRODUCAO' && <option value="PRONTA">PRONTA</option>}
                    {p.status === 'EM_TRANSPORTE' && <option value="PRONTA">PRONTA</option>}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}
