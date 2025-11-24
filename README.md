# Sistema de Gestão de Produção de Aeronaves - AeroCode

Sistema completo para gerenciar o ciclo de produção e validação de aeronaves, incluindo cadastro de aeronaves, peças, etapas produtivas, testes, relatórios e métricas de qualidade. Desenvolvido com TypeScript, Node.js, Express, MySQL (Prisma ORM) e React.

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

### 🆕 Relatório de Qualidade
- **Coleta automática de métricas de performance**
- **Três métricas principais:**
  - Latência de rede
  - Tempo de processamento no servidor
  - Tempo de resposta total
- **Cenários de teste:** 1, 5 e 10 usuários concorrentes
- **Visualização com gráficos** (Chart.js)
- **Metodologia documentada**

## 🚀 Tecnologias

**Backend:**
- Node.js + TypeScript
- Express.js
- MySQL com **Prisma ORM v5.22.0**
- JWT (jsonwebtoken)
- bcrypt

**Frontend:**
- React + TypeScript
- React Router
- Axios
- Vite
- Chart.js + React-Chartjs-2

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

Certifique-se de que o MySQL está rodando na porta **3306** com suas credenciais.


### 3. Crie o banco de dados vazio

No MySQL, crie apenas o banco de dados vazio (sem tabelas):

```sql
CREATE DATABASE aeronaves_db;
```

Você pode fazer isso pelo MySQL Workbench, DBeaver, ou via terminal:

```powershell
mysql -u root -pSUA_SENHA -e "CREATE DATABASE IF NOT EXISTS aeronaves_db;"
```

### 4. Crie as tabelas automaticamente (recomendado)

Com o banco de dados vazio criado, rode o comando abaixo para criar todas as tabelas automaticamente usando as migrations do Prisma:

```powershell
npx prisma migrate deploy
```

Se for a primeira vez rodando o projeto, ou se não houver migrations, rode:

```powershell
npx prisma migrate dev --name init
```

**Agora as tabelas serão criadas automaticamente!**

---

#### (Opção alternativa) Criar tabelas manualmente

Se preferir, você pode criar as tabelas manualmente executando o script SQL:

```powershell
mysql -u root -pSUA_SENHA < schema.sql
```

Ou pelo MySQL Workbench, abrindo o arquivo `schema.sql` e executando o script.

### 4. Configure as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto baseado no exemplo:

```powershell
Copy-Item .env.example .env
```

**Edite o arquivo `.env` com suas credenciais do MySQL:**

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_DATABASE=aeronaves_db
DATABASE_URL="mysql://root:SUA_SENHA_AQUI@127.0.0.1:3306/aeronaves_db"
JWT_SECRET=chave_super_secreta_jwt_aeronaves_2024
auth_bootstrap_admin_user=admin
auth_bootstrap_admin_pass=admin123
```

**⚠️ Importante:** 
- Substitua `SUA_SENHA_AQUI` pela senha do seu MySQL

**⚠️ Importante:** Se sua senha do MySQL for diferente, altere `DB_PASSWORD` e `DATABASE_URL`.

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

**IMPORTANTE:** Os servidores rodam em terminais separados com comandos diferentes.

**Backend (Terminal 1):**
```powershell
npm run dev
# Aguarde: "Servidor iniciado na porta 3000"
# Aguarde: "✓ Tabela de métricas verificada/criada"
```

**Frontend (Terminal 2):**
```powershell
cd frontend
npm run dev
# Aguarde: "Local: http://localhost:5173/"
```

## 🔑 Primeiro Acesso

O sistema cria automaticamente um usuário administrador na primeira execução:

- **URL:** http://localhost:5173
- **Usuário:** `admin`
- **Senha:** `admin123`

## 📖 Uso do Sistema

### Fluxo de Trabalho Típico

1. **ADMIN/ENGENHEIRO:** Cadastra uma aeronave (menu "Nova Aeronave")
2. **ADMIN/ENGENHEIRO:** Adiciona peças necessárias
3. **ADMIN/ENGENHEIRO:** Cria etapas de produção em ordem
4. **ADMIN/ENGENHEIRO:** Atribui funcionários às etapas
5. **ADMIN/ENGENHEIRO:** Inicia e finaliza etapas sequencialmente
6. **ADMIN/ENGENHEIRO:** Atualiza status das peças
7. **OPERADOR:** Registra testes realizados
8. **ENGENHEIRO:** Gera relatório final com resumo completo

### 🆕 Gerando Relatório de Qualidade

1. **Execute o script de testes de carga** (gera métricas):
```powershell
node loadTest.js
```

2. **Acesse o relatório:**
   - Faça login no sistema
   - Clique em **"Qualidade"** no menu superior
   - Visualize os 3 gráficos e a metodologia

3. **Limpar métricas** (opcional):
   - Use o botão "Limpar Métricas" na página

## 🛠️ Scripts Disponíveis

**Backend:**
- `npm run dev` - Modo desenvolvimento (ts-node-dev com hot-reload)
- `npm run build` - Compilar TypeScript
- `npm start` - Rodar versão compilada
- `node loadTest.js` - Executar testes de carga (gera métricas)

**Frontend:**
- `npm run dev` - Modo desenvolvimento (Vite)
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

## 🗂️ Estrutura do Projeto
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

## 🗂️ Estrutura do Projeto

```
AV3/
├── src/                      # Backend
│   ├── config/              # Configurações (env)
│   ├── db/                  # Prisma Client e migrações
│   ├── enums/               # Enumerações TypeScript
│   ├── middleware/          # Auth, permissões e métricas
│   ├── repositories/        # Camada de dados (Prisma)
│   ├── routes/              # Rotas da API
│   ├── services/            # Lógica de negócio
│   ├── utils/               # Utilitários e gerador de relatórios
│   ├── app.ts               # Configuração Express
│   └── server.ts            # Entrada da aplicação
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── api/            # Cliente HTTP (Axios)
│   │   ├── app/            # Auth Context e Router
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   │   ├── aeronaves/
│   │   │   ├── funcionarios/
│   │   │   ├── pecas/
│   │   │   ├── etapas/
│   │   │   ├── testes/
│   │   │   └── relatorios/ # Relatórios normais e de qualidade
│   │   └── styles/         # CSS global
│   └── index.html
├── prisma/                  # Prisma ORM
│   └── schema.prisma       # Schema do banco
├── reports/                 # Relatórios gerados (.txt)
├── schema.sql              # Script SQL inicial
├── loadTest.js             # Script de testes de carga
├── .env                    # Variáveis de ambiente
├── RELATORIO_QUALIDADE.md  # Documentação de métricas
└── README.md
```

## 🌐 API Endpoints

### Autenticação
- `POST /auth/login` - Login (retorna JWT)

### Aeronaves
- `POST /aeronaves` - Cadastrar (ADMIN/ENGENHEIRO)
- `GET /aeronaves` - Listar todas
- `GET /aeronaves/:codigo` - Obter detalhes

### Peças
- `POST /aeronaves/:codigo/pecas` - Adicionar peça (ADMIN/ENGENHEIRO)
- `GET /aeronaves/:codigo/pecas` - Listar peças
- `PATCH /aeronaves/:codigo/pecas/:id/status` - Atualizar status (ADMIN/ENGENHEIRO)

### Etapas
- `POST /aeronaves/:codigo/etapas` - Criar etapa (ADMIN/ENGENHEIRO)
- `GET /aeronaves/:codigo/etapas` - Listar etapas
- `POST /aeronaves/:codigo/etapas/:id/iniciar` - Iniciar etapa (ADMIN/ENGENHEIRO)
- `POST /aeronaves/:codigo/etapas/:id/finalizar` - Finalizar etapa (ADMIN/ENGENHEIRO)
- `POST /aeronaves/:codigo/etapas/:id/funcionarios` - Atribuir funcionário (ADMIN/ENGENHEIRO)
- `GET /aeronaves/:codigo/etapas/:id/funcionarios` - Listar funcionários da etapa

### Testes
- `POST /aeronaves/:codigo/testes` - Registrar teste (Todos)
- `GET /aeronaves/:codigo/testes` - Listar testes

### Funcionários
- `POST /funcionarios` - Cadastrar (ADMIN)
- `GET /funcionarios` - Listar

### Relatórios
- `POST /relatorios/:codigo` - Gerar relatório (ENGENHEIRO)
- `GET /relatorios/:codigo/download` - Baixar relatório

### 🆕 Métricas de Qualidade
- `GET /metricas` - Obter métricas agregadas (requer autenticação)
- `GET /metricas/detalhadas` - Métricas individuais (últimas 1000)
- `DELETE /metricas` - Limpar métricas (requer autenticação)

## 🎯 Controle de Acesso (Níveis de Permissão)

| Funcionalidade | ADMINISTRADOR | ENGENHEIRO | OPERADOR |
|----------------|---------------|------------|----------|
| Cadastrar Funcionários | ✅ | ❌ | ❌ |
| Cadastrar Aeronaves | ✅ | ✅ | ❌ |
| Adicionar Peças | ✅ | ✅ | ❌ |
| Criar/Gerenciar Etapas | ✅ | ✅ | ❌ |
| Registrar Testes | ✅ | ✅ | ✅ |
| Gerar Relatórios | ✅ | ✅ | ❌ |
| Ver Métricas de Qualidade | ✅ | ✅ | ✅ |

## 📊 Sobre o Relatório de Qualidade

O sistema coleta automaticamente **3 métricas de performance**:

1. **Latência de Rede** - Tempo de ida e volta da requisição
2. **Tempo de Processamento** - Tempo que o servidor leva para processar
3. **Tempo de Resposta Total** - Soma da latência + processamento

**Como funciona:**
- Um middleware intercepta todas as requisições
- Timestamps são capturados em 3 pontos do ciclo de vida
- Métricas são salvas automaticamente na tabela `metricas`
- O script `loadTest.js` simula cenários de 1, 5 e 10 usuários
- A página `/qualidade` exibe gráficos e metodologia completa

**Para mais detalhes:** Veja [RELATORIO_QUALIDADE.md](RELATORIO_QUALIDADE.md)

## 🐛 Solução de Problemas

### Erro ao conectar no MySQL
- Verifique se o MySQL está rodando: `services.msc` → MySQL80
- Confirme as credenciais no arquivo `.env`
- Teste a conexão com MySQL Workbench

### Backend não inicia - "EADDRINUSE: address already in use :::3000"
```powershell
# Encerrar processo na porta 3000
$port = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($port) { Stop-Process -Id $port.OwningProcess -Force }

# Reiniciar backend
npm run dev
```

### Frontend não compila - Erros de importação
```powershell
# Limpar e reinstalar dependências
cd frontend
rm -r node_modules
rm package-lock.json
npm install
cd ..
```

### "Nenhuma métrica disponível" na página de Qualidade
```powershell
# Execute o script de testes de carga primeiro
node loadTest.js
```

### Prisma Client não atualizado
```powershell
# Regenerar Prisma Client
npx prisma generate
```

## 📝 Notas de Desenvolvimento

- **ORM:** Migrado de mysql2 direto para **Prisma ORM v5.22.0**
- **Middleware de métricas:** Captura automática em todas as requisições
- **Geração de IDs:** Funcionários (F###) e Aeronaves (AER###) são gerados automaticamente
- **Validação de etapas:** Sistema garante ordem sequencial obrigatória
- **Relatórios:** Salvos em `/reports` com timestamp único

## 📄 Licença

Projeto acadêmico / uso interno.

## 👥 Desenvolvedor

Sistema de gestão completa do ciclo de produção de aeronaves com monitoramento de qualidade.
