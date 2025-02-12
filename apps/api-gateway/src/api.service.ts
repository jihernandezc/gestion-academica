import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, firstValueFrom as rxjsFirstValueFrom } from 'rxjs';

interface Course {
  id: number;
  maxStudents: number;
  description: string;
  category: string;
}

@Injectable()
export class ApiService {
  constructor(
    @Inject('COURSES_SERVICE') private readonly coursesClient: ClientProxy,
    @Inject('ENROLLMENTS_SERVICE') private readonly enrollmentsClient: ClientProxy
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
}

