import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
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

describe('StudentsController', () => {
  let studentsController: StudentsController;
  let studentsService: StudentsService;

  const mockStudentService = {
    getAllStudents: jest.fn(),
    getStudentById: jest.fn(),
    createStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
    findStudentsByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    studentsController = module.get<StudentsController>(StudentsController);
    studentsService = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(studentsController).toBeDefined();
  });

  it('should return all students', async () => {
    const result: Student[] = [
      { id: 1, name: 'Student 1', lastName: "New", email: "example@dto", career: "Ingenieria"},
      { id: 2, name: 'Student 2', lastName: "New", email: "example@dto", career: "Ingenieria" },
    ];
    mockStudentService.getAllStudents.mockResolvedValue(result);

    expect(await studentsController.getAllStudents()).toEqual(result);
  });

  it('should return a student by id', async () => {
    const result: Student = { id: 1, name: 'Student 1', lastName: "New", email: "example@dto", career: "Ingenieria" };
    mockStudentService.getStudentById.mockResolvedValue(result);

    expect(await studentsController.getStudentById(1)).toEqual(result);
  });

  it('should create a student', async () => {
    const createStudentDto: CreateStudentDto = { name: 'New Student', lastName: "New", email: "example@dto", career: "Ingenieria" };
    const result: Student = { id: 1, name: 'New Student', lastName: "New", email: "example@dto", career: "Ingenieria" };
    mockStudentService.createStudent.mockResolvedValue(result);

    expect(await studentsController.createStudent(createStudentDto)).toEqual(result);
  });

  it('should update a student', async () => {
    const updateStudentDto: UpdateStudentDto = { name: 'Updated Student', lastName: "New", email: "example@dto", career: "Ingenieria" };
    const result: Student = { id: 1, name: 'Updated Student', lastName: "New", email: "example@dto", career: "Ingenieria" };
    mockStudentService.updateStudent.mockResolvedValue(result);

    expect(await studentsController.updateStudent({ id: 1, data: updateStudentDto })).toEqual(result);
  });

  it('should delete a student', async () => {
    const result: Student = { id: 1, name: 'Student 1', lastName: "New", email: "example@dto", career: "Ingenieria" };
    mockStudentService.deleteStudent.mockResolvedValue(result);

    expect(await studentsController.deleteStudent(1)).toEqual(result);
  });

  it('should return students by ids', async () => {
    const result: Student[] = [
      { id: 1, name: 'Student 1', lastName: "New", email: "example@dto", career: "Ingenieria"},
      { id: 2, name: 'Student 2', lastName: "New", email: "example@dto", career: "Ingenieria" },
    ];
    mockStudentService.findStudentsByIds.mockResolvedValue(result);

    expect(await studentsController.findStudentsByIds([1, 2])).toEqual(result);
  });
});
