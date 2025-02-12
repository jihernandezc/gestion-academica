import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from './prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

// Definir un tipo simulado para `Student`
interface Student {
    id: number;
    name: string;
    lastName: string;
    email: string;
    career: string ;
  }

describe('StudentsService', () => {
  let studentsService: StudentsService;
  let prismaService: PrismaService;

  // Mock de PrismaService
  const mockPrismaService = {
    student: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    studentsService = module.get<StudentsService>(StudentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(studentsService).toBeDefined();
  });

  it('should return all students', async () => {
    const result: Student[] = [
      { id: 1, name: 'Student 1', lastName: "New", email: "example@dto", career: "Ingenieria"},
      { id: 2, name: 'Student 2', lastName: "New", email: "example@dto", career: "Ingenieria" },
    ];
    mockPrismaService.student.findMany.mockResolvedValue(result);

    expect(await studentsService.getAllStudents()).toEqual(result);
  });

  it('should return a student by id', async () => {
    const result: Student = { id: 1, name: 'Student 1', lastName: "New", email: "example@dto", career: "Ingenieria" };
    mockPrismaService.student.findUnique.mockResolvedValue(result);

    expect(await studentsService.getStudentById(1)).toEqual(result);
  });

  it('should create a student', async () => {
    const createStudentDto: CreateStudentDto = { name: 'New Student', lastName: "New", email: "example@dto", career: "Ingenieria"};
    const result: Student = { id: 1, name: 'New Student', lastName: "New", email: "example@dto", career: "Ingenieria" };
    mockPrismaService.student.create.mockResolvedValue(result);

    expect(await studentsService.createStudent(createStudentDto)).toEqual(result);
  });

  it('should update a student', async () => {
    const updateStudentDto: UpdateStudentDto = { name: 'Updated Student', lastName: "New", email: "example@dto", career: "Ingenieria" };
    const result: Student = { id: 1, name: 'Updated Student', lastName: "New", email: "example@dto", career: "Ingenieria" };
    mockPrismaService.student.update.mockResolvedValue(result);

    expect(await studentsService.updateStudent(1, updateStudentDto)).toEqual(result);
  });

  it('should delete a student', async () => {
    const result: Student = { id: 1, name: 'Student 1', lastName: "New", email: "example@dto", career: "Ingenieria" };
    mockPrismaService.student.delete.mockResolvedValue(result);

    expect(await studentsService.deleteStudent(1)).toEqual(result);
  });

  it('should return students by ids', async () => {
    const result: Student[] = [
      { id: 1, name: 'Student 1', lastName: "New", email: "example@dto", career: "Ingenieria" },
      { id: 2, name: 'Student 2', lastName: "New", email: "example@dto", career: "Ingenieria" },
    ];
    mockPrismaService.student.findMany.mockResolvedValue(result);

    expect(await studentsService.findStudentsByIds([1, 2])).toEqual(result);
  });
});
