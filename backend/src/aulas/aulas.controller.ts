import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AulasService } from './aulas.service';
import { CreateAulaDto, UpdateAulaDto } from './dto/aula.dto';

@Controller('aulas')
export class AulasController {
  constructor(private aulasService: AulasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAulaDto) {
    return this.aulasService.create(dto);
  }

  @Get()
  findAll(@Query('nombre') nombre?: string) {
    if (nombre) {
      return this.aulasService.findByNombre(nombre);
    }
    return this.aulasService.findAll();
  }

  @Get(':id/estado-actual')
  getEstadoActual(@Param('id') id: string) {
    return this.aulasService.getEstadoActual(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aulasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAulaDto) {
    return this.aulasService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.aulasService.remove(+id);
  }
}
