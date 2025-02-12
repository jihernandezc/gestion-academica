import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { PrismaService } from './prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

// Mock del PrismaService
const mockPrismaService = {
  enrollment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all enrollments', async () => {
    const result = [
      { id: 1, studentId: 1, courseId: 101, finalGrade: 85 },
    ];
    mockPrismaService.enrollment.findMany.mockResolvedValue(result);

    expect(await service.getAllEnrollments()).toBe(result);
    expect(mockPrismaService.enrollment.findMany).toHaveBeenCalled();
  });

  it('should return an enrollment by id', async () => {
    const result = { id: 1, studentId: 1, courseId: 101, finalGrade: 85 };
    const id = 1;
    mockPrismaService.enrollment.findUnique.mockResolvedValue(result);

    expect(await service.getEnrollmentById(id)).toBe(result);
    expect(mockPrismaService.enrollment.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should create an enrollment', async () => {
    const createEnrollmentDto: CreateEnrollmentDto = {
      studentId: 1,
      courseId: 101,
      finalGrade: 85,
    };
    const result = { id: 1, studentId: 1, courseId: 101, finalGrade: 85 };
    mockPrismaService.enrollment.create.mockResolvedValue(result);

    expect(await service.createEnrollment(createEnrollmentDto)).toBe(result);
    expect(mockPrismaService.enrollment.create).toHaveBeenCalledWith({
      data: createEnrollmentDto,
    });
  });

  it('should update an enrollment', async () => {
    const updateEnrollmentDto: UpdateEnrollmentDto = { finalGrade: 90 };
    const result = { id: 1, studentId: 1, courseId: 101, finalGrade: 90 };
    const id = 1;
    mockPrismaService.enrollment.update.mockResolvedValue(result);

    expect(await service.updateEnrollment(id, updateEnrollmentDto)).toBe(result);
    expect(mockPrismaService.enrollment.update).toHaveBeenCalledWith({
      where: { id },
      data: updateEnrollmentDto,
    });
  });

  it('should delete an enrollment', async () => {
    const result = { id: 1, studentId: 1, courseId: 101, finalGrade: 85 };
    const id = 1;
    mockPrismaService.enrollment.delete.mockResolvedValue(result);

    expect(await service.deleteEnrollment(id)).toBe(result);
    expect(mockPrismaService.enrollment.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should return grades by student id', async () => {
    const result = [
      { courseId: 101, finalGrade: 85 },
      { courseId: 102, finalGrade: 90 },
    ];
    const studentId = 1;
    mockPrismaService.enrollment.findMany.mockResolvedValue(result);

    expect(await service.getGradesByStudentId(studentId)).toBe(result);
    expect(mockPrismaService.enrollment.findMany).toHaveBeenCalledWith({
      where: { studentId, isAssigned: true },
      select: { courseId: true, finalGrade: true },
    });
  });

  it('should return grade by student id and course id', async () => {
    const result = { courseId: 101, finalGrade: 85 };
    const studentId = 1;
    const courseId = 101;
    mockPrismaService.enrollment.findFirst.mockResolvedValue(result);

    expect(await service.getGradeByStudentIdAndCourseId(studentId, courseId)).toBe(result);
    expect(mockPrismaService.enrollment.findFirst).toHaveBeenCalledWith({
      where: { studentId, courseId },
      select: { courseId: true, finalGrade: true, isAssigned: true },
    });
  });

  it('should return error when enrollment not found by student id and course id', async () => {
    const studentId = 1;
    const courseId = 101;
    mockPrismaService.enrollment.findFirst.mockResolvedValue(null);

    try {
      await service.getGradeByStudentIdAndCourseId(studentId, courseId);
    } catch (error) {
      expect(error.response).toBe('Enrollment not found');
    }
  });

  it('should return average grade by student id', async () => {
    const result = 87.5;
    const studentId = 1;
    mockPrismaService.enrollment.findMany.mockResolvedValue([
      { finalGrade: 85 },
      { finalGrade: 90 },
    ]);

    expect(await service.getAverageGradeByStudentId(studentId)).toBe(result);
    expect(mockPrismaService.enrollment.findMany).toHaveBeenCalledWith({
      where: { studentId, isAssigned: true },
      select: { finalGrade: true },
    });
  });

  it('should return average grade by course id', async () => {
    const result = 87.5;
    const courseId = 101;
    mockPrismaService.enrollment.findMany.mockResolvedValue([
      { finalGrade: 85 },
      { finalGrade: 90 },
    ]);

    expect(await service.getAverageGradeByCourseId(courseId)).toBe(result);
    expect(mockPrismaService.enrollment.findMany).toHaveBeenCalledWith({
      where: { courseId, isAssigned: true },
      select: { finalGrade: true },
    });
  });

  it('should return assigned courses by student id', async () => {
    const result = [101, 102];
    const studentId = 1;
    mockPrismaService.enrollment.findMany.mockResolvedValue([
      { courseId: 101 },
      { courseId: 102 },
    ]);

    expect(await service.getAssignedCoursesByStudentId(studentId)).toBe(result);
    expect(mockPrismaService.enrollment.findMany).toHaveBeenCalledWith({
      where: { studentId, isAssigned: true },
      select: { courseId: true },
    });
  });

  it('should return unassigned courses by student id', async () => {
    const result = [103, 104];
    const studentId = 1;
    mockPrismaService.enrollment.findMany.mockResolvedValue([
      { courseId: 103, isAssigned: false },
      { courseId: 104, isAssigned: false },
    ]);

    expect(await service.getUnassignedCoursesByStudentId(studentId)).toBe(result);
    expect(mockPrismaService.enrollment.findMany).toHaveBeenCalledWith({
      where: { studentId, isAssigned: false },
      select: { courseId: true },
    });
  });

  it('should return assigned students count by course id', async () => {
    const result = 25;
    const courseId = 101;
    mockPrismaService.enrollment.count.mockResolvedValue(result);

    expect(await service.getAssignedCountByCourseId(courseId)).toBe(result);
    expect(mockPrismaService.enrollment.count).toHaveBeenCalledWith({
      where: { courseId, isAssigned: false },
    });
  });
});
