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
import { v4 as uuidv4 } from 'uuid';
import {
  RegisterDto,
  ConfirmEmailDto,
  ResendVerificationDto,
  ResendLoginCodeDto,
  LoginDto,
  LoginVerifyDto,
} from '../dto';
import { USER_STATUSES } from '@feedback/schema';
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

  // TODO: move the otp generation flow to otp module
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

    if (user.status !== USER_STATUSES.UNVERIFIED) {
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
    await this.userService.updateUserStatus(user.id, USER_STATUSES.ACTIVE);
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: USER_STATUSES.ACTIVE,
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

    if (user.status === USER_STATUSES.ACTIVE) {
      throw new ConflictException('Email already verified');
    }

    return this.sendVerificationCode(user.id, email);
  }

  // TODO: move to token service
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessTokenExpiresIn = this.configService.getOrThrow<number>(
      'jwt.accessToken.expiresIn',
    );
    const refreshTokenExpiresIn = this.configService.getOrThrow<number>(
      'jwt.refreshToken.expiresIn',
    );

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = uuidv4();


    await this.prisma.token.create({
      data: {
        type: 'refresh_token',
        value: refreshToken,
        expires_at: new Date(Date.now() + refreshTokenExpiresIn * 1000),
        user_id: userId,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresIn,
    };
  }

  async resendLoginCode(dto: ResendLoginCodeDto) {
    const { email } = dto;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return {
        expires_in: this.CODE_EXPIRY_MINUTES * 60,
      };
    }

    if (user.status !== USER_STATUSES.ACTIVE) {
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

  async login(dto: LoginDto) {
    const { email } = dto;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return {
        expires_in: this.CODE_EXPIRY_MINUTES * 60,
      };
    }

    if (user.status !== USER_STATUSES.ACTIVE) {
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

  // TODO: move the otp verification logic to otp module
  async loginVerify(dto: LoginVerifyDto) {
    const { email, code } = dto;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or code');
    }

    if (user.status !== USER_STATUSES.ACTIVE) {
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
