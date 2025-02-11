import { IsBoolean, IsInt, Max, Min, IsOptional} from 'class-validator';

export class UpdateMatriculaDto {

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  readonly nota_final?: number;

  @IsOptional()
  @IsBoolean()
  readonly cupo_asignado?: boolean;
}
