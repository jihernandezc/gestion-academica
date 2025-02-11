import { IsInt, IsString, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateMatriculaDto {
  @IsInt()
  id_estudiante: number;

  @IsInt()
  id_materia: number;

  @IsString()
  semestre: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  nota_final?: number; // Opcional porque al inscribirse puede no tener nota aún

  @IsBoolean()
  cupo_asignado: boolean;
}