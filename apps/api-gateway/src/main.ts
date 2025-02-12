import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  app.enableCors({
    origin: 'http://localhost:5174',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Comunicación con microservicios a través de Redis
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: { host: 'redis', port: 6379 },
  });

  await app.startAllMicroservices();
  await app.listen(4000);
  console.log('API Gateway is running on port 4000 with Redis');
}

bootstrap();