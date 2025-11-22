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

    // Contadores
    const pecasEmProducao = pecas.filter(p => p.status === 'EM_PRODUCAO').length;
    const pecasEmTransporte = pecas.filter(p => p.status === 'EM_TRANSPORTE').length;
    const pecasProntas = pecas.filter(p => p.status === 'PRONTA').length;
    
    const etapasPendentes = etapas.filter(e => e.status === 'PENDENTE').length;
    const etapasAndamento = etapas.filter(e => e.status === 'ANDAMENTO').length;
    const etapasConcluidas = etapas.filter(e => e.status === 'CONCLUIDA').length;
    
    const testesAprovados = testes.filter(t => t.resultado === 'APROVADO').length;
    const testesReprovados = testes.filter(t => t.resultado === 'REPROVADO').length;

    const linhas: string[] = [];
    linhas.push('═══════════════════════════════════════════════════════════');
    linhas.push('          RELATÓRIO AEROCODE - PRODUÇÃO DE AERONAVES       ');
    linhas.push('═══════════════════════════════════════════════════════════');
    linhas.push('');
    linhas.push(`Cliente: ${cliente}`);
    linhas.push(`Data de Entrega: ${dataEntrega}`);
    linhas.push('');
    linhas.push('───────────────────────────────────────────────────────────');
    linhas.push('  ESPECIFICAÇÕES DA AERONAVE');
    linhas.push('───────────────────────────────────────────────────────────');
    linhas.push(`Código: ${aeronave.codigo}`);
    linhas.push(`Modelo: ${aeronave.modelo}`);
    linhas.push(`Tipo: ${aeronave.tipo}`);
    linhas.push(`Capacidade: ${aeronave.capacidade ?? 'N/D'}`);
    linhas.push(`Alcance: ${aeronave.alcance ?? 'N/D'} km`);
    linhas.push('');
    linhas.push('───────────────────────────────────────────────────────────');
    linhas.push('  PEÇAS');
    linhas.push('───────────────────────────────────────────────────────────');
    linhas.push(`Total: ${pecas.length}`);
    linhas.push(`  Em produção: ${pecasEmProducao}`);
    linhas.push(`  Em transporte: ${pecasEmTransporte}`);
    linhas.push(`  Pronta: ${pecasProntas}`);
    if (pecas.length > 0) {
      linhas.push('');
      linhas.push('Detalhamento:');
      for (const p of pecas) {
        linhas.push(`  [#${p.id}] ${p.nome} - ${p.tipo} - ${p.status}`);
      }
    }
    linhas.push('');
    linhas.push('───────────────────────────────────────────────────────────');
    linhas.push('  ETAPAS DE PRODUÇÃO');
    linhas.push('───────────────────────────────────────────────────────────');
    linhas.push(`Total: ${etapas.length}`);
    linhas.push(`  Pendentes: ${etapasPendentes}`);
    linhas.push(`  Em andamento: ${etapasAndamento}`);
    linhas.push(`  Concluídas: ${etapasConcluidas}`);
    if (etapas.length > 0) {
      linhas.push('');
      linhas.push('Detalhamento:');
      for (const e of etapas) {
        const funcs = await this.etapaRepo.listFuncionarios(e.id!);
        const funcStr = funcs.map(f => f.funcionario_id).join(', ') || 'Sem responsáveis';
        linhas.push(`  [${e.ordem}] ${e.nome}`);
        linhas.push(`      Status: ${e.status} | Prazo: ${e.prazo || 'N/D'}`);
        linhas.push(`      Responsáveis: ${funcStr}`);
      }
    }
    linhas.push('');
    linhas.push('───────────────────────────────────────────────────────────');
    linhas.push('  TESTES REALIZADOS');
    linhas.push('───────────────────────────────────────────────────────────');
    linhas.push(`Total: ${testes.length}`);
    linhas.push(`  Aprovados: ${testesAprovados}`);
    linhas.push(`  Reprovados: ${testesReprovados}`);
    if (testes.length > 0) {
      linhas.push('');
      linhas.push('Detalhamento:');
      for (const t of testes) {
        const status = t.resultado === 'APROVADO' ? '✓' : '✗';
        linhas.push(`  ${status} [#${t.id}] ${t.tipo} => ${t.resultado}`);
      }
    }
    linhas.push('');
    linhas.push('═══════════════════════════════════════════════════════════');
    linhas.push(`Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`);
    linhas.push('═══════════════════════════════════════════════════════════');

    const completo = linhas.join('\n');
    return completo;
  }

  async salvarEmArquivo(codigo: string, conteudo: string) {
    const filePath = path.resolve(process.cwd(), 'reports', `relatorio_${codigo}.txt`);
    fs.writeFileSync(filePath, conteudo, 'utf8');
    return filePath;
  }

  getFilePath(codigo: string) {
    return path.resolve(process.cwd(), 'reports', `relatorio_${codigo}.txt`);
  }
}
