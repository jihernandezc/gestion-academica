import { IsNumber, IsBoolean, IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

// DTO base para los filtros generales
class BaseFilterMatriculaDto {
  @IsOptional()
  @IsString({ message: 'semestre debe ser un string válido' })
  semestre?: string;
}

// DTO para filtrar por estudiante (id_estudiante es obligatorio)
export class FilterMatriculaEstudianteDto extends BaseFilterMatriculaDto {
  @IsNotEmpty({ message: 'id_estudiante es obligatorio cuando tipo es estudiante' })
  @IsNumber({}, { message: 'id_estudiante debe ser un número' })
  id_estudiante: number;

  @IsOptional()
  @IsNumber({}, { message: 'id_materia debe ser un número' })
  id_materia?: number;

  @IsOptional()
  @IsNumber({}, { message: 'nota_final debe ser un número' })
  nota_final?: number;

  @IsOptional()
  @IsBoolean({ message: 'cupo_asignado debe ser un booleano' })
  cupo_asignado?: boolean;
}

// DTO para filtrar por materia (id_materia es obligatorio)
export class FilterMatriculaMateriaDto extends BaseFilterMatriculaDto {
  @IsNotEmpty({ message: 'id_materia es obligatorio cuando tipo es materia' })
  @IsNumber({}, { message: 'id_materia debe ser un número' })
  id_materia: number;

  @IsOptional()
  @IsBoolean({ message: 'cupo_asignado debe ser un booleano' })
  cupo_asignado?: boolean;
}

// DTO para filtrar por cupo (cupo_asignado es obligatorio)
export class FilterMatriculaCupoDto extends BaseFilterMatriculaDto {
  @IsOptional()
  @IsNumber({}, { message: 'id_estudiante debe ser un número' })
  id_estudiante?: number;

  @IsOptional()
  @IsNumber({}, { message: 'id_materia debe ser un número' })
  id_materia?: number;

  @IsNotEmpty({ message: 'cupo_asignado es obligatorio cuando tipo es cupo' })
  @IsBoolean({ message: 'cupo_asignado debe ser un booleano' })
  cupo_asignado: boolean;
}

