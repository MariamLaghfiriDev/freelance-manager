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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { ProjectStatus } from './project.entity';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@GetUser() user: User, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, dto);
  }

  @Get()
  findAll(@GetUser() user: User, @Query('status') status?: ProjectStatus) {
    return this.projectsService.findAll(user.id, status);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.projectsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.projectsService.remove(user.id, id);
  }
}
