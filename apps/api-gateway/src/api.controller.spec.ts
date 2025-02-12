import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ClientProxy } from '@nestjs/microservices';

// Creamos mocks para los servicios de microservicios
const mockClientProxy = () => ({
  send: jest.fn()
});

describe('ApiController', () => {
  let controller: ApiController;
  let coursesClient: ClientProxy;
  let enrollmentsClient: ClientProxy;
  let studentsClient: ClientProxy;
  let apiClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        { provide: 'COURSES_SERVICE', useFactory: mockClientProxy },
        { provide: 'ENROLLMENTS_SERVICE', useFactory: mockClientProxy },
        { provide: 'STUDENTS_SERVICE', useFactory: mockClientProxy },
        { provide: 'API_SERVICE', useFactory: mockClientProxy },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    coursesClient = module.get<ClientProxy>('COURSES_SERVICE');
    enrollmentsClient = module.get<ClientProxy>('ENROLLMENTS_SERVICE');
    studentsClient = module.get<ClientProxy>('STUDENTS_SERVICE');
    apiClient = module.get<ClientProxy>('API_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Courses', () => {
    it('should call getCourses', async () => {
      await controller.getCourses();
      expect(coursesClient.send).toHaveBeenCalledWith('get_courses', {});
    });

    it('should call getCourseById', async () => {
      await controller.getCourseById(1);
      expect(coursesClient.send).toHaveBeenCalledWith('get_course', 1);
    });

    it('should call createCourse', async () => {
      const dto = { name: 'Test Course', maxStudents: 50, category: "Optativa" };
      await controller.createCourse(dto);
      expect(coursesClient.send).toHaveBeenCalledWith('create_course', dto);
    });

    it('should call updateCourse', async () => {
      const dto = { name: 'Updated Course' };
      await controller.updateCourse(1, dto);
      expect(coursesClient.send).toHaveBeenCalledWith('update_course', { id: 1, data: dto });
    });

    it('should call deleteCourse', async () => {
      await controller.deleteCourse(1);
      expect(coursesClient.send).toHaveBeenCalledWith('delete_course', 1);
    });
  });

  describe('Enrollments', () => {
    it('should call getEnrollments', async () => {
      await controller.getEnrollments();
      expect(enrollmentsClient.send).toHaveBeenCalledWith('get_enrollments', {});
    });

    it('should call getEnrollmentById', async () => {
      await controller.getEnrollmentById(1);
      expect(enrollmentsClient.send).toHaveBeenCalledWith('get_enrollment', 1);
    });

    it('should call createEnrollment', async () => {
      const dto = { studentId: 1, courseId: 1 };
      await controller.createEnrollment(dto);
      expect(enrollmentsClient.send).toHaveBeenCalledWith('create_enrollment', dto);
    });

    it('should call updateEnrollment', async () => {
      const dto = { status: 'completed' };
      await controller.updateEnrollment(1, dto);
      expect(enrollmentsClient.send).toHaveBeenCalledWith('update_enrollment', { id: 1, data: dto });
    });

    it('should call deleteEnrollment', async () => {
      await controller.deleteEnrollment(1);
      expect(enrollmentsClient.send).toHaveBeenCalledWith('delete_enrollment', 1);
    });
  });

  describe('Students', () => {
    it('should call getStudents', async () => {
      await controller.getStudents();
      expect(studentsClient.send).toHaveBeenCalledWith('get_students', {});
    });

    it('should call getStudentById', async () => {
      await controller.getStudentById(1);
      expect(studentsClient.send).toHaveBeenCalledWith('get_student', 1);
    });

    it('should call findStudentsByIds', async () => {
      await controller.findStudentsByIds('1,2,3');
      expect(studentsClient.send).toHaveBeenCalledWith('find_students_by_ids', [1, 2, 3]);
    });

    it('should call createStudent', async () => {
      const dto = { name: 'John' , lastName: "Doe", email: "example@dto.com", career: "ingenieria"};
      await controller.createStudent(dto);
      expect(studentsClient.send).toHaveBeenCalledWith('create_student', dto);
    });

    it('should call updateStudent', async () => {
      const dto = { name: 'Updated Name' };
      await controller.updateStudent(1, dto);
      expect(studentsClient.send).toHaveBeenCalledWith('update_student', { id: 1, data: dto });
    });

    it('should call deleteStudent', async () => {
      await controller.deleteStudent(1);
      expect(studentsClient.send).toHaveBeenCalledWith('delete_student', 1);
    });
  });

  describe('API Service', () => {
    it('should call getAvailableCountByCourseId', async () => {
      await controller.getAvailableCountByCourseId(1);
      expect(apiClient.send).toHaveBeenCalledWith('get_available_count_by_course', 1);
    });
  });
});
