import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getGradesByStudentId(studentId: number): Promise<{ courseId: number, finalGrade: number }[]> {
    return this.prisma.enrollment.findMany({
      where: { studentId, isAssigned: true },
      select: { courseId: true, finalGrade: true }
    });
  }

  async getGradeByStudentIdAndCourseId(
    studentId: number,
    courseId: number
  ): Promise<{ courseId: number; finalGrade: number } | string> {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { studentId, courseId },
      select: { courseId: true, finalGrade: true, isAssigned: true },
    });
  
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
  
    if (!enrollment.isAssigned) {
      return 'El estudiante no está inscrito en este curso';
    }
  
    return { courseId: enrollment.courseId, finalGrade: enrollment.finalGrade! };
  }

  async getAverageGradeByStudentId(studentId: number): Promise<number> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId, isAssigned: true },
      select: { finalGrade: true }
    });

    const totalGrades = enrollments.reduce((acc, enrollment) => acc + enrollment.finalGrade!, 0);
    return totalGrades / enrollments.length;
  }

  async getAverageGradeByCourseId(courseId: number): Promise<number> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId, isAssigned: true },
      select: { finalGrade: true }
    });

    const totalGrades = enrollments.reduce((acc, enrollment) => acc + enrollment.finalGrade!, 0);
    return totalGrades / enrollments.length;
  }

  async getAssignedCoursesByStudentId(studentId: number): Promise<number[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId, isAssigned: true },
      select: { courseId: true }
    });

    return enrollments.map(enrollment => enrollment.courseId);
  }

  async getUnassignedCoursesByStudentId(studentId: number): Promise<number[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId, isAssigned: false },
      select: { courseId: true }
    });

    return enrollments.map(enrollment => enrollment.courseId);
  }

  async getAssignedCountByCourseId(courseId: number): Promise<number> {
    return this.prisma.enrollment.count({
      where: { courseId, isAssigned: false }
    });
  }

  async getAssignedCountByCourses(): Promise<{ courseId: number; count: number }[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { isAssigned: true },
      select: { courseId: true }
    });

    const courses = Array.from(new Set(enrollments.map(enrollment => enrollment.courseId)));
    const assignedCount = courses.map(courseId => ({
      courseId,
      count: enrollments.filter(enrollment => enrollment.courseId === courseId).length
    }));

    return assignedCount;
  }

  async getUnAssignedCountByCourses(): Promise<{ courseId: number; count: number }[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { isAssigned: false },
      select: { courseId: true }
    });

    const courses = Array.from(new Set(enrollments.map(enrollment => enrollment.courseId)));
    const unAssignedCount = courses.map(courseId => ({
      courseId,
      count: enrollments.filter(enrollment => enrollment.courseId === courseId).length
    }));

    return unAssignedCount;
  }


  async getUniqueStudentCountByCourseId(courseId: number): Promise<number> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
      select: { studentId: true }
    });
  
    const uniqueStudents = new Set(enrollments.map(e => e.studentId));
    return uniqueStudents.size;
  }
  
}