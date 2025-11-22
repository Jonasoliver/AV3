import { Pool, RowDataPacket } from 'mysql2/promise';
import { StatusEtapa } from '../enums/StatusEtapa';

export interface Etapa {
  id?: number;
  aeronave_codigo: string;
  nome: string;
  prazo?: string;
  status: StatusEtapa;
  ordem: number;
}

type EtapaRow = Etapa & RowDataPacket;
type MaxOrdemRow = { max_ordem: number } & RowDataPacket;
type FuncEtapaRow = { funcionario_id: string } & RowDataPacket;

export class EtapaRepository {
  constructor(private pool: Pool) {}

  async add(data: Omit<Etapa,'id'>): Promise<Etapa> {
    const { aeronave_codigo, nome, prazo, status, ordem } = data;
    const [result] = await this.pool.query<any>("INSERT INTO etapas (aeronave_codigo,nome,prazo,status,ordem) VALUES (?,?,?,?,?)", [aeronave_codigo,nome,prazo||null,status,ordem]);
    return { ...data, id: result.insertId };
  }

  async listByAeronave(codigo: string): Promise<Etapa[]> {
    const [rows] = await this.pool.query<EtapaRow[]>("SELECT * FROM etapas WHERE aeronave_codigo = ? ORDER BY ordem ASC", [codigo]);
    return rows as Etapa[];
  }

  async findById(id: number): Promise<Etapa | null> {
    const [rows] = await this.pool.query<EtapaRow[]>("SELECT * FROM etapas WHERE id = ?", [id]);
    return (rows[0] as Etapa) || null;
  }

  async updateStatus(id: number, status: StatusEtapa): Promise<void> {
    await this.pool.query("UPDATE etapas SET status = ? WHERE id = ?", [status, id]);
  }

  async getPrevious(etapa: Etapa): Promise<Etapa | null> {
    if (etapa.ordem <= 1) return null;
    const [rows] = await this.pool.query<EtapaRow[]>("SELECT * FROM etapas WHERE aeronave_codigo = ? AND ordem = ?", [etapa.aeronave_codigo, etapa.ordem - 1]);
    return (rows[0] as Etapa) || null;
  }

  async nextOrderIndex(aeronave_codigo: string): Promise<number> {
    const [rows] = await this.pool.query<MaxOrdemRow[]>("SELECT COALESCE(MAX(ordem),0) as max_ordem FROM etapas WHERE aeronave_codigo = ?", [aeronave_codigo]);
    const max = rows[0].max_ordem;
    return max + 1;
  }

  async addFuncionario(etapa_id: number, funcionario_id: string): Promise<void> {
    await this.pool.query("INSERT IGNORE INTO etapas_funcionarios (etapa_id, funcionario_id) VALUES (?,?)", [etapa_id, funcionario_id]);
  }

  async listFuncionarios(etapa_id: number): Promise<{ funcionario_id: string }[]> {
    const [rows] = await this.pool.query<FuncEtapaRow[]>("SELECT funcionario_id FROM etapas_funcionarios WHERE etapa_id = ?", [etapa_id]);
    return rows as { funcionario_id: string }[];
  }
}
