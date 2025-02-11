import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { main as seedDatabase } from '../prisma/seed';


describe('Matricula Seeder', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    await prisma.matricula.deleteMany(); // Limpiar la tabla antes de insertar
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Debe ejecutar el seed y verificar los datos insertados', async () => {
    await seedDatabase(); // Ejecutar el seeder

    const count = await prisma.matricula.count();
    expect(count).toBeGreaterThan(0);

    const matricula = await prisma.matricula.findFirst();
    expect(matricula).toBeDefined();
  });
});

