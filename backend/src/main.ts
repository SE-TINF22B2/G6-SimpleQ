import { NestFactory } from '@nestjs/core';
import * as sdk from '@ory/client';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL, methods: ['*'], credentials: true });
  global.ory = new sdk.FrontendApi(
    new sdk.Configuration({
      basePath:
        process.env.ORY_URL || 'https://playground.projects.oryapis.com',
    }),
  );

  await app.listen(3000);
}
bootstrap();
