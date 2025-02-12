import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from '@prisma/client';

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @MessagePattern('get_enrollments')
  getAllEnrollments(): Promise<Enrollment[]> {
    return this.enrollmentsService.getAllEnrollments();
  }

  @MessagePattern('get_enrollment')
  getEnrollmentById(@Payload() id: number): Promise<Enrollment> {
    return this.enrollmentsService.getEnrollmentById(id);
  }

  @MessagePattern('create_enrollment')
  createEnrollment(@Payload() data: CreateEnrollmentDto): Promise<Enrollment> {
    return this.enrollmentsService.createEnrollment(data);
  }

  @MessagePattern('update_enrollment')
  updateEnrollment(@Payload() { id, data }: { id: number; data: UpdateEnrollmentDto }): Promise<Enrollment> {
    return this.enrollmentsService.updateEnrollment(id, data);
  }

  @MessagePattern('delete_enrollment')
  deleteEnrollment(@Payload() id: number): Promise<Enrollment> {
    return this.enrollmentsService.deleteEnrollment(id);
  }

  @MessagePattern('get_grades_by_student')
  getGradesByStudentId(@Payload() studentId: number): Promise<{ courseId: number, finalGrade: number }[]> {
    return this.enrollmentsService.getGradesByStudentId(studentId);
  }

  @MessagePattern('get_grade_by_student_and_course')
  getGradeByStudentIdAndCourseId(@Payload() { studentId, courseId }: { studentId: number, courseId: number }): Promise<{ courseId: number, finalGrade: number } | string> {
    return this.enrollmentsService.getGradeByStudentIdAndCourseId(studentId, courseId);
  }

  @MessagePattern('get_assigned_courses_by_student')
  getAssignedCoursesByStudentId(@Payload() studentId: number): Promise<number[]> {
    return this.enrollmentsService.getAssignedCoursesByStudentId(studentId);
  }

  @MessagePattern('get_unassigned_courses_by_student')
  getUnassignedCoursesByStudentId(@Payload() studentId: number): Promise<number[]> {
    return this.enrollmentsService.getUnassignedCoursesByStudentId(studentId);
  }

  @MessagePattern('get_average_grade_by_student')
  getAverageGradeByStudentId(@Payload() studentId: number): Promise<number> { 
    return this.enrollmentsService.getAverageGradeByStudentId(studentId);
  }

  @MessagePattern('ger_average_grade_by_course')
  getAverageGradeByCourseId(@Payload() courseId: number): Promise<number> {
    return this.enrollmentsService.getAverageGradeByCourseId(courseId);
  }

  @MessagePattern('get_assisgned_count_by_course_id')
  getAssignedStudentsCountByCourseId(@Payload() courseId: number): Promise<number> {
    return this.enrollmentsService.getAssignedCountByCourseId(courseId);
  }

  @MessagePattern('get_assigned_count_by_courses') 
  getAssignedStudentsCountByCourses(): Promise<{ courseId: number, assignedCount: number }[]> {
    return this.enrollmentsService.getAssignedCountByCourses();
  }

  @MessagePattern('get_unique_student_count_by_course')
  getUniqueStudentCountByCourse(@Payload() courseId: number): Promise<number> {
    return this.enrollmentsService.getUniqueStudentCountByCourseId(courseId);
}

}