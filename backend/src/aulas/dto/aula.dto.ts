import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateAulaDto {
  @IsString()
  nombre: string;

  @IsInt()
  @Min(0)
  piso: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacidad?: number;

  @IsOptional()
  @IsString()
  estado?: string;
}

export class UpdateAulaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  piso?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacidad?: number;

  @IsOptional()
  @IsString()
  estado?: string;
}
