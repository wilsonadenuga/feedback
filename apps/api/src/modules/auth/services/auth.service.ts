import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../user/services/user.service';
import { RegisterDto, ConfirmEmailDto } from '../dto';
import type { RegisterResponse, ConfirmEmailResponse } from '@feedback/schema';
import * as crypto from 'crypto';
import { UserRegisteredEvent } from '../events/user-registered.event';

@Injectable()
export class AuthService {
  private readonly CODE_EXPIRY_MINUTES = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const { name, email } = dto;
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    await this.userService.createUser(name, email);

    const code = this.generateCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.CODE_EXPIRY_MINUTES);

    await this.prisma.token.deleteMany({
      where: {
        type: 'registration_code',
        user: null,
        used_at: null,
      },
    });

    const token = await this.prisma.token.create({
      data: {
        type: 'registration_code',
        value: `${name}:${email}:${code}`,
        expires_at: expiresAt,
      },
    });

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(token.id, email, code),
    );

    return {
      message: 'Verification code sent to your email',
      expires_in: this.CODE_EXPIRY_MINUTES * 60,
    };
  }

  async verifyCode(dto: ConfirmEmailDto): Promise<ConfirmEmailResponse> {
    const { email, code } = dto;

    const token = await this.prisma.token.findFirst({
      where: {
        type: 'registration_code',
        used_at: null,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    const [storedName, storedEmail, storedCode] = token.value.split(':');

    if (storedEmail !== email || storedCode !== code) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    if (new Date() > token.expires_at) {
      await this.prisma.token.delete({ where: { id: token.id } });
      throw new UnauthorizedException('Verification code has expired');
    }

    const user = await this.userService.createUser(storedName, storedEmail);

    await this.prisma.token.update({
      where: { id: token.id },
      data: {
        used_at: new Date(),
        user_id: user.id,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      },
      tokens,
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.token.create({
      data: {
        type: 'refresh_token',
        value: refreshToken,
        expires_at: expiresAt,
        user_id: userId,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
    };
  }
}
