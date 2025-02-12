import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getAllStudents(): Promise<Student[]> {
    return this.prisma.student.findMany();
  }

  async getStudentById(id: number): Promise<Student> {
    return this.prisma.student.findUnique({ where: { id } });
  }

  async createStudent(data: CreateStudentDto): Promise<Student> {
    return this.prisma.student.create({ data });
  }

  async updateStudent(id: number, data: UpdateStudentDto): Promise<Student> {
    return this.prisma.student.update({ where: { id }, data });
  }

  async deleteStudent(id: number): Promise<Student> {
    return this.prisma.student.delete({ where: { id } });
  }

  async findStudentsByIds(ids: number[]): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async findStudentsByName(name: string): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        name: { contains: name }
      }
    });
  }
}