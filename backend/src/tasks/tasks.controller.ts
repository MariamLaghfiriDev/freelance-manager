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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { TaskStatus } from './task.entity';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(user.id, { ...dto, projectId });
  }

  @Get()
  findAll(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.findAll(user.id, projectId, status);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.tasksService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.tasksService.remove(user.id, id);
  }
}
