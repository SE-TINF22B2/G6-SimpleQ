import { NestFactory } from '@nestjs/core';
import * as sdk from '@ory/client';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const ory = new sdk.FrontendApi(
    new sdk.Configuration({
      basePath:
        process.env.ORY_URL || 'https://playground.projects.oryapis.com',
    }),
  );
  global.ory = ory;

  await app.listen(3000);
}
bootstrap();
