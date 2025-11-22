import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { FuncionarioRepository } from '../repositories/FuncionarioRepository';
import { env } from '../config/env';

export class AuthService {
  constructor(private repo: FuncionarioRepository) {}

  async login(usuario: string, senha: string) {
    const func = await this.repo.findByUsuario(usuario);
    if (!func) throw new Error('Credenciais inválidas');
    const ok = await bcrypt.compare(senha, func.senha_hash);
    if (!ok) throw new Error('Credenciais inválidas');
    const token = jwt.sign({ sub: func.id, role: func.nivel_permissao }, env.jwtSecret, { expiresIn: '8h' });
    return { token, funcionario: { id: func.id, nome: func.nome, nivel: func.nivel_permissao } };
  }
}
