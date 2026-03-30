import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  create(userId: string, dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create({ ...dto, userId });
    return this.projectsRepository.save(project);
  }

  findAll(userId: string, status?: ProjectStatus): Promise<Project[]> {
    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;
    return this.projectsRepository.find({
      where,
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, userId },
      relations: ['client'],
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(userId, id);
    Object.assign(project, dto);
    return this.projectsRepository.save(project);
  }

  async remove(userId: string, id: string): Promise<void> {
    const project = await this.findOne(userId, id);
    await this.projectsRepository.remove(project);
  }
}
