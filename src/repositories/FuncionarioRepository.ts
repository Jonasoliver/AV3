import { Pool } from 'mysql2/promise';
import { NivelPermissao } from '../enums/NivelPermissao';

export interface Funcionario {
  id: string;
  nome: string;
  telefone?: string;
  endereco?: string;
  usuario: string;
  senha_hash: string;
  nivel_permissao: NivelPermissao;
}

export class FuncionarioRepository {
  constructor(private pool: Pool) {}

  async findByUsuario(usuario: string): Promise<Funcionario | null> {
    const [rows] = await this.pool.query<Funcionario[]>("SELECT * FROM funcionarios WHERE usuario = ?", [usuario]);
    return rows[0] || null;
  }

  async findById(id: string): Promise<Funcionario | null> {
    const [rows] = await this.pool.query<Funcionario[]>("SELECT * FROM funcionarios WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async list(): Promise<Funcionario[]> {
    const [rows] = await this.pool.query<Funcionario[]>("SELECT * FROM funcionarios ORDER BY id ASC");
    return rows;
  }

  async create(data: Omit<Funcionario,'id'> & { id: string }): Promise<Funcionario> {
    const { id, nome, telefone, endereco, usuario, senha_hash, nivel_permissao } = data;
    await this.pool.query("INSERT INTO funcionarios (id,nome,telefone,endereco,usuario,senha_hash,nivel_permissao) VALUES (?,?,?,?,?,?,?)", [id,nome,telefone||null,endereco||null,usuario,senha_hash,nivel_permissao]);
    return data;
  }
}
