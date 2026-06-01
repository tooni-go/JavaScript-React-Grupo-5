import { IsString, IsOptional } from 'class-validator';

export class CreateMateriaDto {
  @IsString()
  nombre: string;
}

export class UpdateMateriaDto {
  @IsOptional()
  @IsString()
  nombre?: string;
}
