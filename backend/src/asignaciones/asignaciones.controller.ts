import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { CreateAsignacionDto, UpdateAsignacionDto } from './dto/asignacion.dto';

@Controller('asignaciones')
export class AsignacionesController {
  constructor(private asignacionesService: AsignacionesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAsignacionDto) {
    return this.asignacionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.asignacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignacionesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAsignacionDto) {
    return this.asignacionesService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.asignacionesService.remove(+id);
  }
}
