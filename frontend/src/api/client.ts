import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export const http = axios.create({ baseURL: API_BASE })

http.interceptors.request.use((config) => {
  const token = auth.getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export const auth = {
  getToken: () => localStorage.getItem('token') || '',
  setToken: (t: string) => localStorage.setItem('token', t),
  clear: () => localStorage.removeItem('token')
}

export type Aeronave = {
  codigo: string
  modelo: string
  tipo: 'COMERCIAL' | 'MILITAR'
  capacidade?: number
  alcance?: number
}

export type Funcionario = {
  id: string
  nome: string
  telefone?: string
  endereco?: string
  usuario: string
  nivel_permissao: 'ADMINISTRADOR' | 'ENGENHEIRO' | 'OPERADOR'
}

export type Peca = {
  id: number
  aeronave_codigo: string
  nome: string
  tipo: 'NACIONAL' | 'IMPORTADA'
  fornecedor?: string
  status: 'EM_PRODUCAO' | 'EM_TRANSPORTE' | 'PRONTA'
}

export type Etapa = {
  id: number
  aeronave_codigo: string
  nome: string
  prazo?: string
  status: 'PENDENTE' | 'ANDAMENTO' | 'CONCLUIDA'
  ordem: number
}

export type Teste = {
  id: number
  aeronave_codigo: string
  tipo: 'ELETRICO' | 'HIDRAULICO' | 'AERODINAMICO'
  resultado: 'APROVADO' | 'REPROVADO'
}
