import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto, UpdateCursoDto } from './dto/curso.dto';

@Controller('cursos')
export class CursosController {
  constructor(private cursosService: CursosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCursoDto) {
    return this.cursosService.create(dto);
  }

  @Get()
  findAll(@Query('deleted') deleted?: string) {
    return this.cursosService.findAll(deleted === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCursoDto) {
    return this.cursosService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.cursosService.remove(+id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  restore(@Param('id') id: string) {
    return this.cursosService.restore(+id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  hardDelete(@Param('id') id: string) {
    return this.cursosService.hardDelete(+id);
  }
}
