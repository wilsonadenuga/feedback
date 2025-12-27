import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService } from '../services/feedback.service';
import { CreateFeedbackDto, GetFeedbacksDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ResponseHelper, createPaginationMeta } from '../../../common/helpers';
import { FeedbackSwagger } from '../../../swagger/feedback.swagger';

@ApiTags('feedbacks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @FeedbackSwagger.create()
  async create(@Body() dto: CreateFeedbackDto) {
    const feedback = await this.feedbackService.create(dto.project_id, dto);
    return ResponseHelper.success(feedback, 'Feedback created successfully');
  }

  @Get(':feedback_id')
  @FeedbackSwagger.findOne()
  async findOne(@Param('feedback_id') feedbackId: string) {
    const feedback = await this.feedbackService.findOne(feedbackId);
    return ResponseHelper.success(feedback, 'Feedback retrieved successfully');
  }

  @Get()
  @FeedbackSwagger.findMany()
  async findMany(@Query() dto: GetFeedbacksDto) {
    const result = await this.feedbackService.findMany(dto);
    const meta = createPaginationMeta(result.page, result.limit, result.total);

    return ResponseHelper.paginated(
      result.feedbacks,
      meta,
      'Feedbacks retrieved successfully',
    );
  }
}
