import { createPool, Pool } from 'mysql2/promise';
import { env } from '../config/env';

let pool: Pool;

export function getPool(): Pool {
  if (!pool) {
    pool = createPool({
      host: env.dbHost,
      port: env.dbPort,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbDatabase,
      connectionLimit: 10,
      namedPlaceholders: true
    });
  }
  return pool;
}
