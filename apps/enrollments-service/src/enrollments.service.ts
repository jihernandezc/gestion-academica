import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async getAllEnrollments(): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany();
  }

  async getEnrollmentById(id: number): Promise<Enrollment> {
    return this.prisma.enrollment.findUnique({ where: { id } });
  }

  async createEnrollment(data: CreateEnrollmentDto): Promise<Enrollment> {
    return this.prisma.enrollment.create({ data });
  }

  async updateEnrollment(id: number, data: UpdateEnrollmentDto): Promise<Enrollment> {
    return this.prisma.enrollment.update({ where: { id }, data });
  }

  async deleteEnrollment(id: number): Promise<Enrollment> {
    return this.prisma.enrollment.delete({ where: { id } });
  }
}