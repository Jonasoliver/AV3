# Sistema de Gestão de Produção de Aeronaves - AeroCode

Sistema completo para gerenciar o ciclo de produção e validação de aeronaves, incluindo cadastro de aeronaves, peças, etapas produtivas, testes e geração de relatórios. Desenvolvido com TypeScript, Node.js, Express, MySQL e React.

## 📋 Funcionalidades

### Gestão de Aeronaves
- Cadastro de aeronaves (código automático AER###)
- Especificações: modelo, tipo (COMERCIAL/MILITAR), capacidade, alcance
- Visualização e listagem completa

### Gestão de Peças
- Cadastro de peças por aeronave
- Tipos: NACIONAL ou IMPORTADA
- Status: EM_PRODUCAO → EM_TRANSPORTE → PRONTA
- Controle de fornecedores

### Gestão de Etapas de Produção
- Criação de etapas com ordem sequencial
- Status: PENDENTE → ANDAMENTO → CONCLUIDA
- Atribuição de funcionários às etapas
- Controle de prazos
- Validação: só inicia/finaliza se etapa anterior estiver concluída

### Gestão de Testes
- Registro de testes por aeronave
- Tipos: ELÉTRICO, HIDRÁULICO, AERODINÂMICO
- Resultados: APROVADO ou REPROVADO

### Gestão de Funcionários
- Cadastro de funcionários (ID automático F###)
- Níveis de permissão: ADMINISTRADOR, ENGENHEIRO, OPERADOR
- Autenticação com JWT
- Hash seguro de senhas (bcrypt)

### Relatórios
- Geração de relatórios completos por aeronave
- Visualização em terminal (pré-visualização)
- Download em formato .txt
- Inclui: especificações, peças, etapas, testes e contadores

## 🚀 Tecnologias

**Backend:**
- Node.js + TypeScript
- Express.js
- MySQL (mysql2/promise)
- JWT (jsonwebtoken)
- bcrypt

**Frontend:**
- React + TypeScript
- React Router
- Axios
- Vite

## 📦 Pré-requisitos

- Node.js 16+ instalado
- MySQL 8.0+ instalado e rodando
- npm ou yarn

## ⚙️ Configuração e Instalação

### 1. Clone o repositório
```powershell
git clone <url-do-repositorio>
cd AV3
```

### 2. Configure o MySQL

Certifique-se de que o MySQL está rodando. Anote:
- Usuário (ex: `root`)
- Senha
- Porta (padrão: `3306`)

### 3. Crie o banco de dados e tabelas

**Opção A - Usar MySQL CLI:**
```powershell
# Se o mysql estiver no PATH
mysql -u root -p < setup_database.sql

# Caso contrário, use o caminho completo
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < setup_database.sql
```

**Opção B - Usar MySQL Workbench ou outro cliente:**
Execute o arquivo `setup_database.sql` no seu cliente MySQL.

### 4. Configure as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:
```powershell
Copy-Item .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_DATABASE=aeronaves_db
JWT_SECRET=uma_chave_jwt_segura
auth_bootstrap_admin_user=admin
auth_bootstrap_admin_pass=admin123
```

### 5. Instale as dependências

**Backend:**
```powershell
npm install
```

**Frontend:**
```powershell
cd frontend
npm install
cd ..
```

### 6. Inicie os servidores

**Backend (Terminal 1):**
```powershell
npm run dev
# Rodará em http://localhost:3000
```

**Frontend (Terminal 2):**
```powershell
cd frontend
npm run dev
# Rodará em http://localhost:5173
```

## 🔑 Primeiro Acesso

No primeiro boot, o sistema cria automaticamente um usuário administrador:

- **Usuário:** `admin`
- **Senha:** `admin123`

Acesse: http://localhost:5173

## 📖 Uso do Sistema

### Permissões por Nível

| Funcionalidade | ADMINISTRADOR | ENGENHEIRO | OPERADOR |
|----------------|---------------|------------|----------|
| Cadastrar Aeronaves | ✅ | ❌ | ❌ |
| Visualizar Aeronaves | ✅ | ✅ | ✅ |
| Cadastrar Funcionários | ✅ | ❌ | ❌ |
| Visualizar Funcionários | ✅ | ✅ | ✅ |
| Gerenciar Peças | ✅ | ✅ | ❌ |
| Gerenciar Etapas | ✅ | ✅ | ❌ |
| Registrar Testes | ✅ | ✅ | ❌ |
| Gerar Relatórios | ✅ | ❌ | ❌ |

### Fluxo de Trabalho Típico

1. **ADMIN:** Cadastra uma aeronave
2. **ADMIN/ENGENHEIRO:** Adiciona peças necessárias
3. **ADMIN/ENGENHEIRO:** Cria etapas de produção
4. **ADMIN/ENGENHEIRO:** Atribui funcionários às etapas
5. **ADMIN/ENGENHEIRO:** Inicia e finaliza etapas em sequência
6. **ADMIN/ENGENHEIRO:** Atualiza status das peças
7. **ADMIN/ENGENHEIRO:** Registra testes realizados
8. **ADMIN:** Gera relatório final com data de entrega

## 🛠️ Scripts Disponíveis

**Backend:**
- `npm run dev` - Modo desenvolvimento (ts-node-dev)
- `npm run build` - Compilar TypeScript
- `npm start` - Rodar versão compilada

**Frontend:**
- `npm run dev` - Modo desenvolvimento (Vite)
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

## 🗂️ Estrutura do Projeto

```
AV3/
├── src/                    # Backend
│   ├── config/            # Configurações
│   ├── db/                # Conexão com banco
│   ├── enums/             # Enumerações TypeScript
│   ├── middleware/        # Auth e permissões
│   ├── repositories/      # Camada de dados
│   ├── routes/            # Rotas da API
│   ├── services/          # Lógica de negócio
│   ├── utils/             # Utilitários
│   ├── app.ts             # Configuração Express
│   └── server.ts          # Entrada da aplicação
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── api/          # Cliente HTTP
│   │   ├── app/          # Auth e Router
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   └── styles/       # CSS global
│   └── index.html
├── reports/               # Relatórios gerados
├── schema.sql            # Schema original
├── setup_database.sql    # Script completo de setup
├── .env.example          # Exemplo de variáveis
└── README.md
```

## 🌐 API Endpoints

### Autenticação
- `POST /auth/login` - Login

### Aeronaves
- `POST /aeronaves` - Cadastrar (ADMIN)
- `GET /aeronaves` - Listar
- `GET /aeronaves/:codigo` - Obter detalhes

### Peças
- `POST /aeronaves/:codigo/pecas` - Adicionar peça
- `GET /aeronaves/:codigo/pecas` - Listar peças
- `PATCH /aeronaves/:codigo/pecas/:id/status` - Atualizar status

### Etapas
- `POST /aeronaves/:codigo/etapas` - Criar etapa
- `GET /aeronaves/:codigo/etapas` - Listar etapas
- `POST /aeronaves/:codigo/etapas/:id/iniciar` - Iniciar etapa
- `POST /aeronaves/:codigo/etapas/:id/finalizar` - Finalizar etapa
- `POST /aeronaves/:codigo/etapas/:id/funcionarios` - Atribuir funcionário

### Testes
- `POST /aeronaves/:codigo/testes` - Registrar teste
- `GET /aeronaves/:codigo/testes` - Listar testes

### Funcionários
- `POST /funcionarios` - Cadastrar (ADMIN)
- `GET /funcionarios` - Listar

### Relatórios
- `POST /relatorios/:codigo` - Gerar relatório (ADMIN)
- `GET /relatorios/:codigo/download` - Baixar relatório

## 🐛 Solução de Problemas

**Erro ao conectar no MySQL:**
- Verifique se o MySQL está rodando
- Confira as credenciais no arquivo `.env`
- Teste a conexão com MySQL Workbench

**Porta já em uso:**
- Backend (3000): Altere em `src/config/env.ts`
- Frontend (5173): Altere em `frontend/vite.config.ts`

**Erro "Cannot find module":**
```powershell
# Limpe e reinstale
rm -r node_modules
rm package-lock.json
npm install
```

## 📄 Licença

Projeto de uso interno / estudo.

## 👥 Desenvolvedor

Sistema desenvolvido para gestão completa do ciclo de produção de aeronaves.
