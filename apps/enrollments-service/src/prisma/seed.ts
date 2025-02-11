import { PrismaService } from '../prisma/prisma.service';

async function seedDatabase(prisma: PrismaService) {
  await prisma.$executeRaw`DELETE FROM matricula`;
  await prisma.$executeRaw`ALTER SEQUENCE matricula_id_seq RESTART WITH 1`;

  const data = [
    {
      id_estudiante: 1,
      id_materia: 1,
      semestre: '2024-1',
      nota_final: 4.5,
      cupo_asignado: true,
    },
    {
      id_estudiante: 2,
      id_materia: 2,
      semestre: '2024-2',
      nota_final: 1.5,
      cupo_asignado: true,
    },
    {
      id_estudiante: 3,
      id_materia: 1,
      semestre: '2024-1',
      nota_final: 2.9,
      cupo_asignado: true,
    },
    {
      id_estudiante: 4,
      id_materia: 2,
      semestre: '2024-1',
      cupo_asignado: false,
    },
  ];

  await prisma.matricula.createMany({ data });
}

async function main() {
  const prisma = new PrismaService();
  
  try {
    await seedDatabase(prisma);
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
    console.error('Detalles:', JSON.stringify(error, null, 2));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { main };