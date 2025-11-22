import React, { useState } from 'react'
import { http } from '../../api/client'
import { PageHeader } from '@components/PageHeader'

export default function AeronavesNewPage(){
  const [modelo,setModelo] = useState('')
  const [tipo,setTipo] = useState<'COMERCIAL'|'MILITAR'>('COMERCIAL')
  const [capacidade,setCapacidade] = useState('')
  const [alcance,setAlcance] = useState('')
  const [msg,setMsg] = useState('')
  const [loading,setLoading] = useState(false)

  async function criar(e:React.FormEvent){
    e.preventDefault(); setMsg(''); setLoading(true)
    try {
      const res = await http.post('/aeronaves',{ modelo, tipo, capacidade:capacidade?Number(capacidade):undefined, alcance:alcance?Number(alcance):undefined })
      setMsg(`Criada aeronave ${res.data.codigo}`); setModelo(''); setCapacidade(''); setAlcance('')
    } catch(e:any){ setMsg(e?.response?.data?.error || 'Erro') } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Nova Aeronave" />
      <form onSubmit={criar} className="col" style={{maxWidth:520}}>
        <input placeholder="Modelo" value={modelo} onChange={e=>setModelo(e.target.value)} required />
        <select value={tipo} onChange={e=>setTipo(e.target.value as any)}>
          <option value="COMERCIAL">COMERCIAL</option>
          <option value="MILITAR">MILITAR</option>
        </select>
        <input placeholder="Capacidade" value={capacidade} onChange={e=>setCapacidade(e.target.value)} />
        <input placeholder="Alcance (km)" value={alcance} onChange={e=>setAlcance(e.target.value)} />
        <button className="btn primary" disabled={loading}>{loading?'Criando...':'Criar'}</button>
      </form>
      {msg && <p style={{marginTop:12}}>{msg}</p>}
    </div>
  )
}
