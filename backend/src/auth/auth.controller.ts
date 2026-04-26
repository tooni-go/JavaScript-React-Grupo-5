import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AtGuard } from '../common/guards/at.guard';
import { RtGuard } from '../common/guards/rt.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user as any;
    // Note: In a real app, you'd extract the current RT from the request headers or cookies
    return this.authService.logout(user.sub, ''); 
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}
