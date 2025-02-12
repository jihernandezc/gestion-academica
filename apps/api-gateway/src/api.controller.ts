import { Controller, Get, Inject, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
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
    @Inject('API_SERVICE') private readonly apiClient: ClientProxy,
  ) {}

  //Retorna todos los cursos
  @Get('courses')
  async getCourses() {
    return this.coursesClient.send('get_courses', {});
  }
  
  //Retorna los cursos por id
  @Get('courses/:id')
  async getCourseById(@Param('id') id: number) {
    return this.coursesClient.send('get_course', id);
  }
  
  //Recibe un JSON con la estructura minima de un curso(el json con los campos obligatorios) y crea el curso en BD
  @Post('courses')
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesClient.send('create_course', createCourseDto);
  }
  
  @Put('courses/update/:id')
  async updateCourse(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesClient.send('update_course', { id, data: updateCourseDto });
  }
  
  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: number) {
    return this.coursesClient.send('delete_course', id);
  }

  @Get('courses/search/:name')
  async findCoursesByName(@Param('name') name: string) {
    return this.coursesClient.send('find_courses_by_name', name);
  }

  // Metodos HTTP de matriculas desde el apigateway
  
  //Retorna todas las matriculas
  @Get('enrollments')
  async getEnrollments() {
    return this.enrollmentsClient.send('get_enrollments', {});
  }
  
  //Retorna la matricula por id
  @Get('enrollments/:id')
  async getEnrollmentById(@Param('id') id: number) {
    return this.enrollmentsClient.send('get_enrollment', id);
  }
  
  //Recibe un JSON con la estructura minima de una matricula(el json con los campos obligatorios) y crea la matricula en BD
  @Post('enrollments')
  async createEnrollment(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsClient.send('create_enrollment', createEnrollmentDto);
  }
  
  //Recibe por ruta un id y por body un json con los atributos a modificar de la matricula y esto cambiara el recurso en BD
  @Put('enrollments/update/:id')
  async updateEnrollment(@Param('id') id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentsClient.send('update_enrollment', { id: +id, data: updateEnrollmentDto });
  }
  
  //Recibe por la ruta el id del estudiante que se desea elimnar de la BD
  @Delete('enrollments/:id')
  async deleteEnrollment(@Param('id') id: string) {
    return this.enrollmentsClient.send('delete_enrollment', +id);
  }

  // Metodos HTTP de estudiantes desde el apigateway
  

  //Retorna todos los estudiantes
  @Get('students')
  async getStudents() {
    return this.studentsClient.send('get_students', {});
  }
  
  //Recibe una lista de ids separada por coma (/students/get/by-ids?ids=1,2,3,4) y retornara esos estudiantes en caso de estar en la BD
  @Get('/students/multiple/by-ids')
  async findStudentsByIds(@Query('ids') ids: string) {
    const idsArray = ids.split(',').map(id => parseInt(id, 10));
    return this.studentsClient.send('find_students_by_ids', idsArray);
  }
  //Recibe un id desde la ruta variable (students/1) debera retornar el estudiante con el id 1
  @Get('students/find/:id')
  async getStudentById(@Param('id') id: number) {
    return this.studentsClient.send('get_student', id);
  }
  
  //Recibe un JSON con la estructura minima de un estudiante(el json con los campos obligatorios) y crea el estudiante en BD
  @Post('students')
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsClient.send('create_student', createStudentDto);
  }

  //Recibe por ruta un id y por body un json con los atributos a modificar del estudiante y esto cambiara el recurso en BD
  @Put('students/update/:id')
  async updateStudent(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsClient.send('update_student', { id: +id, data: updateStudentDto });
  }

  //Recibe por la ruta el id del estudiante que se desea elimnar de la BD
  @Delete('students/:id')
  async deleteStudent(@Param('id') id: string) {
    return this.studentsClient.send('delete_student', +id);
  }

  @Get('courses/:id/available')
  async getAvailableCountByCourseId(@Param('id') courseId: number) {
    return this.apiClient.send('get_available_count_by_course', courseId);
  }

  @Get('students/search/:name')
  async findStudentsByNameOrLastName(@Param('name') name: string) {
    return this.studentsClient.send('find_students_by_name', name);
  }
}