import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

interface MetricsRequest extends Request {
  startTime?: number;
  serverStartTime?: number;
  usuariosConcorrentes?: number;
}

export function metricsMiddleware(req: MetricsRequest, res: Response, next: NextFunction) {
  const requestReceivedTime = Date.now();
  req.startTime = requestReceivedTime;

  // Captura quando o servidor começou a processar
  const originalSend = res.send;
  let serverStartTime = 0;

  res.send = function (data?: any): Response {
    const responseEndTime = Date.now();

    // Cálculo das métricas
    const tempoRespostaMs = responseEndTime - requestReceivedTime; // Tempo total (latência + processamento)
    const tempoProcessamentoMs = serverStartTime ? responseEndTime - serverStartTime : tempoRespostaMs;
    const latenciaMs = tempoRespostaMs - tempoProcessamentoMs; // Estimativa de latência de rede

    // Salvar métricas no banco de dados de forma assíncrona (não bloqueia resposta)
    const usuariosConcorrentes = req.usuariosConcorrentes || 1;
    
    // Usando raw SQL até regenerar Prisma Client
    prisma.$executeRaw`
      INSERT INTO metricas (endpoint, metodo, latencia_ms, tempo_processamento_ms, tempo_resposta_ms, usuarios_concorrentes)
      VALUES (${req.originalUrl || req.url}, ${req.method}, ${Math.max(0, latenciaMs)}, ${Math.max(0, tempoProcessamentoMs)}, ${tempoRespostaMs}, ${usuariosConcorrentes})
    `.catch((err: any) => {
      console.error('Erro ao salvar métrica:', err);
    });

    return originalSend.call(this, data);
  };

  // Marca quando o processamento de fato inicia
  serverStartTime = Date.now();
  
  next();
}

// Middleware para definir número de usuários concorrentes (usado em testes de carga)
export function setConcurrentUsers(users: number) {
  return (req: MetricsRequest, _res: Response, next: NextFunction) => {
    req.usuariosConcorrentes = users;
    next();
  };
}
