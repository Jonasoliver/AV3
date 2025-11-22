import fs from 'fs';
import path from 'path';
import { AeronaveRepository } from '../repositories/AeronaveRepository';
import { PecaRepository } from '../repositories/PecaRepository';
import { EtapaRepository } from '../repositories/EtapaRepository';
import { TesteRepository } from '../repositories/TesteRepository';
import { StatusEtapa } from '../enums/StatusEtapa.js';

export class ReportGenerator {
  constructor(
    private aeronaveRepo: AeronaveRepository,
    private pecaRepo: PecaRepository,
    private etapaRepo: EtapaRepository,
    private testeRepo: TesteRepository
  ) {}

  async gerarRelatorio(codigo: string, cliente: string, dataEntrega: string): Promise<string> {
    const aeronave = await this.aeronaveRepo.findByCodigo(codigo);
    if (!aeronave) throw new Error('Aeronave não encontrada');
    const pecas = await this.pecaRepo.listByAeronave(codigo);
    const etapas = await this.etapaRepo.listByAeronave(codigo);
    const testes = await this.testeRepo.listByAeronave(codigo);

    const linhas: string[] = [];
    linhas.push(`Relatório Aeronave ${aeronave.codigo}`);
    linhas.push('Cliente: ' + cliente);
    linhas.push('Data Entrega: ' + dataEntrega);
    linhas.push('Modelo: ' + aeronave.modelo);
    linhas.push('Tipo: ' + aeronave.tipo);
    linhas.push('Capacidade: ' + (aeronave.capacidade ?? 'N/D'));
    linhas.push('Alcance: ' + (aeronave.alcance ?? 'N/D'));
    linhas.push('--- Peças (' + pecas.length + ') ---');
    if (pecas.length === 0) linhas.push('(Sem peças)');
    for (const p of pecas) linhas.push(`[#${p.id}] ${p.nome} - ${p.tipo} - ${p.status}`);
    linhas.push('--- Etapas (' + etapas.length + ') ---');
    if (etapas.length === 0) linhas.push('(Sem etapas)');
    for (const e of etapas) {
      const funcs = await this.etapaRepo.listFuncionarios(e.id!);
      const funcStr = funcs.map(f => f.funcionario_id).join(', ') || 'Sem responsáveis';
      linhas.push(`[${e.ordem}] ${e.nome} (${e.status}) Prazo: ${e.prazo || 'N/D'} Resp: ${funcStr}`);
    }
    linhas.push('--- Testes (' + testes.length + ') ---');
    if (testes.length === 0) linhas.push('(Sem testes)');
    for (const t of testes) linhas.push(`[#${t.id}] ${t.tipo} => ${t.resultado}`);

    const completo = linhas.join('\n');
    return completo;
  }

  async salvarEmArquivo(codigo: string, conteudo: string) {
    const filePath = path.resolve(process.cwd(), 'reports', `relatorio_${codigo}.txt`);
    fs.writeFileSync(filePath, conteudo, 'utf8');
    return filePath;
  }
}
