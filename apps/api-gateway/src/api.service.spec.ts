import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('ApiController', () => {
  let apiController: ApiController;
  let coursesClient: ClientProxy;
  let enrollmentsClient: ClientProxy;
  let studentsClient: ClientProxy;
  let apiClient: ClientProxy;

  beforeEach(async () => {
    coursesClient = { send: jest.fn() } as any;
    enrollmentsClient = { send: jest.fn() } as any;
    studentsClient = { send: jest.fn() } as any;
    apiClient = { send: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        ApiService,
        { provide: 'COURSES_SERVICE', useValue: coursesClient },
        { provide: 'ENROLLMENTS_SERVICE', useValue: enrollmentsClient },
        { provide: 'STUDENTS_SERVICE', useValue: studentsClient },
        { provide: 'API_SERVICE', useValue: apiClient },
      ],
    }).compile();

    apiController = module.get<ApiController>(ApiController);
  });

  it('should return all courses', async () => {
    jest.spyOn(coursesClient, 'send').mockReturnValue(of([{ id: 1, name: 'Course 1' }]));
    await expect(apiController.getCourses()).resolves.toEqual([{ id: 1, name: 'Course 1' }]);
  });

  it('should return course by ID', async () => {
    jest.spyOn(coursesClient, 'send').mockReturnValue(of({ id: 1, name: 'Course 1' }));
    await expect(apiController.getCourseById(1)).resolves.toEqual({ id: 1, name: 'Course 1' });
  });

  it('should create a course', async () => {
    const dto = { name: 'New Course', maxStudents: 50, category: "Optativa" };
    jest.spyOn(coursesClient, 'send').mockReturnValue(of(dto));
    await expect(apiController.createCourse(dto)).resolves.toEqual(dto);
  });

  it('should delete a course', async () => {
    jest.spyOn(coursesClient, 'send').mockReturnValue(of({ success: true }));
    await expect(apiController.deleteCourse(1)).resolves.toEqual({ success: true });
  });

  it('should get available count for a course', async () => {
    jest.spyOn(apiClient, 'send').mockReturnValue(of(10));
    await expect(apiController.getAvailableCountByCourseId(1)).resolves.toEqual(10);
  });
});

describe('ApiService', () => {
  let apiService: ApiService;
  let coursesClient: ClientProxy;
  let enrollmentsClient: ClientProxy;

  beforeEach(async () => {
    coursesClient = { send: jest.fn() } as any;
    enrollmentsClient = { send: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        { provide: 'COURSES_SERVICE', useValue: coursesClient },
        { provide: 'ENROLLMENTS_SERVICE', useValue: enrollmentsClient },
      ],
    }).compile();

    apiService = module.get<ApiService>(ApiService);
  });

  it('should return available count by course ID', async () => {
    jest.spyOn(coursesClient, 'send').mockReturnValue(of(30));
    jest.spyOn(enrollmentsClient, 'send').mockReturnValue(of(20));
    await expect(apiService.getAvailableCountByCourseId(1)).resolves.toEqual(10);
  });
});
