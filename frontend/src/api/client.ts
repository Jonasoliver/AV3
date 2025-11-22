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
