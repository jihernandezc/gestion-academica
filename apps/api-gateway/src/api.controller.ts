import { Controller, Get, Inject, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller()
export class ApiController {
  constructor(
    @Inject('COURSES_SERVICE') private readonly coursesClient: ClientProxy,
    @Inject('ENROLLMENTS_SERVICE') private readonly enrollmentsClient: ClientProxy,
    @Inject('STUDENTS_SERVICE') private readonly studentsClient: ClientProxy,
  ) {}

  @Get()
  getRoot(): string {
    return 'API Gateway is working!';
  }

  @Get('hello')
  getHello(): string {
    return 'API Gateway says hello!';
  }

  @Get('courses')
  async getCourses() {
    return this.coursesClient.send('get_courses', {});
  }

  @Get('courses/:id')
  async getCourseById(@Param('id') id: number) {
    return this.coursesClient.send('get_course', id);
  }

  @Post('courses')
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesClient.send('create_course', createCourseDto);
  }

  @Put('courses/:id')
  async updateCourse(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesClient.send('update_course', { id, data: updateCourseDto });
  }

  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: number) {
    return this.coursesClient.send('delete_course', id);
  }

  @Get('enrollments')
  async getEnrollments() {
    return this.enrollmentsClient.send('get_enrollments', {});
  }

  @Get('enrollments/:id')
  async getEnrollmentById(@Param('id') id: number) {
    return this.enrollmentsClient.send('get_enrollment', id);
  }

  @Post('enrollments')
  async createEnrollment(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsClient.send('create_enrollment', createEnrollmentDto);
  }

  @Put('enrollments/:id')
  async updateEnrollment(@Param('id') id: number, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentsClient.send('update_enrollment', { id, data: updateEnrollmentDto });
  }

  @Delete('enrollments/:id')
  async deleteEnrollment(@Param('id') id: number) {
    return this.enrollmentsClient.send('delete_enrollment', id);
  }

  @Get('students')
  async getStudents() {
    return this.studentsClient.send('get_students', {});
  }

  @Get('students/:id')
  async getStudentById(@Param('id') id: number) {
    return this.studentsClient.send('get_student', id);
  }

  @Post('students')
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsClient.send('create_student', createStudentDto);
  }

  @Put('students/:id')
  async updateStudent(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsClient.send('update_student', { id, data: updateStudentDto });
  }

  @Delete('students/:id')
  async deleteStudent(@Param('id') id: number) {
    return this.studentsClient.send('delete_student', id);
  }

  @Get('prueba/students/hello')
  async getStudentsHello() {
    return this.studentsClient.send('hello', {});
  }
}