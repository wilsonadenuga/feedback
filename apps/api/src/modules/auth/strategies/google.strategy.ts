import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user/services/user.service';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from '../../../prisma/prisma.service';
import { TOKEN_TYPES } from '@feedback/schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: configService.get<string>('google.id'),
      clientSecret: configService.get<string>('google.secret'),
      callbackURL: configService.get<string>('google.url'),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails } = profile;
      
      if (!emails || !emails.length) {
        throw new Error('Email not found in Google profile');
      }

      const googleUser = {
        email: emails[0].value,
        firstName: name?.givenName,
        lastName: name?.familyName,
      };
      let user = await this.userService.findUserByEmail(googleUser.email);

      if (!user) {
        user = await this.userService.createGoogleUser(
          `${googleUser.firstName} ${googleUser.lastName}`,
          googleUser.email,
          'ACTIVE',
        );
      }
      const payload = { sub: user.id, email: user.email };

      const jwtAccessToken = await this.jwtService.signAsync(payload);
      const jwtRefreshToken = uuidv4();

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.prisma.token.create({
        data: {
          type: TOKEN_TYPES.REFRESH,
          value: jwtRefreshToken,
          expires_at: expiresAt,
          user_id: user.id,
        },
      });

      done(null, {
        user,
        tokens: {
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
          expiresIn: 15,
        },
        workspaces: [],
      });
    } catch (error) {
      this.logger.error(`Google authentication failed: ${error.message}`, error.stack);
      done(error, false);
    }
  }
}
