import { Router } from 'express';
import { AuthService } from '../services/AuthService';

export function authRoutes(authService: AuthService) {
  const router = Router();
  router.post('/login', async (req, res) => {
    try {
      const { usuario, senha } = req.body;
      if (!usuario || !senha) return res.status(400).json({ error: 'Campos obrigatórios' });
      const result = await authService.login(usuario, senha);
      res.json(result);
    } catch (e: any) {
      res.status(401).json({ error: e.message });
    }
  });
  return router;
}
