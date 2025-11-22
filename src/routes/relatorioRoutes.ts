import { Router } from 'express';
import { ReportGenerator } from '../utils/reportGenerator';
import { AeronaveService } from '../services/AeronaveService';
import { requireRole } from '../middleware/permissions';
import { NivelPermissao } from '../enums/NivelPermissao';

export function relatorioRoutes(report: ReportGenerator, aeronaveService: AeronaveService) {
  const router = Router();
  router.post('/:codigo', requireRole(NivelPermissao.ADMINISTRADOR), async (req, res) => {
    try {
      const { cliente, dataEntrega } = req.body;
      if (!cliente || !dataEntrega) return res.status(400).json({ error: 'Cliente e dataEntrega obrigatórios' });
      const texto = await report.gerarRelatorio(req.params.codigo, cliente, dataEntrega);
      const filePath = await report.salvarEmArquivo(req.params.codigo, texto);
      res.json({ filePath, conteudo: texto });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });
  return router;
}
