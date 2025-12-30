import { Module } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { TokenService } from './token.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TokenRepository, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
