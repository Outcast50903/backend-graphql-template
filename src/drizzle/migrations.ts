import { neon, neonConfig } from '@neondatabase/serverless';
import { Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

import { uri } from '../../drizzle.config';

const runMigrate = async () => {
  Logger.debug('⏳ Loading database configuration...');

  const connectionString =
    process.env.NODE_ENV === 'development'
      ? uri
      : process.env.DATABASE_URL ?? '';

  Logger.debug('⏳ connectionString:', connectionString);

  neonConfig.fetchEndpoint = (host) => {
    const protocol = host === 'db.localtest.me' ? 'http' : 'https';
    const port = host === 'db.localtest.me' ? 4444 : 443;
    return `${protocol}://${host}:${port}/sql`;
  };

  neonConfig.fetchConnectionCache = true;

  Logger.debug('⏳ Connecting to database...');
  const sql = neon(connectionString);

  Logger.debug('⏳ Creating database client...');
  const db = drizzle(sql);

  Logger.debug('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'src/lib/db/migrations' });

  const end = Date.now();

  Logger.debug('✅ Migrations completed in', end - start, 'ms');

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
