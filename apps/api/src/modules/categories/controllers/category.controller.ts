import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ResponseHelper } from '../../../common';
import { CategorySwagger } from '../../../swagger/category.swagger';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @CategorySwagger.create()
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoryService.create(dto.project_id, dto);
    return ResponseHelper.success(category, 'Category created successfully');
  }

  @Get(':category_id')
  @CategorySwagger.findOne()
  async findOne(@Param('category_id') categoryId: string) {
    const category = await this.categoryService.findOne(categoryId);
    return ResponseHelper.success(category);
  }

  @Put(':category_id')
  @CategorySwagger.update()
  async update(
    @Param('category_id') categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(categoryId, dto);
    return ResponseHelper.success(category, 'Category updated successfully');
  }

  @Delete(':category_id')
  @CategorySwagger.delete()
  async delete(@Param('category_id') categoryId: string) {
    await this.categoryService.delete(categoryId);
    return ResponseHelper.success(null, 'Category deleted successfully');
  }
}
