import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

export function metricasRoutes() {
  const router = Router();

  // GET /metricas - Retorna métricas agregadas por número de usuários
  router.get('/', async (_req: Request, res: Response) => {
    try {
      // Buscar métricas agrupadas por número de usuários concorrentes
      const metricas = await prisma.$queryRaw<Array<{
        usuarios_concorrentes: number;
        avg_latencia: number;
        avg_tempo_processamento: number;
        avg_tempo_resposta: number;
        total_requests: number;
      }>>`
        SELECT 
          usuarios_concorrentes,
          AVG(latencia_ms) as avg_latencia,
          AVG(tempo_processamento_ms) as avg_tempo_processamento,
          AVG(tempo_resposta_ms) as avg_tempo_resposta,
          COUNT(*) as total_requests
        FROM metricas
        WHERE usuarios_concorrentes IN (1, 5, 10)
        GROUP BY usuarios_concorrentes
        ORDER BY usuarios_concorrentes ASC
      `;

      // Formatar resposta
      const resultado = {
        metricas: metricas.map(m => ({
          usuariosConcorrentes: m.usuarios_concorrentes,
          latenciaMedia: Number(m.avg_latencia.toFixed(2)),
          tempoProcessamentoMedio: Number(m.avg_tempo_processamento.toFixed(2)),
          tempoRespostaMedio: Number(m.avg_tempo_resposta.toFixed(2)),
          totalRequests: Number(m.total_requests)
        })),
        metodologia: {
          descricao: "As métricas são coletadas através de um middleware Express que captura timestamps em diferentes pontos do ciclo de vida da requisição.",
          calculo: {
            latencia: "Tempo estimado de rede = Tempo Total - Tempo de Processamento",
            tempoProcessamento: "Tempo desde o início do processamento no servidor até o envio da resposta",
            tempoResposta: "Tempo total desde a chegada da requisição até o envio da resposta completa"
          },
          cenarios: "As métricas foram coletadas em três cenários: 1 usuário, 5 usuários e 10 usuários concorrentes",
          unidade: "Todas as medições estão em milissegundos (ms)"
        }
      };

      res.json(resultado);
    } catch (error: any) {
      console.error('Erro ao buscar métricas:', error);
      res.status(500).json({ error: 'Erro ao buscar métricas', details: error.message });
    }
  });

  // GET /metricas/detalhadas - Retorna todas as métricas para análise detalhada
  router.get('/detalhadas', async (_req: Request, res: Response) => {
    try {
      const metricas = await prisma.$queryRaw<Array<{
        id: number;
        endpoint: string;
        metodo: string;
        latencia_ms: number;
        tempo_processamento_ms: number;
        tempo_resposta_ms: number;
        usuarios_concorrentes: number;
        timestamp: Date;
      }>>`
        SELECT *
        FROM metricas
        ORDER BY timestamp DESC
        LIMIT 1000
      `;

      res.json({
        total: metricas.length,
        metricas: metricas.map(m => ({
          id: m.id,
          endpoint: m.endpoint,
          metodo: m.metodo,
          latenciaMs: m.latencia_ms,
          tempoProcessamentoMs: m.tempo_processamento_ms,
          tempoRespostaMs: m.tempo_resposta_ms,
          usuariosConcorrentes: m.usuarios_concorrentes,
          timestamp: m.timestamp
        }))
      });
    } catch (error: any) {
      console.error('Erro ao buscar métricas detalhadas:', error);
      res.status(500).json({ error: 'Erro ao buscar métricas detalhadas', details: error.message });
    }
  });

  // DELETE /metricas - Limpar métricas (útil para resetar testes)
  router.delete('/', async (_req: Request, res: Response) => {
    try {
      await prisma.$executeRaw`DELETE FROM metricas`;
      res.json({ message: 'Métricas limpas com sucesso' });
    } catch (error: any) {
      console.error('Erro ao limpar métricas:', error);
      res.status(500).json({ error: 'Erro ao limpar métricas', details: error.message });
    }
  });

  return router;
}
