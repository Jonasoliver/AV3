import { prisma } from '../db/prisma';
import { TipoAeronave } from '../enums/TipoAeronave';

export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade?: number | null;
  alcance?: number | null;
}

export class AeronaveRepository {
  async create(data: Aeronave): Promise<Aeronave> {
    const aeronave = await prisma.aeronave.create({
      data: {
        codigo: data.codigo,
        modelo: data.modelo,
        tipo: data.tipo,
        capacidade: data.capacidade || null,
        alcance: data.alcance || null
      }
    });
    return {
      codigo: aeronave.codigo,
      modelo: aeronave.modelo,
      tipo: aeronave.tipo as TipoAeronave,
      capacidade: aeronave.capacidade,
      alcance: aeronave.alcance
    };
  }

  async findByCodigo(codigo: string): Promise<Aeronave | null> {
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo }
    });
    if (!aeronave) return null;
    return {
      codigo: aeronave.codigo,
      modelo: aeronave.modelo,
      tipo: aeronave.tipo as TipoAeronave,
      capacidade: aeronave.capacidade,
      alcance: aeronave.alcance
    };
  }

  async list(): Promise<Aeronave[]> {
    const aeronaves = await prisma.aeronave.findMany({
      orderBy: { codigo: 'asc' }
    });
    return aeronaves.map(a => ({
      codigo: a.codigo,
      modelo: a.modelo,
      tipo: a.tipo as TipoAeronave,
      capacidade: a.capacidade,
      alcance: a.alcance
    }));
  }
}
