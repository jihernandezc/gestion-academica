import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

// Mock del servicio EnrollmentsService
const mockEnrollmentsService = {
  getAllEnrollments: jest.fn(),
  getEnrollmentById: jest.fn(),
  createEnrollment: jest.fn(),
  updateEnrollment: jest.fn(),
  deleteEnrollment: jest.fn(),
  getGradesByStudentId: jest.fn(),
  getGradeByStudentIdAndCourseId: jest.fn(),
  getAssignedCoursesByStudentId: jest.fn(),
  getUnassignedCoursesByStudentId: jest.fn(),
  getAverageGradeByStudentId: jest.fn(),
  getAverageGradeByCourseId: jest.fn(),
  getAssignedCountByCourseId: jest.fn(),
};

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        { provide: EnrollmentsService, useValue: mockEnrollmentsService },
      ],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all enrollments', async () => {
    const result = [{ id: 1, studentId: 1, courseId: 101, finalGrade: 85 }];
    mockEnrollmentsService.getAllEnrollments.mockResolvedValue(result);

    expect(await controller.getAllEnrollments()).toBe(result);
    expect(mockEnrollmentsService.getAllEnrollments).toHaveBeenCalled();
  });

  it('should return an enrollment by id', async () => {
    const result = { id: 1, studentId: 1, courseId: 101, finalGrade: 85 };
    const id = 1;
    mockEnrollmentsService.getEnrollmentById.mockResolvedValue(result);

    expect(await controller.getEnrollmentById(id)).toBe(result);
    expect(mockEnrollmentsService.getEnrollmentById).toHaveBeenCalledWith(id);
  });

  it('should create a new enrollment', async () => {
    const createEnrollmentDto: CreateEnrollmentDto = { studentId: 1, courseId: 101, finalGrade: 85 };
    const result = { id: 1, studentId: 1, courseId: 101, finalGrade: 85 };
    mockEnrollmentsService.createEnrollment.mockResolvedValue(result);

    expect(await controller.createEnrollment(createEnrollmentDto)).toBe(result);
    expect(mockEnrollmentsService.createEnrollment).toHaveBeenCalledWith(createEnrollmentDto);
  });

  it('should update an enrollment', async () => {
    const updateEnrollmentDto: UpdateEnrollmentDto = { finalGrade: 90 };
    const result = { id: 1, studentId: 1, courseId: 101, finalGrade: 90 };
    const id = 1;
    mockEnrollmentsService.updateEnrollment.mockResolvedValue(result);

    expect(await controller.updateEnrollment({ id, data: updateEnrollmentDto })).toBe(result);
    expect(mockEnrollmentsService.updateEnrollment).toHaveBeenCalledWith(id, updateEnrollmentDto);
  });

  it('should delete an enrollment', async () => {
    const result = { id: 1, studentId: 1, courseId: 101, finalGrade: 85 };
    const id = 1;
    mockEnrollmentsService.deleteEnrollment.mockResolvedValue(result);

    expect(await controller.deleteEnrollment(id)).toBe(result);
    expect(mockEnrollmentsService.deleteEnrollment).toHaveBeenCalledWith(id);
  });

  it('should return grades by student id', async () => {
    const result = [{ courseId: 101, finalGrade: 85 }];
    const studentId = 1;
    mockEnrollmentsService.getGradesByStudentId.mockResolvedValue(result);

    expect(await controller.getGradesByStudentId(studentId)).toBe(result);
    expect(mockEnrollmentsService.getGradesByStudentId).toHaveBeenCalledWith(studentId);
  });

  it('should return grade by student id and course id', async () => {
    const result = { courseId: 101, finalGrade: 85 };
    const studentId = 1;
    const courseId = 101;
    mockEnrollmentsService.getGradeByStudentIdAndCourseId.mockResolvedValue(result);

    expect(await controller.getGradeByStudentIdAndCourseId({ studentId, courseId })).toBe(result);
    expect(mockEnrollmentsService.getGradeByStudentIdAndCourseId).toHaveBeenCalledWith(studentId, courseId);
  });

  it('should return assigned courses by student id', async () => {
    const result = [101, 102];
    const studentId = 1;
    mockEnrollmentsService.getAssignedCoursesByStudentId.mockResolvedValue(result);

    expect(await controller.getAssignedCoursesByStudentId(studentId)).toBe(result);
    expect(mockEnrollmentsService.getAssignedCoursesByStudentId).toHaveBeenCalledWith(studentId);
  });

  it('should return unassigned courses by student id', async () => {
    const result = [103, 104];
    const studentId = 1;
    mockEnrollmentsService.getUnassignedCoursesByStudentId.mockResolvedValue(result);

    expect(await controller.getUnassignedCoursesByStudentId(studentId)).toBe(result);
    expect(mockEnrollmentsService.getUnassignedCoursesByStudentId).toHaveBeenCalledWith(studentId);
  });

  it('should return average grade by student id', async () => {
    const result = 88.5;
    const studentId = 1;
    mockEnrollmentsService.getAverageGradeByStudentId.mockResolvedValue(result);

    expect(await controller.getAverageGradeByStudentId(studentId)).toBe(result);
    expect(mockEnrollmentsService.getAverageGradeByStudentId).toHaveBeenCalledWith(studentId);
  });

  it('should return average grade by course id', async () => {
    const result = 90.0;
    const courseId = 101;
    mockEnrollmentsService.getAverageGradeByCourseId.mockResolvedValue(result);

    expect(await controller.getAverageGradeByCourseId(courseId)).toBe(result);
    expect(mockEnrollmentsService.getAverageGradeByCourseId).toHaveBeenCalledWith(courseId);
  });

  it('should return assigned students count by course id', async () => {
    const result = 30;
    const courseId = 101;
    mockEnrollmentsService.getAssignedCountByCourseId.mockResolvedValue(result);

    expect(await controller.getAssignedStudentsCountByCourseId(courseId)).toBe(result);
    expect(mockEnrollmentsService.getAssignedCountByCourseId).toHaveBeenCalledWith(courseId);
  });
});
