import { Injectable, NotFoundException } from '@nestjs/common';
import { MatriculaRepository } from './enrollments.repository';
import { Matricula } from './entities/matricula.entity';
import { CreateMatriculaDto } from './dto/create-enrollment.dto';
import { UpdateMatriculaDto } from './dto/update-enrollment.dto';
import { FilterMatriculaCupoDto, FilterMatriculaEstudianteDto, FilterMatriculaMateriaDto } from 'dist/dto/filter-enrollment.dto';

@Injectable()
export class MatriculaService {
  constructor(private readonly matriculaRepository: MatriculaRepository) {}

  async create(createMatriculaDto: CreateMatriculaDto): Promise<Matricula> {
    return this.matriculaRepository.create(createMatriculaDto);
  }

  async findById(id: number): Promise<Matricula> {
    const matricula = await this.matriculaRepository.findById(id);
    if (!matricula) {
      throw new NotFoundException(`Matrícula con id ${id} no encontrada`);
    }
    return matricula;
  }

  async findAll(): Promise<Matricula[]> {
    return this.matriculaRepository.findAll();
  }

  async update(id: number, updateMatriculaDto: UpdateMatriculaDto): Promise<Matricula> {
    await this.findById(id); // Verifica si existe antes de actualizar
    return this.matriculaRepository.update(id, updateMatriculaDto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica si existe antes de eliminar
    return this.matriculaRepository.delete(id);
  }

  async findByFilter(filters:FilterMatriculaEstudianteDto | FilterMatriculaMateriaDto | FilterMatriculaCupoDto): Promise<Matricula[]> {
    return this.matriculaRepository.findByFilters(filters);
  }

}
