import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorators';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // --- Public routes ---
  @SkipThrottle()
  @Get()
  @ApiOperation({
    summary: 'Get all projects — supports ?category= and ?featured=',
  })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  findAll(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
  ) {
    const featuredBool =
      featured === 'true' ? true : featured === 'false' ? false : undefined;
    return this.projectsService.findAll(category, featuredBool);
  }
  // Find by id
  @SkipThrottle()
  @Get(':id')
  @ApiOperation({ summary: 'Get single project by id' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // --- Admin routes (JWT protected) ---

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create project — admin only' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project — admin only' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project — admin only' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
