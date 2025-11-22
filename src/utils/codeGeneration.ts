import { prisma } from '../db/prisma';

export async function generateAeronaveCode(): Promise<string> {
  const last = await prisma.aeronave.findFirst({
    orderBy: { codigo: 'desc' },
    select: { codigo: true }
  });
  if (!last) return 'AER001';
  const num = parseInt(last.codigo.replace('AER',''), 10) + 1;
  return 'AER' + num.toString().padStart(3,'0');
}

export async function generateFuncionarioId(): Promise<string> {
  const last = await prisma.funcionario.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true }
  });
  if (!last) return 'F001';
  const num = parseInt(last.id.replace('F',''), 10) + 1;
  return 'F' + num.toString().padStart(3,'0');
}
