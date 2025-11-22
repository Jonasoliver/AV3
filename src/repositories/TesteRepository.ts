import { prisma } from '../db/prisma';
import { TipoTeste } from '../enums/TipoTeste';
import { ResultadoTeste } from '../enums/ResultadoTeste';

export interface Teste {
  id?: number;
  aeronave_codigo: string;
  tipo: TipoTeste;
  resultado: ResultadoTeste;
}

export class TesteRepository {
  async add(data: Omit<Teste,'id'>): Promise<Teste> {
    const teste = await prisma.teste.create({
      data: {
        aeronaveCodigo: data.aeronave_codigo,
        tipo: data.tipo,
        resultado: data.resultado
      }
    });
    return {
      id: teste.id,
      aeronave_codigo: teste.aeronaveCodigo,
      tipo: teste.tipo as TipoTeste,
      resultado: teste.resultado as ResultadoTeste
    };
  }

  async listByAeronave(codigo: string): Promise<Teste[]> {
    const testes = await prisma.teste.findMany({
      where: { aeronaveCodigo: codigo },
      orderBy: { id: 'asc' }
    });
    return testes.map(t => ({
      id: t.id,
      aeronave_codigo: t.aeronaveCodigo,
      tipo: t.tipo as TipoTeste,
      resultado: t.resultado as ResultadoTeste
    }));
  }
}
