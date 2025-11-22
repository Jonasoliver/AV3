import { Pool } from 'mysql2/promise';
import { TipoAeronave } from '../enums/TipoAeronave';

export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade?: number;
  alcance?: number;
}

export class AeronaveRepository {
  constructor(private pool: Pool) {}

  async create(data: Aeronave): Promise<Aeronave> {
    const { codigo, modelo, tipo, capacidade, alcance } = data;
    await this.pool.query("INSERT INTO aeronaves (codigo,modelo,tipo,capacidade,alcance) VALUES (?,?,?,?,?)", [codigo,modelo,tipo,capacidade||null,alcance||null]);
    return data;
  }

  async findByCodigo(codigo: string): Promise<Aeronave | null> {
    const [rows] = await this.pool.query<Aeronave[]>("SELECT * FROM aeronaves WHERE codigo = ?", [codigo]);
    return rows[0] || null;
  }

  async list(): Promise<Aeronave[]> {
    const [rows] = await this.pool.query<Aeronave[]>("SELECT * FROM aeronaves ORDER BY codigo ASC");
    return rows;
  }
}
