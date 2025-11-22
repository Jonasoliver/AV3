import express from 'express';
import { getPool } from './db/connection';
import { ensureDirs } from './utils/ensureDirs';
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
import { authRoutes } from './routes/authRoutes';
import { funcionarioRoutes } from './routes/funcionarioRoutes';
import { aeronaveRoutes } from './routes/aeronaveRoutes';
import { relatorioRoutes } from './routes/relatorioRoutes';
import './config/env';

export async function createApp() {
  ensureDirs();
  const pool = getPool();

  // Repos
  const funcionarioRepo = new FuncionarioRepository(pool);
  const aeronaveRepo = new AeronaveRepository(pool);
  const pecaRepo = new PecaRepository(pool);
  const etapaRepo = new EtapaRepository(pool);
  const testeRepo = new TesteRepository(pool);

  // Serviços
  const funcionarioService = new FuncionarioService(funcionarioRepo, pool);
  await funcionarioService.bootstrapAdmin();
  const aeronaveService = new AeronaveService(aeronaveRepo, pecaRepo, etapaRepo, testeRepo, pool);
  const authService = new AuthService(funcionarioRepo);
  const reportGenerator = new ReportGenerator(aeronaveRepo, pecaRepo, etapaRepo, testeRepo);

  const app = express();
  app.use(express.json());

  // Rotas públicas
  app.use('/auth', authRoutes(authService));

  // Rotas protegidas
  app.use('/funcionarios', authMiddleware, funcionarioRoutes(funcionarioService));
  app.use('/aeronaves', authMiddleware, aeronaveRoutes(aeronaveService));
  app.use('/relatorios', authMiddleware, relatorioRoutes(reportGenerator, aeronaveService));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  return app;
}
