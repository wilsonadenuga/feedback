import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../user/services/user.service';
import { WorkspaceService } from '../../workspace/services/workspace.service';
import {
  RegisterDto,
  ConfirmEmailDto,
  ResendVerificationDto,
  LoginDto,
  LoginVerifyDto,
} from '../dto';
import { UserStatus } from '@feedback/schema';
import * as crypto from 'crypto';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { UserLoginCodeEvent } from '../events/user-login-code.event';

@Injectable()
export class AuthService {
  private readonly CODE_EXPIRY_MINUTES = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private async sendVerificationCode(userId: string, email: string) {
    const code = this.generateCode();
    const ttlMs = this.CODE_EXPIRY_MINUTES * 60 * 1000;

    await this.cache.set(`otp:email_verification:${userId}`, code, ttlMs);

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(email, code),
    );

    return {
      expires_in: this.CODE_EXPIRY_MINUTES * 60,
    };
  }

  async register(dto: RegisterDto) {
    const { name, email } = dto;
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.createUser(name, email);

    return this.sendVerificationCode(user.id, email);
  }

  async verifyCode(dto: ConfirmEmailDto) {
    const { email, code } = dto;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.UNVERIFIED) {
      throw new ConflictException('Email already verified');
    }

    const storedCode = await this.cache.get<string>(
      `otp:email_verification:${user.id}`,
    );

    if (!storedCode) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    if (storedCode !== code) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    await this.cache.del(`otp:email_verification:${user.id}`);
    await this.userService.updateUserStatus(user.id, UserStatus.ACTIVE);
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: UserStatus.ACTIVE,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      },
      tokens,
    };
  }

  async resendVerification(dto: ResendVerificationDto) {
    const { email } = dto;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return {
        expires_in: this.CODE_EXPIRY_MINUTES * 60,
      };
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new ConflictException('Email already verified');
    }

    return this.sendVerificationCode(user.id, email);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const refreshTokenSecret = this.configService.get<string>(
      'jwt.refreshToken.secret',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'jwt.refreshToken.expiresIn',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: refreshTokenSecret,
        expiresIn: Number(refreshTokenExpiresIn),
      }),
    ]);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // TODO: use token service instead
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

  async login(dto: LoginDto) {
    const { email } = dto;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return {
        expires_in: this.CODE_EXPIRY_MINUTES * 60,
      };
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const code = this.generateCode();
    const ttlMs = this.CODE_EXPIRY_MINUTES * 60 * 1000;

    await this.cache.set(`otp:login:${user.id}`, code, ttlMs);

    this.eventEmitter.emit(
      'user.login.code',
      new UserLoginCodeEvent(user.email, code),
    );

    return {
      expires_in: this.CODE_EXPIRY_MINUTES * 60,
    };
  }

  async loginVerify(dto: LoginVerifyDto) {
    const { email, code } = dto;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or code');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const storedCode = await this.cache.get<string>(`otp:login:${user.id}`);

    if (!storedCode) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    if (storedCode !== code) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    await this.cache.del(`otp:login:${user.id}`);
    const tokens = await this.generateTokens(user.id, user.email);
    const workspaces = await this.workspaceService.findAll(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      },
      tokens,
      workspaces,
    };
  }
}
