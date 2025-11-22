import { Pool } from 'mysql2/promise';
import { TipoTeste } from '../enums/TipoTeste';
import { ResultadoTeste } from '../enums/ResultadoTeste';

export interface Teste {
  id?: number;
  aeronave_codigo: string;
  tipo: TipoTeste;
  resultado: ResultadoTeste;
}

export class TesteRepository {
  constructor(private pool: Pool) {}

  async add(data: Omit<Teste,'id'>): Promise<Teste> {
    const { aeronave_codigo, tipo, resultado } = data;
    const [result] = await this.pool.query<any>("INSERT INTO testes (aeronave_codigo,tipo,resultado) VALUES (?,?,?)", [aeronave_codigo,tipo,resultado]);
    return { ...data, id: result.insertId };
  }

  async listByAeronave(codigo: string): Promise<Teste[]> {
    const [rows] = await this.pool.query<Teste[]>("SELECT * FROM testes WHERE aeronave_codigo = ? ORDER BY id ASC", [codigo]);
    return rows;
  }
}
