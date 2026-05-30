import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAsignacionDto {
  @IsString()
  diaSemana: string;

  @IsString()
  horaInicio: string;

  @IsString()
  horaFin: string;

  @IsString()
  profesorId: string;

  @IsInt()
  cursoId: number;

  @IsInt()
  materiaId: number;

  @IsInt()
  aulaId: number;
}

export class UpdateAsignacionDto {
  @IsOptional()
  @IsString()
  diaSemana?: string;

  @IsOptional()
  @IsString()
  horaInicio?: string;

  @IsOptional()
  @IsString()
  horaFin?: string;

  @IsOptional()
  @IsString()
  profesorId?: string;

  @IsOptional()
  @IsInt()
  cursoId?: number;

  @IsOptional()
  @IsInt()
  materiaId?: number;

  @IsOptional()
  @IsInt()
  aulaId?: number;
}
