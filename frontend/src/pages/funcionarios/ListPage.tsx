import { useEffect, useState } from 'react'
import { http, Funcionario } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Table } from '../../components/Table'
import { EmptyState } from '../../components/EmptyState'

export default function FuncionariosListPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function carregar() {
    try {
      setLoading(true)
      const res = await http.get('/funcionarios')
      setFuncionarios(res.data)
    } catch (e: any) {
      if (e?.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <PageHeader title="Funcionários" />
      {funcionarios.length === 0 ? (
        <EmptyState title="Nenhum funcionário cadastrado" />
      ) : (
        <Table headers={['ID', 'Nome', 'Usuário', 'Telefone', 'Nível']}>
          {funcionarios.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.nome}</td>
              <td>{f.usuario}</td>
              <td>{f.telefone || '-'}</td>
              <td>{f.nivel_permissao}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}
