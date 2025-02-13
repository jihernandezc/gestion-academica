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
    console.log('getCourseById llamado con ID:', id);
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
  getMaxStudentsByCourses(@Payload() courseId : number): Promise<number> {
    return this.coursesService.getMaxStudentsByCourses(courseId);
  }

  @MessagePattern('find_courses_by_name')
  findCoursesByName(@Payload() name: string): Promise<Course[]> {
    return this.coursesService.findCoursesByName(name);
  }

  @MessagePattern('get_courses_by_ids')
async getCoursesByIds(@Payload() ids: number[]): Promise<{ id: number, name: string }[]> {
  const courses = await this.coursesService.getCoursesByIds(ids);
  return courses.map(course => ({ id: course.id, name: course.name }));
}
  
}