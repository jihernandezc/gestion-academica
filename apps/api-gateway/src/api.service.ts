import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

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
}
