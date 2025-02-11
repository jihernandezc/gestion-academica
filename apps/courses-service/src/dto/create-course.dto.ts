import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  maxStudents: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;
}