import { prisma } from '../db/prisma';
import { StatusEtapa } from '../enums/StatusEtapa';

export interface Etapa {
  id?: number;
  aeronave_codigo: string;
  nome: string;
  prazo?: string | null;
  status: StatusEtapa;
  ordem: number;
}

export class EtapaRepository {
  async add(data: Omit<Etapa,'id'>): Promise<Etapa> {
    const etapa = await prisma.etapa.create({
      data: {
        aeronaveCodigo: data.aeronave_codigo,
        nome: data.nome,
        prazo: data.prazo || null,
        status: data.status,
        ordem: data.ordem
      }
    });
    return {
      id: etapa.id,
      aeronave_codigo: etapa.aeronaveCodigo,
      nome: etapa.nome,
      prazo: etapa.prazo,
      status: etapa.status as StatusEtapa,
      ordem: etapa.ordem
    };
  }

  async listByAeronave(codigo: string): Promise<Etapa[]> {
    const etapas = await prisma.etapa.findMany({
      where: { aeronaveCodigo: codigo },
      orderBy: { ordem: 'asc' }
    });
    return etapas.map(e => ({
      id: e.id,
      aeronave_codigo: e.aeronaveCodigo,
      nome: e.nome,
      prazo: e.prazo,
      status: e.status as StatusEtapa,
      ordem: e.ordem
    }));
  }

  async findById(id: number): Promise<Etapa | null> {
    const etapa = await prisma.etapa.findUnique({
      where: { id }
    });
    if (!etapa) return null;
    return {
      id: etapa.id,
      aeronave_codigo: etapa.aeronaveCodigo,
      nome: etapa.nome,
      prazo: etapa.prazo,
      status: etapa.status as StatusEtapa,
      ordem: etapa.ordem
    };
  }

  async updateStatus(id: number, status: StatusEtapa): Promise<void> {
    await prisma.etapa.update({
      where: { id },
      data: { status }
    });
  }

  async getPrevious(etapa: Etapa): Promise<Etapa | null> {
    if (etapa.ordem <= 1) return null;
    const previous = await prisma.etapa.findFirst({
      where: {
        aeronaveCodigo: etapa.aeronave_codigo,
        ordem: etapa.ordem - 1
      }
    });
    if (!previous) return null;
    return {
      id: previous.id,
      aeronave_codigo: previous.aeronaveCodigo,
      nome: previous.nome,
      prazo: previous.prazo,
      status: previous.status as StatusEtapa,
      ordem: previous.ordem
    };
  }

  async nextOrderIndex(aeronave_codigo: string): Promise<number> {
    const result = await prisma.etapa.aggregate({
      where: { aeronaveCodigo: aeronave_codigo },
      _max: { ordem: true }
    });
    const max = result._max.ordem || 0;
    return max + 1;
  }

  async addFuncionario(etapa_id: number, funcionario_id: string): Promise<void> {
    await prisma.etapasFuncionarios.create({
      data: {
        etapaId: etapa_id,
        funcionarioId: funcionario_id
      }
    });
  }

  async listFuncionarios(etapa_id: number): Promise<{ funcionario_id: string }[]> {
    const relations = await prisma.etapasFuncionarios.findMany({
      where: { etapaId: etapa_id },
      select: { funcionarioId: true }
    });
    return relations.map(r => ({ funcionario_id: r.funcionarioId }));
  }
}
