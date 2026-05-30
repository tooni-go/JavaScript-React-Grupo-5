import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto, UpdateProfesorDto } from './dto/profesor.dto';

@Controller('profesores')
export class ProfesoresController {
  constructor(private profesoresService: ProfesoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProfesorDto) {
    return this.profesoresService.create(dto);
  }

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesoresService.findOne(+id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.profesoresService.findByUserId(userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfesorDto) {
    return this.profesoresService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.profesoresService.remove(+id);
  }
}
