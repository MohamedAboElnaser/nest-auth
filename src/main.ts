import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: false, // Strict for creation
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //Add Cookie Parser
  app.use(cookieParser());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
