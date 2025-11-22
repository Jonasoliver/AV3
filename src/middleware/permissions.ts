import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { NivelPermissao } from '../enums/NivelPermissao';

export function requireRole(...roles: NivelPermissao[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
    if (!roles.includes(req.user.role as NivelPermissao)) return res.status(403).json({ error: 'Sem permissão' });
    next();
  };
}
