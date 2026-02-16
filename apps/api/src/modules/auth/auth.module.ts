import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { UserRegisteredEventListener } from './listeners/user-registered.listener';
import { UserLoginCodeEventListener } from './listeners/user-login-code.listener';

@Module({
  imports: [
    PassportModule,
    UserModule,
    WorkspaceModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.accessToken.secret'),
        signOptions: {
          expiresIn: config.get('jwt.accessToken.expiresIn'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRegisteredEventListener,
    UserLoginCodeEventListener,
  ],
  exports: [AuthService],
})
export class AuthModule {}
