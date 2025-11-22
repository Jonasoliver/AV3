import fs from 'fs';
import path from 'path';

export function ensureDirs() {
  const reports = path.resolve(process.cwd(), 'reports');
  if (!fs.existsSync(reports)) fs.mkdirSync(reports, { recursive: true });
}
