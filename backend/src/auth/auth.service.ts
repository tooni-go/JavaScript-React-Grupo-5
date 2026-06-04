import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    console.log('[Auth] Register attempt for:', dto.email);
    
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      console.log('[Auth] User already exists:', dto.email);
      throw new UnauthorizedException('User already exists');
    }

    // UsersService.create() will hash the password - pass plain text
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,  // Plain text - UsersService hashes it
      rol: null,
    });
    
    console.log('[Auth] User created:', user.email, '| ID:', user.id);

    const tokens = await this.getTokens(user.id, user.email, user.rol || '');
    return {
      ...tokens,
      user_id: user.id,
      rol: user.rol,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.rol ?? null);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return {
      ...tokens,
      user_id: user.id,
      rol: user.rol,
    };
  }

  async logout(userId: string, rt: string) {
    if (rt) {
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: rt,
        },
      });
    } else {
      // Si no se proporciona un Refresh Token específico, borramos todos los del usuario
      // para asegurar el cierre de sesión en todos los dispositivos o asegurar la limpieza.
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException('Access Denied');

    const savedRt = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        token: rt,
      },
    });

    if (!savedRt || savedRt.expiresAt < new Date()) {
        throw new ForbiddenException('Access Denied or Token Expired');
    }

    const tokens = await this.getTokens(user.id, user.email, user.rol ?? null);
    
    // Replace old token with new one
    await this.prisma.refreshToken.delete({ where: { id: savedRt.id } });
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string) {
    // In this implementation, we store the token directly or a hash. 
    // To allow revocation, we store the token string (or its hash) with an expiry.
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token: rt,
        userId,
        expiresAt,
      },
    });
  }

  async getTokens(userId: string, email: string, rol: string | null) {
    const rolValue = rol ?? 'PENDING';
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, rol: rolValue },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'at-secret',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, rol: rolValue },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'rt-secret',
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
