import bcrypt from 'bcrypt';
import { FuncionarioRepository } from '../repositories/FuncionarioRepository';
import { generateFuncionarioId } from '../utils/codeGeneration';
import { Pool } from 'mysql2/promise';
import { NivelPermissao } from '../enums/NivelPermissao';

export class FuncionarioService {
  constructor(private repo: FuncionarioRepository, private pool: Pool) {}

  async bootstrapAdmin(): Promise<void> {
    const admin = await this.repo.findByUsuario(process.env.auth_bootstrap_admin_user || 'admin');
    if (!admin) {
      const id = await generateFuncionarioId(this.pool);
      const senha_hash = await bcrypt.hash(process.env.auth_bootstrap_admin_pass || 'admin123', 10);
      await this.repo.create({
        id,
        nome: 'Administrador Inicial',
        usuario: process.env.auth_bootstrap_admin_user || 'admin',
        senha_hash,
        nivel_permissao: NivelPermissao.ADMINISTRADOR,
        telefone: '',
        endereco: ''
      });
      console.log('Bootstrap: administrador criado');
    }
  }

  async cadastrarFuncionario(data: { nome: string; telefone?: string; endereco?: string; usuario: string; senha: string; nivel_permissao: NivelPermissao; }): Promise<any> {
    const existente = await this.repo.findByUsuario(data.usuario);
    if (existente) throw new Error('Usuário já existe');
    const id = await generateFuncionarioId(this.pool);
    const senha_hash = await bcrypt.hash(data.senha, 10);
    return this.repo.create({ id, nome: data.nome, telefone: data.telefone, endereco: data.endereco, usuario: data.usuario, senha_hash, nivel_permissao: data.nivel_permissao });
  }

  async listar() { return this.repo.list(); }
  async buscarPorId(id: string) { return this.repo.findById(id); }
}
