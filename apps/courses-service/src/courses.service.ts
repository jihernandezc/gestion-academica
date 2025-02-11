import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses(): Promise<Course[]> {
    return this.prisma.course.findMany();
  }

  async getCourseById(id: number): Promise<Course> {
    return this.prisma.course.findUnique({ where: { id } });
  }

  async createCourse(data: CreateCourseDto): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  async updateCourse(id: number, data: UpdateCourseDto): Promise<Course> {
    return this.prisma.course.update({ where: { id }, data });
  }

  async deleteCourse(id: number): Promise<Course> {
    return this.prisma.course.delete({ where: { id } });
  }
}