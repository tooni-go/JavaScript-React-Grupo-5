import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CharlasService } from './charlas.service';
import { CreateCharlaDto, UpdateCharlaDto } from './dto/charla.dto';

@Controller('charlas')
export class CharlasController {
  constructor(private charlasService: CharlasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCharlaDto) {
    return this.charlasService.create(dto);
  }

  @Get()
  findAll() {
    return this.charlasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.charlasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCharlaDto) {
    return this.charlasService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.charlasService.remove(+id);
  }

  @Post(':id/participantes/:userId')
  addParticipante(@Param('id') id: string, @Param('userId') userId: string) {
    return this.charlasService.addParticipante(+id, userId);
  }

  @Delete(':id/participantes/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeParticipante(@Param('id') id: string, @Param('userId') userId: string) {
    return this.charlasService.removeParticipante(+id, userId);
  }
}
