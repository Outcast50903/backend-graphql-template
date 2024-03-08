/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Config } from 'drizzle-kit';

export const uri = [
  'postgres://',
  process.env.POSTGRES_USER,
  ':',
  process.env.POSTGRES_PASSWORD,
  '@db.localtest.me:5432/',
  process.env.POSTGRES_DB,
  '?sslmode=require',
].join('');

export default {
  schema: './src/drizzle/schemas',
  out: './src/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      process.env.NODE_ENV === 'development' ? uri : process.env.DATABASE_URL!,
  },
} satisfies Config;
