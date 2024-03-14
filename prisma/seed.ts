import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const main = async () =>
  await prisma.user.upsert({
    where: { id: randomUUID() },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      fullName: 'Admin',
      isEnabled: true,
      roles: ['ADMIN'],
      createdAt: new Date(),
    },
  });

process.env.NODE_ENV === 'development' &&
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
