import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

// Creamos un mock de la clase CoursesService
const mockCoursesService = {
  getAllCourses: jest.fn(),
  getCourseById: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
  getMaxStudents: jest.fn(),
};

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        { 
          provide: CoursesService, 
          useValue: mockCoursesService 
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getAllCourses', async () => {
    const result = [{ id: 1, name: 'Course 1', description: 'Course description' }];
    mockCoursesService.getAllCourses.mockResolvedValue(result);

    expect(await controller.getAllCourses()).toBe(result);
    expect(mockCoursesService.getAllCourses).toHaveBeenCalled();
  });

  it('should call getCourseById', async () => {
    const result = { id: 1, name: 'Course 1', description: 'Course description' };
    const id = 1;
    mockCoursesService.getCourseById.mockResolvedValue(result);

    expect(await controller.getCourseById(id)).toBe(result);
    expect(mockCoursesService.getCourseById).toHaveBeenCalledWith(id);
  });

  it('should call createCourse', async () => {
    const createCourseDto: CreateCourseDto = { name: 'New Course', maxStudents: 50, category: "Optativa"};
    const result = { id: 1, name: 'New Course', description: 'Description' };
    mockCoursesService.createCourse.mockResolvedValue(result);

    expect(await controller.createCourse(createCourseDto)).toBe(result);
    expect(mockCoursesService.createCourse).toHaveBeenCalledWith(createCourseDto);
  });

  it('should call updateCourse', async () => {
    const updateCourseDto: UpdateCourseDto = { name: 'Updated Course', description: 'Updated Description' };
    const result = { id: 1, name: 'Updated Course', description: 'Updated Description' };
    const id = 1;
    mockCoursesService.updateCourse.mockResolvedValue(result);

    expect(await controller.updateCourse({ id, data: updateCourseDto })).toBe(result);
    expect(mockCoursesService.updateCourse).toHaveBeenCalledWith(id, updateCourseDto);
  });

  it('should call deleteCourse', async () => {
    const result = { id: 1, name: 'Course 1', description: 'Course description' };
    const id = 1;
    mockCoursesService.deleteCourse.mockResolvedValue(result);

    expect(await controller.deleteCourse(id)).toBe(result);
    expect(mockCoursesService.deleteCourse).toHaveBeenCalledWith(id);
  });

  it('should call getMaxStudents', async () => {
    const result = 30;
    const courseId = 1;
    mockCoursesService.getMaxStudents.mockResolvedValue(result);

    expect(await controller.getMaxStudents(courseId)).toBe(result);
    expect(mockCoursesService.getMaxStudents).toHaveBeenCalledWith(courseId);
  });
});
