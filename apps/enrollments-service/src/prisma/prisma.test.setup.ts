import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { main as seedDatabase } from './seed';

let prisma: Readonly<PrismaService>;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [PrismaService],
  }).compile();

  prisma = module.get<PrismaService>(PrismaService);
  await prisma.onModuleInit(); // Conecta Prisma
  await seedDatabase(); // Ejecuta el seed antes de los tests
});

afterAll(async () => {
  await prisma.onModuleDestroy(); // Desconecta Prisma
});

export { prisma };

