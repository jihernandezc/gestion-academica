import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, firstValueFrom as rxjsFirstValueFrom } from 'rxjs';

interface Course {
  id: number;
  name: string;
  maxStudents: number;
  description: string;
  category: string;
}

interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  finalGrade?: number;
  isAssigned: boolean;
}

interface Student {
  id: number;
  name: string;
  lastName: string;
}


@Injectable()
export class ApiService {
  constructor(
    @Inject('COURSES_SERVICE') private readonly coursesClient: ClientProxy,
    @Inject('ENROLLMENTS_SERVICE') private readonly enrollmentsClient: ClientProxy,
    @Inject('STUDENTS_SERVICE') private readonly studentsClient: ClientProxy
  ) {}

  async getAvailableCountByCourseId(courseId: number): Promise<number> {
    const maxStudents = await this.coursesClient.send<number>('get_max_students', courseId).toPromise();
    const assignedCount = await this.enrollmentsClient.send<number>('get_assigned_count_by_course', courseId).toPromise();

    return maxStudents - assignedCount;
  }

  async getAvailableCourses(): Promise<Course[]> {
    const courses = await rxjsFirstValueFrom(this.coursesClient.send<Course[]>('get_courses', {}));
    const availableCourses = await Promise.all(
      courses.map(async (course) => {
        const assignedCount = await rxjsFirstValueFrom(this.enrollmentsClient.send<number>('get_assigned_count_by_course', course.id));
        if (course.maxStudents > assignedCount) {
          return course;
        }
      })
    );
    return availableCourses.filter((course) => course !== undefined);
  }

  async getStudentCountByCourses(): Promise<{ name: string; estudiantes: number }[]> {
    console.log('Solicitando cursos al microservicio de cursos...');
    const courses = await rxjsFirstValueFrom(this.coursesClient.send<Course[]>('get_courses', {}));
    console.log('Cursos obtenidos:', courses);

    const coursePromises = courses.map(async (course) => {
      const studentCount = await rxjsFirstValueFrom(
        this.enrollmentsClient.send<number>('get_unique_student_count_by_course', course.id)
      );
      return { name: course.name, estudiantes: studentCount };
    });

    return Promise.all(coursePromises);
  }

  async findEnrollmentByStudent(name: string): Promise<Enrollment[]> {
    // Step 1: Get students by name
    const students = await rxjsFirstValueFrom(this.studentsClient.send<Student[]>('find_students_by_name', name));
    if (!students.length) {
      throw new NotFoundException(`No students found with name: ${name}`);
    }

    // Step 2: Get enrollments for each student
    const enrollmentPromises = students.map(async (student) => {
      return rxjsFirstValueFrom(this.enrollmentsClient.send<Enrollment[]>('get_enrollments_by_student_id', student.id));
    });

    // Step 3: Flatten the array of enrollments
    const enrollments = (await Promise.all(enrollmentPromises)).flat();

    return enrollments;
  }

  async findEnrollmentByCourse(name: string): Promise<Enrollment[]> {
    // Step 1: Get courses by name
    const courses = await rxjsFirstValueFrom(this.coursesClient.send<Course[]>('find_courses_by_name', name));
    if (!courses.length) {
      throw new NotFoundException(`No courses found with name: ${name}`);
    }

    // Step 2: Get enrollments for each course
    const enrollmentPromises = courses.map(async (course) => {
      return rxjsFirstValueFrom(this.enrollmentsClient.send<Enrollment[]>('get_enrollments_by_course_id', course.id));
    });

    // Step 3: Flatten the array of enrollments
    const enrollments = (await Promise.all(enrollmentPromises)).flat();

    return enrollments;
  }

}

