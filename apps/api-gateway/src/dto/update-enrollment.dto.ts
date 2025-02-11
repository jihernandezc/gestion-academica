import { IsInt, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsInt()
  studentId: number;

  @IsOptional()
  @IsInt()
  courseId: number;

  @IsOptional()
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