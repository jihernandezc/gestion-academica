import { Test, TestingModule } from '@nestjs/testing';
import { MatriculaRepository } from './enrollments.repository';
import { NotFoundException } from '@nestjs/common';
import { MatriculaService } from './enrollments.service';
import { CreateMatriculaDto } from './dto/create-enrollment.dto';
import { UpdateMatriculaDto } from './dto/update-enrollment.dto';

describe('MatriculaService', () => {
  let service: MatriculaService;
  let repository: MatriculaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatriculaService,
        {
          provide: MatriculaRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByFilters: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatriculaService>(MatriculaService);
    repository = module.get<MatriculaRepository>(MatriculaRepository);
  });

  it('debería crear una matrícula', async () => {
    const dto: CreateMatriculaDto = { id_estudiante: 1, id_materia: 2, semestre: '2024-1' };
    const expectedResult = { id: 1, ...dto };
    jest.spyOn(repository, 'create').mockResolvedValue(expectedResult);

    const result = await service.create(dto);

    expect(result).toEqual(expectedResult);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('debería encontrar una matrícula por ID', async () => {
    const id = 1;
    const expectedMatricula = { id, id_estudiante: 1, id_materia: 2, semestre: '2024-1' };
    jest.spyOn(repository, 'findById').mockResolvedValue(expectedMatricula);

    const result = await service.findById(id);

    expect(result).toEqual(expectedMatricula);
    expect(repository.findById).toHaveBeenCalledWith(id);
  });

  it('debería lanzar NotFoundException si la matrícula no existe', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(service.findById(999)).rejects.toThrow(NotFoundException);
  });

  it('debería retornar todas las matrículas', async () => {
    const expectedMatriculas = [
      { id: 1, id_estudiante: 1, id_materia: 2, semestre: '2024-1' },
      { id: 2, id_estudiante: 3, id_materia: 4, semestre: '2024-2' },
    ];
    jest.spyOn(repository, 'findAll').mockResolvedValue(expectedMatriculas);

    const result = await service.findAll();

    expect(result).toEqual(expectedMatriculas);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('debería actualizar una matrícula', async () => {
    const id = 1;
    const updateDto: UpdateMatriculaDto = { semestre: '2025-1' };
    const existingMatricula = { id, id_estudiante: 1, id_materia: 2, semestre: '2024-1' };
    const updatedMatricula = { ...existingMatricula, ...updateDto };

    jest.spyOn(repository, 'findById').mockResolvedValue(existingMatricula);
    jest.spyOn(repository, 'update').mockResolvedValue(updatedMatricula);

    const result = await service.update(id, updateDto);

    expect(result).toEqual(updatedMatricula);
    expect(repository.update).toHaveBeenCalledWith(id, updateDto);
  });

  it('debería lanzar NotFoundException al actualizar una matrícula inexistente', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(service.update(999, { semestre: '2025-1' })).rejects.toThrow(NotFoundException);
  });

  it('debería eliminar una matrícula', async () => {
    const id = 1;
    jest.spyOn(repository, 'findById').mockResolvedValue({ id });
    jest.spyOn(repository, 'delete').mockResolvedValue();

    await service.delete(id);

    expect(repository.findById).toHaveBeenCalledWith(id);
    expect(repository.delete).toHaveBeenCalledWith(id);
  });

  it('debería lanzar NotFoundException al eliminar una matrícula inexistente', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
  });

  it('debería filtrar matrículas por criterios', async () => {
    const filters = { id_estudiante: 1, semestre: '2024-1' };
    const expectedMatriculas = [
      { id: 1, id_estudiante: 1, id_materia: 2, semestre: '2024-1' },
    ];
    jest.spyOn(repository, 'findByFilters').mockResolvedValue(expectedMatriculas);

    const result = await service.findByIdEstudiante(filters);

    expect(result).toEqual(expectedMatriculas);
    expect(repository.findByFilters).toHaveBeenCalledWith(filters);
  });
});
