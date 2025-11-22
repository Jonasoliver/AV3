import { Router } from 'express';
import { ReportGenerator } from '../utils/reportGenerator';
import { AeronaveService } from '../services/AeronaveService';
import { requireRole } from '../middleware/permissions';
import { NivelPermissao } from '../enums/NivelPermissao';

export function relatorioRoutes(report: ReportGenerator, aeronaveService: AeronaveService) {
  const router = Router();
  router.post('/:codigo', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try {
      const { dataEntrega } = req.body;
      if (!dataEntrega) return res.status(400).json({ error: 'dataEntrega obrigatória' });
      const texto = await report.gerarRelatorio(req.params.codigo, dataEntrega);
      const filePath = await report.salvarEmArquivo(req.params.codigo, texto);
      res.json({ path: filePath, content: texto });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  router.get('/:codigo/download', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try {
      const filePath = report.getFilePath(req.params.codigo);
      if (!require('fs').existsSync(filePath)) {
        return res.status(404).json({ error: 'Relatório não encontrado. Gere o relatório primeiro.' });
      }
      res.download(filePath, `relatorio_${req.params.codigo}.txt`);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });
  return router;
}
