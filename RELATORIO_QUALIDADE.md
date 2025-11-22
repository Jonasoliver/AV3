# Relatório de Qualidade - Guia de Uso

## Visão Geral

O sistema implementa coleta automática de métricas de performance para medir:
- **Latência de rede**: Tempo de ida e volta da requisição
- **Tempo de processamento**: Tempo que o servidor leva para processar
- **Tempo de resposta total**: Soma da latência + processamento

## Como Usar

### 1. Executar o Backend
```bash
npm run dev
```

### 2. Executar o Script SQL para Criar a Tabela
Abra o MySQL Workbench ou outro cliente MySQL e execute:
```sql
CREATE TABLE IF NOT EXISTS metricas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  endpoint VARCHAR(255) NOT NULL,
  metodo VARCHAR(10) NOT NULL,
  latencia_ms FLOAT NOT NULL,
  tempo_processamento_ms FLOAT NOT NULL,
  tempo_resposta_ms FLOAT NOT NULL,
  usuarios_concorrentes INT NOT NULL DEFAULT 1,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3. Executar Testes de Carga
```bash
npm run loadtest
```

Este script irá:
- Fazer login como admin
- Executar 50 requisições com 1 usuário
- Executar 100 requisições com 5 usuários concorrentes
- Executar 150 requisições com 10 usuários concorrentes

### 4. Visualizar o Relatório
1. Execute o frontend: `cd frontend && npm run dev`
2. Acesse: http://localhost:5173
3. Faça login (admin/admin123)
4. Clique em "Qualidade" no menu superior
5. Visualize os gráficos e dados

## Endpoints da API

### GET /metricas
Retorna métricas agregadas por número de usuários concorrentes.

**Resposta:**
```json
{
  "metricas": [
    {
      "usuariosConcorrentes": 1,
      "latenciaMedia": 2.45,
      "tempoProcessamentoMedio": 15.32,
      "tempoRespostaMedio": 17.77,
      "totalRequests": 50
    }
  ],
  "metodologia": { ... }
}
```

### GET /metricas/detalhadas
Retorna todas as métricas individuais (últimas 1000).

### DELETE /metricas
Limpa todas as métricas (útil para resetar testes).

## Metodologia

### Como as Métricas São Coletadas

1. **Middleware de Captura** (`src/middleware/metricsMiddleware.ts`):
   - Intercepta todas as requisições HTTP
   - Registra timestamp quando a requisição chega
   - Registra timestamp quando o processamento inicia
   - Registra timestamp quando a resposta é enviada
   - Calcula as três métricas e salva no banco

2. **Cálculos**:
   ```javascript
   tempoRespostaMs = responseEndTime - requestReceivedTime
   tempoProcessamentoMs = responseEndTime - serverStartTime
   latenciaMs = tempoRespostaMs - tempoProcessamentoMs
   ```

3. **Armazenamento**:
   - Todas as métricas são salvas na tabela `metricas`
   - Cada requisição gera uma linha na tabela
   - Os dados são agregados por número de usuários concorrentes

## Personalização

### Modificar Cenários de Teste
Edite `loadTest.js`:
```javascript
const SCENARIOS = [
  { users: 1, requests: 50 },
  { users: 5, requests: 100 },
  { users: 10, requests: 150 },
  { users: 20, requests: 200 }  // Adicionar novo cenário
];
```

### Adicionar Endpoints
Edite `loadTest.js`:
```javascript
const ENDPOINTS = [
  { method: 'GET', path: '/aeronaves' },
  { method: 'GET', path: '/funcionarios' },
  { method: 'GET', path: '/aeronaves/AER001/pecas' }  // Novo endpoint
];
```

## Solução de Problemas

### "Nenhuma métrica disponível"
- Execute `npm run loadtest` primeiro
- Verifique se a tabela `metricas` existe no banco
- Verifique se o backend está rodando

### Gráficos não aparecem
- Certifique-se de ter executado `npm install` no frontend
- Verifique se chart.js e react-chartjs-2 estão instalados
- Abra o console do navegador para ver erros

### Erro ao salvar métricas
- Verifique se a tabela `metricas` foi criada no banco
- Verifique a conexão com o MySQL
- Confira se o DATABASE_URL está correto no .env
