import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  await app.listen(process.env.SERVER_PORT ?? 3001);
  logger.log(`Application listening at ${await app.getUrl()}`);
};

bootstrap();
