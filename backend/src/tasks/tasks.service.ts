import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private projectsService: ProjectsService,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    // Verify project belongs to user
    await this.projectsService.findOne(userId, dto.projectId);
    const task = this.tasksRepository.create(dto);
    return this.tasksRepository.save(task);
  }

  async findAll(
    userId: string,
    projectId: string,
    status?: TaskStatus,
  ): Promise<Task[]> {
    await this.projectsService.findOne(userId, projectId);
    const where: Record<string, unknown> = { projectId };
    if (status) where.status = status;
    return this.tasksRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    // Verify ownership via project
    await this.projectsService.findOne(userId, task.projectId);
    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(userId, id);
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(userId: string, id: string): Promise<void> {
    const task = await this.findOne(userId, id);
    await this.tasksRepository.remove(task);
  }
}
