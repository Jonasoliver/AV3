import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '3306', 10),
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbDatabase: process.env.DB_DATABASE || 'aeronaves_db',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  bootstrapAdminUser: process.env.auth_bootstrap_admin_user || 'admin',
  bootstrapAdminPass: process.env.auth_bootstrap_admin_pass || 'admin123'
};
