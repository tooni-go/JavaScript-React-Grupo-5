import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectPending(@Param('id') id: string) {
    // Safety check: only allow deleting users with null role (pending approval)
    const user = await this.usersService.findById(id);
    if (user.rol !== null && user.rol !== undefined && user.rol !== '') {
      throw new BadRequestException('Solo se pueden rechazar usuarios pendientes de aprobación (rol nulo)');
    }
    return this.usersService.remove(id);
  }
}
