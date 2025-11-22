# Aeronaves Frontend (React + Vite)

## Desenvolvimento
```powershell
cd frontend
npm install
npm run dev
```
- O Vite roda em `http://localhost:5173`.
- As requisições para `/api` são proxy para `http://localhost:3000` (backend). Garanta que o backend esteja rodando.

## Backend
No diretório raiz, rode:
```powershell
npm run dev
```
Certifique-se de que o MySQL Server está ativo e o banco `aeronaves_db` foi criado com `schema.sql`.

## Variáveis (opcional)
Em produção, defina a API diretamente:
```powershell
$env:VITE_API_BASE = "http://seu-backend:3000"
npm run build
npm run preview
```
