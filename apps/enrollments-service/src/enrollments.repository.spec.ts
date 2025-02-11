import { Test, TestingModule } from '@nestjs/testing';
import { MatriculaRepository } from './enrollments.repository';
import { PrismaService } from './prisma/prisma.service';
import { prisma } from './prisma/prisma.test.setup';

describe('MatriculaRepository', () => {
  let repository: MatriculaRepository;
  const testId = 1;
  const testEstudianteId = 1;
  const testMateriaId = 1;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatriculaRepository, { provide: PrismaService, useValue: prisma }],
    }).compile();

    repository = module.get<MatriculaRepository>(MatriculaRepository);
  });

  describe('CRUD de Matrícula', () => {
    it('debería definir el repositorio', () => {
      expect(repository).toBeDefined();
    });

    it('debería crear una matrícula correctamente', async () => {
      const matricula = {
        id_estudiante: testEstudianteId,
        id_materia: testMateriaId,
        semestre: "2025-1",
        cupo_asignado: true,
      };

      const result = await repository.create(matricula);

      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(expect.objectContaining(matricula));
    });

    it('debería encontrar una matrícula por ID', async () => {
      const result = await repository.findById(testId);

      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('id', testId);
    });

    it('debería retornar todas las matrículas', async () => {
      const result = await repository.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result).not.toHaveLength(0);
      expect(result[0]).toHaveProperty('id');
    });

    it('debería actualizar una matrícula correctamente', async () => {
      const updateData = { cupo_asignado: false };

      const result = await repository.update(testId, updateData);

      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('cupo_asignado', updateData.cupo_asignado);
    });

    it('debería eliminar una matrícula correctamente', async () => {
      await repository.delete(testId);
      const result = await repository.findById(testId);
      expect(result).toBeNull();
    });

    describe('Buscar matriculas por críterio', () => {
      it('debería encontrar matrículas según los filtros proporcionados', async () => {
        const filters = {id: 2, id_estudiante: 2, id_materia:2, semestre: '2024-2', nota_final: 1.5, cupo_asignado: true };
      
        const result = await repository.findByFilters(filters);
  
        expect(result).toBeInstanceOf(Array);
        expect(result).not.toHaveLength(0);
        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining(filters),
          ])
        );
      });
    });

  });
  
  
});
