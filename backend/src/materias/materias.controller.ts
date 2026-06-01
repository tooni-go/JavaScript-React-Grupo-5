import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto, UpdateMateriaDto } from './dto/materia.dto';

@Controller('materias')
export class MateriasController {
  constructor(private materiasService: MateriasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateMateriaDto) {
    return this.materiasService.create(dto);
  }

  @Get()
  findAll() {
    return this.materiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materiasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMateriaDto) {
    return this.materiasService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.materiasService.remove(+id);
  }
}
