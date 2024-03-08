import { neon, neonConfig } from '@neondatabase/serverless';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/neon-http';

import { uri } from '../../drizzle.config';

export const DrizzleAsyncProviderConst = 'drizzle-provider-async';

export const DrizzleProvider = [
  {
    provide: DrizzleAsyncProviderConst,
    inject: [ConfigService],
    useFactory: async () => {
      neonConfig.fetchEndpoint = (host) => {
        const protocol = host === 'db.localtest.me' ? 'http' : 'https';
        const port = host === 'db.localtest.me' ? 4444 : 443;
        return `${protocol}://${host}:${port}/sql`;
      };

      neonConfig.fetchConnectionCache = true;

      const sql = neon(
        process.env.NODE_ENV === 'development'
          ? uri
          : process.env.DATABASE_URL ?? '',
      );
      return drizzle(sql);
    },
    exports: [DrizzleAsyncProviderConst],
  },
];
