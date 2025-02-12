import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from '@prisma/client';

@Controller()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @MessagePattern('get_courses')
  getAllCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }

  @MessagePattern('get_course')
  getCourseById(@Payload() id: number): Promise<Course> {
    return this.coursesService.getCourseById(id);
  }

  @MessagePattern('create_course')
  createCourse(@Payload() data: CreateCourseDto): Promise<Course> {
    return this.coursesService.createCourse(data);
  }

  @MessagePattern('update_course')
  updateCourse(@Payload() { id, data }: { id: number; data: UpdateCourseDto }): Promise<Course> {
    return this.coursesService.updateCourse(id, data);
  }

  @MessagePattern('delete_course')
  deleteCourse(@Payload() id: number): Promise<Course> {
    return this.coursesService.deleteCourse(id);
  }

  @MessagePattern('get_max_students')
  getMaxStudents(@Payload() courseId: number): Promise<number> {
    return this.coursesService.getMaxStudents(courseId);
  }
  
}