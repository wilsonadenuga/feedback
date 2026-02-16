import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'modules/user/services/user.service';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get<string>('google.id'),
      clientSecret: configService.get<string>('google.secret'),
      callbackURL: configService.get<string>('google.url'),
      scope: ['email', 'profile']
    });
  };
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<any> {
    try {
    const { name, emails } = profile;
    const googleUser = {
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      accessToken,
    };
    let user = await this.userService.findUserByEmail(googleUser.email)

    if(!user) {
      user = await this.userService.createUser( `${googleUser.firstName} ${googleUser.lastName}`, googleUser.email )
      await this.userService.updateUserStatus(user.id, 'ACTIVE')
    }

    done (null, user)
    } catch (error) {
      console.error('GoogleStrategy error:', error)
      done( error, false)
    }

  };
};
