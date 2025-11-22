import express from 'express';
import { ensureDirs } from './utils/ensureDirs';
import { runMigrations } from './db/migrations';
import { FuncionarioRepository } from './repositories/FuncionarioRepository';
import { AeronaveRepository } from './repositories/AeronaveRepository';
import { PecaRepository } from './repositories/PecaRepository';
import { EtapaRepository } from './repositories/EtapaRepository';
import { TesteRepository } from './repositories/TesteRepository';
import { FuncionarioService } from './services/FuncionarioService';
import { AeronaveService } from './services/AeronaveService';
import { AuthService } from './services/AuthService';
import { ReportGenerator } from './utils/reportGenerator';
import { authMiddleware } from './middleware/auth';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { authRoutes } from './routes/authRoutes';
import { funcionarioRoutes } from './routes/funcionarioRoutes';
import { aeronaveRoutes } from './routes/aeronaveRoutes';
import { relatorioRoutes } from './routes/relatorioRoutes';
import { metricasRoutes } from './routes/metricasRoutes';
import './config/env';

export async function createApp() {
  ensureDirs();
  
  // Executar migrações (criar tabela de métricas se necessário)
  await runMigrations();

  // Repos (now using Prisma, no Pool needed)
  const funcionarioRepo = new FuncionarioRepository();
  const aeronaveRepo = new AeronaveRepository();
  const pecaRepo = new PecaRepository();
  const etapaRepo = new EtapaRepository();
  const testeRepo = new TesteRepository();

  // Serviços
  const funcionarioService = new FuncionarioService(funcionarioRepo);
  await funcionarioService.bootstrapAdmin();
  const aeronaveService = new AeronaveService(aeronaveRepo, pecaRepo, etapaRepo, testeRepo);
  const authService = new AuthService(funcionarioRepo);
  const reportGenerator = new ReportGenerator(aeronaveRepo, pecaRepo, etapaRepo, testeRepo);

  const app = express();
  app.use(express.json());

  // Middleware de métricas (aplicado globalmente)
  app.use(metricsMiddleware);

  // Rotas públicas
  app.use('/auth', authRoutes(authService));

  // Rotas protegidas
  app.use('/funcionarios', authMiddleware, funcionarioRoutes(funcionarioService));
  app.use('/aeronaves', authMiddleware, aeronaveRoutes(aeronaveService));
  app.use('/relatorios', authMiddleware, relatorioRoutes(reportGenerator, aeronaveService));
  app.use('/metricas', authMiddleware, metricasRoutes());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  return app;
}
