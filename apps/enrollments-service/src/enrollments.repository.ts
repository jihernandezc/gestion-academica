import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Matricula } from './entities/matricula.entity';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Injectable()
export class MatriculaRepository {
  constructor(
    private readonly prisma: PrismaService
    ) {}

  async create(matricula: CreateMatriculaDto): Promise<Matricula> {
    return this.prisma.matricula.create({ data: matricula });
  }

  async findById(id: number): Promise<Matricula | null> {
    return this.prisma.matricula.findUnique({ where: { id } });
  }

  async findAll(): Promise<Matricula[]> {
    return this.prisma.matricula.findMany();
  }
  
  async update(id: number, data: UpdateMatriculaDto): Promise<Matricula> {
    return this.prisma.matricula.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.matricula.delete({ where: { id } });
  }

  async findByFilters(filters: Partial<Matricula>): Promise<Matricula[]> {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );
  
    return this.prisma.matricula.findMany({
      where: validFilters,
    });
  }
  
  }
  
