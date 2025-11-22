import { useEffect, useState } from 'react'
import { http, Aeronave } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function Aeronaves(){
  const [lista,setLista] = useState<Aeronave[]>([])
  const [modelo,setModelo] = useState('')
  const [tipo,setTipo] = useState<'COMERCIAL'|'MILITAR'>('COMERCIAL')
  const [capacidade,setCapacidade] = useState<number|''>('')
  const [alcance,setAlcance] = useState<number|''>('')
  const [msg,setMsg] = useState('')
  const navigate = useNavigate()

  async function carregar(){
    try{
      const res = await http.get('/aeronaves')
      setLista(res.data)
    }catch(e:any){
      if(e?.response?.status === 401) navigate('/login')
    }
  }

  useEffect(()=>{carregar()},[])

  async function criar(){
    setMsg('')
    try{
      const res = await http.post('/aeronaves', {
        modelo,
        tipo,
        capacidade: capacidade === '' ? undefined : Number(capacidade),
        alcance: alcance === '' ? undefined : Number(alcance)
      })
      setMsg(`Criada ${res.data.codigo}`)
      setModelo(''); setCapacidade(''); setAlcance('')
      await carregar()
    }catch(e:any){
      setMsg(e?.response?.data?.error || 'Erro ao criar')
    }
  }

  return (
    <div>
      <h3>Lista de Aeronaves</h3>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Código</th><th>Modelo</th><th>Tipo</th><th>Capacidade</th><th>Alcance</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(a => (
            <tr key={a.codigo}>
              <td>{a.codigo}</td>
              <td>{a.modelo}</td>
              <td>{a.tipo}</td>
              <td>{a.capacidade ?? '-'}</td>
              <td>{a.alcance ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{marginTop:24}}>Cadastrar Aeronave (ADMIN)</h4>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, maxWidth:600}}>
        <input placeholder="Modelo" value={modelo} onChange={e=>setModelo(e.target.value)} />
        <select value={tipo} onChange={e=>setTipo(e.target.value as any)}>
          <option value="COMERCIAL">COMERCIAL</option>
          <option value="MILITAR">MILITAR</option>
        </select>
        <input placeholder="Capacidade (opcional)" value={capacidade} onChange={e=>setCapacidade(e.target.value as any)} />
        <input placeholder="Alcance (km, opcional)" value={alcance} onChange={e=>setAlcance(e.target.value as any)} />
        <button onClick={criar}>Criar</button>
      </div>
      {msg && <p>{msg}</p>}
    </div>
  )
}
