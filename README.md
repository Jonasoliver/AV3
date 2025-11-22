# Backend Aeronaves (TypeScript + MySQL)

## Visão Geral
API REST para gerenciar ciclo de construção e validação de aeronaves: cadastro de aeronaves, peças, etapas produtivas, testes e geração de relatório. Inclui gestão de funcionários com níveis de permissão.

## Tecnologias
- Node.js / TypeScript
- Express
- MySQL (mysql2/promise)
- JWT para autenticação
- bcrypt para hash de senhas
- Arquivos de relatório em `reports/`

## Instalação
```powershell
npm install
# Criar .env baseado em .env.example
Copy-Item .env.example .env
# Ajuste credenciais do MySQL antes de prosseguir
# Criar banco e tabelas
mysql -u root -p < schema.sql
```

## Variáveis de Ambiente (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=senha
DB_DATABASE=aeronaves_db
JWT_SECRET=chave_segura
auth_bootstrap_admin_user=admin
auth_bootstrap_admin_pass=admin123
```

## Rodar servidor
```powershell
npm run dev
```
Bootstrap: se não houver administrador será criado automaticamente com usuário e senha definidos no .env.

## Autenticação
- `POST /auth/login` body: `{ usuario, senha }` -> retorna `{ token, funcionario }`.
- Usar header: `Authorization: Bearer <token>` para rotas protegidas.

## Permissões
- ADMINISTRADOR: CRUD funcionários, aeronaves, peças, etapas, testes, relatórios.
- ENGENHEIRO: peças, etapas, testes (sem gerar relatório / cadastrar funcionário).
- OPERADOR: somente leitura (listagens).

## Principais Rotas
```
POST   /auth/login
GET    /health

POST   /funcionarios          (ADMIN)
GET    /funcionarios          (todos roles)
GET    /funcionarios/:id      (todos roles)

POST   /aeronaves             (ADMIN)
GET    /aeronaves             (todos roles)
GET    /aeronaves/:codigo     (todos roles)

POST   /aeronaves/:codigo/pecas              (ADMIN, ENGENHEIRO)
PATCH  /pecas/:id/status                     (ADMIN, ENGENHEIRO)
GET    /aeronaves/:codigo/pecas              (todos roles)

POST   /aeronaves/:codigo/etapas             (ADMIN, ENGENHEIRO)
POST   /etapas/:id/iniciar                   (ADMIN, ENGENHEIRO)
POST   /etapas/:id/finalizar                 (ADMIN, ENGENHEIRO)
POST   /etapas/:id/funcionarios              (ADMIN, ENGENHEIRO)
GET    /etapas/:id/funcionarios              (todos roles)
GET    /aeronaves/:codigo/etapas             (todos roles)

POST   /aeronaves/:codigo/testes             (ADMIN, ENGENHEIRO)
GET    /aeronaves/:codigo/testes             (todos roles)

POST   /relatorios/:codigo                   (ADMIN)
```

## Geração de Relatório
`POST /relatorios/:codigo` body: `{ cliente, dataEntrega }` -> salva `reports/relatorio_<codigo>.txt` e retorna caminho + conteúdo.

## Regras de Negócio Implementadas
- Código aeronave incremental (`AER###`).
- Id funcionário incremental (`F###`).
- Sequência de etapas: só inicia/finaliza se anterior concluída.
- Associação de funcionário sem duplicatas (INSERT IGNORE).
- Hash seguro de senha (bcrypt).
- JWT com expiração (8h).

## Próximos Passos / Extensões
- Migrations automatizadas.
- Validação adicional: impedir testes antes de todas etapas concluídas.
- Normalizar resposta de erros com códigos internos.
- Paginação em listagens.

## Licença
Uso interno / estudo.
