import { IsString, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsString()
  readonly career: string;
}