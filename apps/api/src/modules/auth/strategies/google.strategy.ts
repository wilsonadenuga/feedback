import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'modules/user/services/user.service';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
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
      const googleUser = {
        email: emails?.[0]?.value,
        firstName: name?.givenName,
        lastName: name?.familyName,
      };
      let user = await this.userService.findUserByEmail(googleUser.email);

      if (!user) {
        user = await this.userService.createUser(
          `${googleUser.firstName} ${googleUser.lastName}`,
          googleUser.email,
        );
        await this.userService.updateUserStatus(user.id, 'ACTIVE');
      }
      const payload = { sub: user.id, email: user.email };

      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = uuidv4();

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.prisma.token.create({
        data: {
          type: 'refresh_token',
          value: refreshToken,
          expires_at: expiresAt,
          user_id: user.id,
        },
      });

      done(null, { user, accessToken, refreshToken });
    } catch (error) {
      console.error('GoogleStrategy error:', error);
      done(error, false);
    }
  }
}
