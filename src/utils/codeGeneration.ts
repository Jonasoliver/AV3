import { Pool } from 'mysql2/promise';

export async function generateAeronaveCode(pool: Pool): Promise<string> {
  const [rows] = await pool.query<{ codigo: string }[]>("SELECT codigo FROM aeronaves ORDER BY codigo DESC LIMIT 1");
  if (rows.length === 0) return 'AER001';
  const last = rows[0].codigo; // AER###
  const num = parseInt(last.replace('AER',''), 10) + 1;
  return 'AER' + num.toString().padStart(3,'0');
}

export async function generateFuncionarioId(pool: Pool): Promise<string> {
  const [rows] = await pool.query<{ id: string }[]>("SELECT id FROM funcionarios ORDER BY id DESC LIMIT 1");
  if (rows.length === 0) return 'F001';
  const last = rows[0].id; // F###
  const num = parseInt(last.replace('F',''), 10) + 1;
  return 'F' + num.toString().padStart(3,'0');
}
