import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateCharlaDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  capacidadMax: number;

  @IsDateString()
  fechaHora: string;

  @IsInt()
  aulaId: number;

  @IsString()
  organizadorId: string;
}

export class UpdateCharlaDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  capacidadMax?: number;

  @IsOptional()
  @IsDateString()
  fechaHora?: string;

  @IsOptional()
  @IsInt()
  aulaId?: number;

  @IsOptional()
  @IsString()
  organizadorId?: string;
}
