import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { EnrollmentsModule } from './enrollments.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EnrollmentsModule, {
    transport: Transport.REDIS,
    options: {
      host: 'redis',
      port: 6379,
    },
  });

  // Configura el ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas en el DTO
      transform: true, // Transforma los datos a los tipos especificados en el DTO
    }),
  );

  // Configura el contenedor de validación para usar el contenedor de NestJS
  useContainer(app.select(EnrollmentsModule), { fallbackOnErrors: true });

  await app.listen();
  console.log('📝 Enrollments Service is running with Redis');
}

bootstrap();