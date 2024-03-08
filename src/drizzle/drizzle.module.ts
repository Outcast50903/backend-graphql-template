import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DrizzleProvider } from './drizzle.provider';

@Module({
  providers: [...DrizzleProvider, ConfigService],
})
export class DrizzleModule {}
