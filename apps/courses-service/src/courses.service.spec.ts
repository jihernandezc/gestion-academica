import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from './prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { NotFoundException } from '@nestjs/common';

// Mock de PrismaService
const mockPrismaService = {
  course: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all courses', async () => {
    const result = [{ id: 1, name: 'Course 1', description: 'Description', maxStudents: 30 }];
    mockPrismaService.course.findMany.mockResolvedValue(result);

    expect(await service.getAllCourses()).toBe(result);
    expect(mockPrismaService.course.findMany).toHaveBeenCalled();
  });

  it('should return a course by id', async () => {
    const result = { id: 1, name: 'Course 1', description: 'Description', maxStudents: 30 };
    const id = 1;
    mockPrismaService.course.findUnique.mockResolvedValue(result);

    expect(await service.getCourseById(id)).toBe(result);
    expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({ where: { id } });
  });

  it('should create a course', async () => {
    const createCourseDto: CreateCourseDto = { name: 'New Course', maxStudents:50, category: "Optativa" };
    const result = { id: 1, name: 'New Course', description: 'New Description', maxStudents: 30 };
    mockPrismaService.course.create.mockResolvedValue(result);

    expect(await service.createCourse(createCourseDto)).toBe(result);
    expect(mockPrismaService.course.create).toHaveBeenCalledWith({ data: createCourseDto });
  });

  it('should update a course', async () => {
    const updateCourseDto: UpdateCourseDto = { name: 'Updated Course', description: 'Updated Description' };
    const result = { id: 1, name: 'Updated Course', description: 'Updated Description', maxStudents: 30 };
    const id = 1;
    mockPrismaService.course.update.mockResolvedValue(result);

    expect(await service.updateCourse(id, updateCourseDto)).toBe(result);
    expect(mockPrismaService.course.update).toHaveBeenCalledWith({ where: { id }, data: updateCourseDto });
  });

  it('should delete a course', async () => {
    const result = { id: 1, name: 'Course 1', description: 'Description', maxStudents: 30 };
    const id = 1;
    mockPrismaService.course.delete.mockResolvedValue(result);

    expect(await service.deleteCourse(id)).toBe(result);
    expect(mockPrismaService.course.delete).toHaveBeenCalledWith({ where: { id } });
  });

  it('should throw NotFoundException if course not found', async () => {
    const courseId = 1;
    mockPrismaService.course.findUnique.mockResolvedValue(null);

    try {
      await service.getMaxStudents(courseId);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Course not found');
    }

    expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({ where: { id: courseId } });
  });

  it('should return max students for a course', async () => {
    const result = { id: 1, name: 'Course 1', description: 'Description', maxStudents: 30 };
    const courseId = 1;
    mockPrismaService.course.findUnique.mockResolvedValue(result);

    expect(await service.getMaxStudents(courseId)).toBe(30);
    expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({ where: { id: courseId } });
  });
});
