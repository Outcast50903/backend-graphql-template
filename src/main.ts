import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import csrf from 'csurf';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(csrf({ cookie: true }));
  app.use(helmet());

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
