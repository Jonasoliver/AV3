import { Pool } from 'mysql2/promise';
import { StatusPeca } from '../enums/StatusPeca';
import { TipoPeca } from '../enums/TipoPeca';

export interface Peca {
  id?: number;
  aeronave_codigo: string;
  nome: string;
  tipo: TipoPeca;
  fornecedor?: string;
  status: StatusPeca;
}

export class PecaRepository {
  constructor(private pool: Pool) {}

  async add(data: Omit<Peca,'id'>): Promise<Peca> {
    const { aeronave_codigo, nome, tipo, fornecedor, status } = data;
    const [result] = await this.pool.query<any>("INSERT INTO pecas (aeronave_codigo,nome,tipo,fornecedor,status) VALUES (?,?,?,?,?)", [aeronave_codigo,nome,tipo,fornecedor||null,status]);
    return { ...data, id: result.insertId };
  }

  async updateStatus(id: number, status: StatusPeca): Promise<void> {
    await this.pool.query("UPDATE pecas SET status = ? WHERE id = ?", [status, id]);
  }

  async listByAeronave(codigo: string): Promise<Peca[]> {
    const [rows] = await this.pool.query<Peca[]>("SELECT * FROM pecas WHERE aeronave_codigo = ? ORDER BY id ASC", [codigo]);
    return rows;
  }

  async findById(id: number): Promise<Peca | null> {
    const [rows] = await this.pool.query<Peca[]>("SELECT * FROM pecas WHERE id = ?", [id]);
    return rows[0] || null;
  }
}
