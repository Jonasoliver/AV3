import { Router } from 'express';
import { AeronaveService } from '../services/AeronaveService';
import { requireRole } from '../middleware/permissions';
import { NivelPermissao } from '../enums/NivelPermissao';
import { TipoAeronave } from '../enums/TipoAeronave';
import { TipoPeca } from '../enums/TipoPeca';
import { StatusPeca } from '../enums/StatusPeca';
import { StatusEtapa } from '../enums/StatusEtapa';
import { TipoTeste } from '../enums/TipoTeste';
import { ResultadoTeste } from '../enums/ResultadoTeste';

export function aeronaveRoutes(service: AeronaveService) {
  const router = Router();

  router.post('/', requireRole(NivelPermissao.ADMINISTRADOR), async (req, res) => {
    try {
      const { modelo, tipo, capacidade, alcance } = req.body;
      if (!modelo || !tipo) return res.status(400).json({ error: 'Modelo e tipo são obrigatórios' });
      const aer = await service.cadastrarAeronave({ modelo, tipo: tipo as TipoAeronave, capacidade, alcance });
      res.status(201).json(aer);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  router.get('/', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR), async (_req, res) => {
    const lista = await service.listarAeronaves();
    res.json(lista);
  });

  router.get('/:codigo', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR), async (req, res) => {
    const a = await service.obterAeronave(req.params.codigo);
    if (!a) return res.status(404).json({ error: 'Não encontrada' });
    res.json(a);
  });

  // Peças
  router.post('/:codigo/pecas', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try {
      const { nome, tipo, fornecedor, status } = req.body;
      const p = await service.adicionarPeca(req.params.codigo, { nome, tipo: tipo as TipoPeca, fornecedor, status: status as StatusPeca });
      res.status(201).json(p);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  router.get('/:codigo/pecas', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR), async (req, res) => {
    const lista = await service.listarPecas(req.params.codigo);
    res.json(lista);
  });

  router.patch('/:codigo/pecas/:id/status', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try {
      const { status } = req.body;
      await service.atualizarStatusPeca(parseInt(req.params.id, 10), status as StatusPeca);
      res.json({ ok: true });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  // Etapas
  router.post('/:codigo/etapas', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try {
      const { nome, prazo } = req.body;
      const e = await service.criarEtapa(req.params.codigo, { nome, prazo });
      res.status(201).json(e);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  router.get('/:codigo/etapas', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR), async (req, res) => {
    const lista = await service.listarEtapas(req.params.codigo);
    res.json(lista);
  });

  router.post('/:codigo/etapas/:id/iniciar', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try { await service.iniciarEtapa(parseInt(req.params.id,10)); res.json({ ok: true }); } catch(e: any){ res.status(400).json({ error: e.message }); }
  });

  router.post('/:codigo/etapas/:id/finalizar', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try { await service.finalizarEtapa(parseInt(req.params.id,10)); res.json({ ok: true }); } catch(e: any){ res.status(400).json({ error: e.message }); }
  });

  router.post('/:codigo/etapas/:id/funcionarios', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try { const { funcionario_id } = req.body; await service.associarFuncionario(parseInt(req.params.id,10), funcionario_id); res.json({ ok: true }); } catch(e: any){ res.status(400).json({ error: e.message }); }
  });

  router.get('/:codigo/etapas/:id/funcionarios', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR), async (req, res) => {
    const lista = await service.listarFuncionariosEtapa(parseInt(req.params.id,10));
    res.json(lista);
  });

  // Testes
  router.post('/:codigo/testes', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO), async (req, res) => {
    try { const { tipo, resultado } = req.body; const t = await service.registrarTeste(req.params.codigo, { tipo: tipo as TipoTeste, resultado: resultado as ResultadoTeste }); res.status(201).json(t); } catch(e: any){ res.status(400).json({ error: e.message }); }
  });

  router.get('/:codigo/testes', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR), async (req, res) => {
    const lista = await service.listarTestes(req.params.codigo);
    res.json(lista);
  });

  return router;
}
