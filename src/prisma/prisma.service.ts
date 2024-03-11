import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { exists, paginate } from './prisma.extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  readonly extensions = this.$extends({
    model: {
      $allModels: {
        exists,
        paginate,
      },
    },
  });
}
