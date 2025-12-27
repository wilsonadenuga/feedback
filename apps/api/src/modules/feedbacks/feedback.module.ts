import { Module } from '@nestjs/common';
import { FeedbackController } from './controllers/feedback.controller';
import { FeedbackService } from './services/feedback.service';
import { FeedbackRepository } from './repositories/feedback.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository],
  exports: [FeedbackService, FeedbackRepository],
})
export class FeedbackModule {}
