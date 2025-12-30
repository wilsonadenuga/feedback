import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { TOKEN_TYPES } from '@feedback/schema';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
  ) {}

  private calculateExpiryDate(minutes: number): Date {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
    return expiryDate;
  }

  async createWorkspaceInviteToken(userId?: string) {
    const tokenValue = uuidv4();
    const expiryMinutes = this.configService.get<number>(
      'WORKSPACE_INVITE_TOKEN_EXPIRY',
    );
    const expiresAt = this.calculateExpiryDate(expiryMinutes);

    return this.tokenRepository.create({
      type: TOKEN_TYPES.WORKSPACE_INVITE,
      value: tokenValue,
      expires_at: expiresAt,
      ...(userId && {
        user: {
          connect: { id: userId },
        },
      }),
    });
  }

  async validateToken(tokenValue: string, tokenType: string): Promise<boolean> {
    const token = await this.tokenRepository.findByValue(tokenValue);

    if (!token) {
      return false;
    }

    if (token.type !== tokenType) {
      return false;
    }

    if (new Date() > new Date(token.expires_at)) {
      return false;
    }

    if (token.used_at) {
      return false;
    }

    return true;
  }

  async getToken(tokenValue: string) {
    return this.tokenRepository.findByValue(tokenValue);
  }

  async markTokenAsUsed(tokenId: string) {
    return this.tokenRepository.update(tokenId, {
      used_at: new Date(),
    });
  }

  async deleteToken(tokenId: string) {
    return this.tokenRepository.delete(tokenId);
  }
}
