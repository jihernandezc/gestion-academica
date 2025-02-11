import { IsInt, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  studentId: number;

  @IsInt()
  courseId: number;

  @IsString()
  semester: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  finalGrade?: number;

  @IsOptional()
  @IsBoolean()
  isAssigned?: boolean;
}