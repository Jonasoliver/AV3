/**
 * Script de Testes de Carga
 * 
 * Executa requisições concorrentes para simular 1, 5 e 10 usuários
 * e popular a tabela de métricas para o Relatório de Qualidade.
 * 
 * Uso: node loadTest.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let TOKEN = '';

// Configuração dos cenários de teste
const SCENARIOS = [
  { users: 1, requests: 50 },
  { users: 5, requests: 100 },
  { users: 10, requests: 150 }
];

// Endpoints a serem testados
const ENDPOINTS = [
  { method: 'GET', path: '/aeronaves' },
  { method: 'GET', path: '/funcionarios' },
  { method: 'GET', path: '/health' }
];

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      usuario: 'admin',
      senha: 'admin123'
    });
    TOKEN = response.data.token;
    console.log('✓ Login realizado com sucesso');
  } catch (error) {
    console.error('✗ Erro ao fazer login:', error.message);
    process.exit(1);
  }
}

async function makeRequest(endpoint, usersConcurrent) {
  const config = {
    method: endpoint.method,
    url: `${BASE_URL}${endpoint.path}`,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'X-Concurrent-Users': usersConcurrent.toString()
    }
  };

  try {
    await axios(config);
  } catch (error) {
    // Ignorar erros (404, etc) - o importante é coletar as métricas
  }
}

async function runScenario(scenario) {
  console.log(`\n📊 Executando cenário: ${scenario.users} usuário(s) - ${scenario.requests} requisições`);
  
  const totalRequests = scenario.requests;
  const requestsPerUser = Math.ceil(totalRequests / scenario.users);
  
  const promises = [];
  
  for (let user = 0; user < scenario.users; user++) {
    for (let req = 0; req < requestsPerUser; req++) {
      const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
      promises.push(makeRequest(endpoint, scenario.users));
      
      // Pequeno delay para simular comportamento mais realista
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  await Promise.all(promises);
  console.log(`✓ Cenário concluído: ${promises.length} requisições enviadas`);
}

async function main() {
  console.log('🚀 Iniciando testes de carga para Relatório de Qualidade\n');
  console.log('Configuração:');
  console.log(`- Base URL: ${BASE_URL}`);
  console.log(`- Cenários: ${SCENARIOS.map(s => `${s.users}u`).join(', ')}`);
  console.log(`- Endpoints: ${ENDPOINTS.length}\n`);

  await login();

  for (const scenario of SCENARIOS) {
    await runScenario(scenario);
    // Pequena pausa entre cenários
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Testes de carga concluídos!');
  console.log('As métricas foram coletadas e podem ser visualizadas em /qualidade');
}

main().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
