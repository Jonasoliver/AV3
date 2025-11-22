import { prisma } from '../db/prisma';

export async function runMigrations() {
  try {
    // Criar tabela de métricas se não existir
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS metricas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        endpoint VARCHAR(255) NOT NULL,
        metodo VARCHAR(10) NOT NULL,
        latencia_ms FLOAT NOT NULL,
        tempo_processamento_ms FLOAT NOT NULL,
        tempo_resposta_ms FLOAT NOT NULL,
        usuarios_concorrentes INT NOT NULL DEFAULT 1,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;
    console.log('✓ Tabela de métricas verificada/criada');
  } catch (error) {
    console.error('Erro ao criar tabela de métricas:', error);
  }
}
