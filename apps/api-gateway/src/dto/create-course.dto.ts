import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  readonly name: string;

  @IsInt()
  @Min(1)
  readonly maxStudents: number;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsString()
  readonly category: string;
}