import { IsInt, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  readonly studentId: number;

  @IsInt()
  readonly courseId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  readonly finalGrade?: number;

  @IsOptional()
  @IsBoolean()
  readonly isAssigned?: boolean;
}