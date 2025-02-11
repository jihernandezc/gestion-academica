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
}