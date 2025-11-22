import { useState } from 'react'
import { http } from '../../api/client'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'

export default function RelatorioPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const [cliente, setCliente] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [relatorio, setRelatorio] = useState('')
  const [msg, setMsg] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const navigate = useNavigate()

  async function gerarRelatorio() {
    setMsg('')
    setRelatorio('')
    setDownloadUrl('')
    if (!cliente || !dataEntrega) {
      setMsg('Preencha cliente e data de entrega')
      return
    }
    try {
      const res = await http.post(`/relatorios/${codigo}`, {
        cliente,
        dataEntrega
      })
      setMsg(`Relatório gerado: ${res.data.path}`)
      setRelatorio(res.data.content)
      setDownloadUrl(`/relatorios/${codigo}/download`)
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao gerar relatório')
    }
  }

  async function baixarRelatorio() {
    try {
      const res = await http.get(`/relatorios/${codigo}/download`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `relatorio_${codigo}.txt`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      setMsg(e?.response?.data?.error || 'Erro ao baixar relatório. Gere o relatório primeiro.')
    }
  }

  return (
    <div>
      <PageHeader title={`Gerar Relatório - Aeronave ${codigo}`} />
      
      <div className="form">
        <div className="form-group">
          <label>Cliente *</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>
        <div className="form-group">
          <label>Data de Entrega *</label>
          <input
            type="text"
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
            placeholder="Ex: 31/12/2025"
          />
        </div>
        <button className="btn" onClick={gerarRelatorio}>
          Gerar Relatório
        </button>
        {downloadUrl && (
          <button className="btn primary" onClick={baixarRelatorio} style={{ marginLeft: '10px' }}>
            📥 Baixar Relatório
          </button>
        )}
        {msg && <div className="message">{msg}</div>}
      </div>

      {relatorio && (
        <div style={{ marginTop: '30px' }}>
          <h3>Relatório Gerado</h3>
          <pre style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '5px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {relatorio}
          </pre>
        </div>
      )}
    </div>
  )
}
