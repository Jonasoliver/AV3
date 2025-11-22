import { useState } from 'react'
import { http } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'

export default function FuncionariosNewPage() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [nivel, setNivel] = useState<'ADMINISTRADOR' | 'ENGENHEIRO' | 'OPERADOR'>('OPERADOR')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  async function criar() {
    setMsg('')
    if (!nome || !usuario || !senha) {
      setMsg('Preencha nome, usuário e senha')
      return
    }
    try {
      const res = await http.post('/funcionarios', {
        nome,
        telefone: telefone || undefined,
        endereco: endereco || undefined,
        usuario,
        senha,
        nivel_permissao: nivel
      })
      setMsg(`Funcionário criado: ${res.data.id}`)
      setTimeout(() => navigate('/funcionarios'), 1500)
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao criar funcionário')
    }
  }

  return (
    <div>
      <PageHeader title="Novo Funcionário" />
      <div className="form">
        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
          />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
        <div className="form-group">
          <label>Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço completo"
          />
        </div>
        <div className="form-group">
          <label>Usuário *</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Login de acesso"
          />
        </div>
        <div className="form-group">
          <label>Senha *</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha de acesso"
          />
        </div>
        <div className="form-group">
          <label>Nível de Permissão</label>
          <select value={nivel} onChange={(e) => setNivel(e.target.value as any)}>
            <option value="OPERADOR">OPERADOR</option>
            <option value="ENGENHEIRO">ENGENHEIRO</option>
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
          </select>
        </div>
        <button className="btn" onClick={criar}>
          Cadastrar Funcionário
        </button>
        {msg && <div className="message">{msg}</div>}
      </div>
    </div>
  )
}
