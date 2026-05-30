import { IsString, IsOptional } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  especialidad: string;

  @IsOptional()
  @IsString()
  biografia?: string;

  @IsString()
  userId: string;
}

export class UpdateProfesorDto {
  @IsOptional()
  @IsString()
  especialidad?: string;

  @IsOptional()
  @IsString()
  biografia?: string;
}
