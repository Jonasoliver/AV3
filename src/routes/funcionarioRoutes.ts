import { Router } from 'express';
import { FuncionarioService } from '../services/FuncionarioService';
import { requireRole } from '../middleware/permissions';
import { NivelPermissao } from '../enums/NivelPermissao';

export function funcionarioRoutes(service: FuncionarioService) {
  const router = Router();

  router.post('/', requireRole(NivelPermissao.ADMINISTRADOR), async (req, res) => {
    try {
      const { nome, telefone, endereco, usuario, senha, nivel_permissao } = req.body;
      if (!nome || !usuario || !senha || !nivel_permissao) return res.status(400).json({ error: 'Dados incompletos' });
      const novo = await service.cadastrarFuncionario({ nome, telefone, endereco, usuario, senha, nivel_permissao });
      res.status(201).json(novo);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  router.get('/', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR), async (_req, res) => {
    const lista = await service.listar();
    res.json(lista);
  });

  router.get('/:id', requireRole(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR), async (req, res) => {
    const f = await service.buscarPorId(req.params.id);
    if (!f) return res.status(404).json({ error: 'Não encontrado' });
    res.json(f);
  });

  return router;
}
