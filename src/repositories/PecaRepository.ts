import { prisma } from '../db/prisma';
import { StatusPeca } from '../enums/StatusPeca';
import { TipoPeca } from '../enums/TipoPeca';

export interface Peca {
  id?: number;
  aeronave_codigo: string;
  nome: string;
  tipo: TipoPeca;
  fornecedor?: string | null;
  status: StatusPeca;
}

export class PecaRepository {
  async add(data: Omit<Peca,'id'>): Promise<Peca> {
    const peca = await prisma.peca.create({
      data: {
        aeronaveCodigo: data.aeronave_codigo,
        nome: data.nome,
        tipo: data.tipo,
        fornecedor: data.fornecedor || null,
        status: data.status
      }
    });
    return {
      id: peca.id,
      aeronave_codigo: peca.aeronaveCodigo,
      nome: peca.nome,
      tipo: peca.tipo as TipoPeca,
      fornecedor: peca.fornecedor,
      status: peca.status as StatusPeca
    };
  }

  async updateStatus(id: number, status: StatusPeca): Promise<void> {
    await prisma.peca.update({
      where: { id },
      data: { status }
    });
  }

  async listByAeronave(codigo: string): Promise<Peca[]> {
    const pecas = await prisma.peca.findMany({
      where: { aeronaveCodigo: codigo },
      orderBy: { id: 'asc' }
    });
    return pecas.map(p => ({
      id: p.id,
      aeronave_codigo: p.aeronaveCodigo,
      nome: p.nome,
      tipo: p.tipo as TipoPeca,
      fornecedor: p.fornecedor,
      status: p.status as StatusPeca
    }));
  }

  async findById(id: number): Promise<Peca | null> {
    const peca = await prisma.peca.findUnique({
      where: { id }
    });
    if (!peca) return null;
    return {
      id: peca.id,
      aeronave_codigo: peca.aeronaveCodigo,
      nome: peca.nome,
      tipo: peca.tipo as TipoPeca,
      fornecedor: peca.fornecedor,
      status: peca.status as StatusPeca
    };
  }
}
