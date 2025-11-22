import { AeronaveRepository } from '../repositories/AeronaveRepository';
import { PecaRepository } from '../repositories/PecaRepository';
import { EtapaRepository } from '../repositories/EtapaRepository';
import { TesteRepository } from '../repositories/TesteRepository';
import { generateAeronaveCode } from '../utils/codeGeneration';
import { Pool } from 'mysql2/promise';
import { TipoAeronave } from '../enums/TipoAeronave';
import { TipoPeca } from '../enums/TipoPeca';
import { StatusPeca } from '../enums/StatusPeca';
import { StatusEtapa } from '../enums/StatusEtapa';
import { TipoTeste } from '../enums/TipoTeste';
import { ResultadoTeste } from '../enums/ResultadoTeste';

export class AeronaveService {
  constructor(
    private aeronaveRepo: AeronaveRepository,
    private pecaRepo: PecaRepository,
    private etapaRepo: EtapaRepository,
    private testeRepo: TesteRepository,
    private pool: Pool
  ) {}

  async cadastrarAeronave(data: { modelo: string; tipo: TipoAeronave; capacidade?: number; alcance?: number; }) {
    const codigo = await generateAeronaveCode(this.pool);
    return this.aeronaveRepo.create({ codigo, ...data });
  }

  async listarAeronaves() { return this.aeronaveRepo.list(); }
  async obterAeronave(codigo: string) { return this.aeronaveRepo.findByCodigo(codigo); }

  async adicionarPeca(codigo: string, data: { nome: string; tipo: TipoPeca; fornecedor?: string; status?: StatusPeca; }) {
    const aeronave = await this.obterAeronave(codigo);
    if (!aeronave) throw new Error('Aeronave não encontrada');
    return this.pecaRepo.add({ aeronave_codigo: codigo, nome: data.nome, tipo: data.tipo, fornecedor: data.fornecedor, status: data.status || StatusPeca.EM_PRODUCAO });
  }

  async atualizarStatusPeca(id: number, status: StatusPeca) {
    const peca = await this.pecaRepo.findById(id);
    if (!peca) throw new Error('Peça não encontrada');
    await this.pecaRepo.updateStatus(id, status);
  }

  async listarPecas(codigo: string) { return this.pecaRepo.listByAeronave(codigo); }

  async criarEtapa(codigo: string, data: { nome: string; prazo?: string; }) {
    const aeronave = await this.obterAeronave(codigo);
    if (!aeronave) throw new Error('Aeronave não encontrada');
    const ordem = await this.etapaRepo.nextOrderIndex(codigo);
    return this.etapaRepo.add({ aeronave_codigo: codigo, nome: data.nome, prazo: data.prazo, status: StatusEtapa.PENDENTE, ordem });
  }

  async iniciarEtapa(id: number) {
    const etapa = await this.etapaRepo.findById(id);
    if (!etapa) throw new Error('Etapa não encontrada');
    if (etapa.status !== StatusEtapa.PENDENTE) throw new Error('Etapa não está PENDENTE');
    const prev = await this.etapaRepo.getPrevious(etapa);
    if (prev && prev.status !== StatusEtapa.CONCLUIDA) throw new Error('Etapa anterior não concluída');
    await this.etapaRepo.updateStatus(id, StatusEtapa.ANDAMENTO);
  }

  async finalizarEtapa(id: number) {
    const etapa = await this.etapaRepo.findById(id);
    if (!etapa) throw new Error('Etapa não encontrada');
    if (![StatusEtapa.ANDAMENTO, StatusEtapa.PENDENTE].includes(etapa.status)) throw new Error('Etapa já concluída');
    const prev = await this.etapaRepo.getPrevious(etapa);
    if (prev && prev.status !== StatusEtapa.CONCLUIDA) throw new Error('Etapa anterior não concluída');
    await this.etapaRepo.updateStatus(id, StatusEtapa.CONCLUIDA);
  }

  async associarFuncionario(etapa_id: number, funcionario_id: string) {
    const etapa = await this.etapaRepo.findById(etapa_id);
    if (!etapa) throw new Error('Etapa não encontrada');
    await this.etapaRepo.addFuncionario(etapa_id, funcionario_id);
  }

  async listarFuncionariosEtapa(etapa_id: number) {
    return this.etapaRepo.listFuncionarios(etapa_id);
  }

  async listarEtapas(codigo: string) { return this.etapaRepo.listByAeronave(codigo); }

  async registrarTeste(codigo: string, data: { tipo: TipoTeste; resultado: ResultadoTeste; }) {
    const aeronave = await this.obterAeronave(codigo);
    if (!aeronave) throw new Error('Aeronave não encontrada');
    return this.testeRepo.add({ aeronave_codigo: codigo, tipo: data.tipo, resultado: data.resultado });
  }

  async listarTestes(codigo: string) { return this.testeRepo.listByAeronave(codigo); }
}
