import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new Error(JSON.stringify(formattedErrors)); // This is a bad practice,
        // but it serves as an example of how to format errors.
        // In production, consider using a more structured error response.
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
