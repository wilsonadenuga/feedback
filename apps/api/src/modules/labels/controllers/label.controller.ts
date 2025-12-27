import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LabelService } from '../services/label.service';
import { CreateLabelDto, UpdateLabelDto, GetLabelsQueryDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ResponseHelper } from '../../../common';
import { LabelSwagger } from '../../../swagger/label.swagger';

@ApiTags('labels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('labels')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  @LabelSwagger.create()
  async create(@Body() dto: CreateLabelDto) {
    const label = await this.labelService.create(dto.project_id, dto);
    return ResponseHelper.success(label, 'Label created successfully');
  }

  @Get()
  @LabelSwagger.findAll()
  async findAll(@Query() query: GetLabelsQueryDto) {
    const labels = await this.labelService.findByProjectId(query.project_id);
    return ResponseHelper.success(labels, 'Labels retrieved successfully');
  }

  @Get(':label_id')
  @LabelSwagger.findOne()
  async findOne(@Param('label_id') labelId: string) {
    const label = await this.labelService.findOne(labelId);
    return ResponseHelper.success(label);
  }

  @Put(':label_id')
  @LabelSwagger.update()
  async update(
    @Param('label_id') labelId: string,
    @Body() dto: UpdateLabelDto,
  ) {
    const label = await this.labelService.update(labelId, dto);
    return ResponseHelper.success(label, 'Label updated successfully');
  }

  @Delete(':label_id')
  @LabelSwagger.delete()
  async delete(@Param('label_id') labelId: string) {
    await this.labelService.delete(labelId);
    return ResponseHelper.success(null, 'Label deleted successfully');
  }
}
