import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from '@prisma/client';

@Controller()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @MessagePattern('get_students')
  getAllStudents(): Promise<Student[]> {
    return this.studentsService.getAllStudents();
  }

  @MessagePattern('get_student')
  getStudentById(@Payload() id: number): Promise<Student> {
    return this.studentsService.getStudentById(id);
  }

  @MessagePattern('create_student')
  createStudent(@Payload() data: CreateStudentDto): Promise<Student> {
    return this.studentsService.createStudent(data);
  }

  @MessagePattern('update_student')
  updateStudent(@Payload() { id, data }: { id: number; data: UpdateStudentDto }): Promise<Student> {
    return this.studentsService.updateStudent(id, data);
  }

  @MessagePattern('delete_student')
  deleteStudent(@Payload() id: number): Promise<Student> {
    return this.studentsService.deleteStudent(id);
  }


  @MessagePattern('find_students_by_ids')
  findStudentsByIds(@Payload() ids: number[]): Promise<Student[]> {
    return this.studentsService.findStudentsByIds(ids);
  }
}