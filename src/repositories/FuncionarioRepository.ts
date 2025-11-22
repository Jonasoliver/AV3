import { prisma } from '../db/prisma';
import { NivelPermissao } from '../enums/NivelPermissao';

export interface Funcionario {
  id: string;
  nome: string;
  telefone?: string | null;
  endereco?: string | null;
  usuario: string;
  senha_hash: string;
  nivel_permissao: NivelPermissao;
}

export class FuncionarioRepository {
  async findByUsuario(usuario: string): Promise<Funcionario | null> {
    const funcionario = await prisma.funcionario.findUnique({
      where: { usuario }
    });
    if (!funcionario) return null;
    return {
      id: funcionario.id,
      nome: funcionario.nome,
      telefone: funcionario.telefone,
      endereco: funcionario.endereco,
      usuario: funcionario.usuario,
      senha_hash: funcionario.senhaHash,
      nivel_permissao: funcionario.nivelPermissao as NivelPermissao
    };
  }

  async findById(id: string): Promise<Funcionario | null> {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id }
    });
    if (!funcionario) return null;
    return {
      id: funcionario.id,
      nome: funcionario.nome,
      telefone: funcionario.telefone,
      endereco: funcionario.endereco,
      usuario: funcionario.usuario,
      senha_hash: funcionario.senhaHash,
      nivel_permissao: funcionario.nivelPermissao as NivelPermissao
    };
  }

  async list(): Promise<Funcionario[]> {
    const funcionarios = await prisma.funcionario.findMany({
      orderBy: { id: 'asc' }
    });
    return funcionarios.map(f => ({
      id: f.id,
      nome: f.nome,
      telefone: f.telefone,
      endereco: f.endereco,
      usuario: f.usuario,
      senha_hash: f.senhaHash,
      nivel_permissao: f.nivelPermissao as NivelPermissao
    }));
  }

  async create(data: Omit<Funcionario,'id'> & { id: string }): Promise<Funcionario> {
    const funcionario = await prisma.funcionario.create({
      data: {
        id: data.id,
        nome: data.nome,
        telefone: data.telefone || null,
        endereco: data.endereco || null,
        usuario: data.usuario,
        senhaHash: data.senha_hash,
        nivelPermissao: data.nivel_permissao
      }
    });
    return {
      id: funcionario.id,
      nome: funcionario.nome,
      telefone: funcionario.telefone,
      endereco: funcionario.endereco,
      usuario: funcionario.usuario,
      senha_hash: funcionario.senhaHash,
      nivel_permissao: funcionario.nivelPermissao as NivelPermissao
    };
  }
}
