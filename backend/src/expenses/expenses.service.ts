import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    private projectsService: ProjectsService,
  ) {}

  async create(userId: string, dto: CreateExpenseDto): Promise<Expense> {
    await this.projectsService.findOne(userId, dto.projectId);
    const expense = this.expensesRepository.create(dto);
    return this.expensesRepository.save(expense);
  }

  async findAll(userId: string, projectId: string): Promise<Expense[]> {
    await this.projectsService.findOne(userId, projectId);
    return this.expensesRepository.find({
      where: { projectId },
      order: { date: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) throw new NotFoundException(`Expense ${id} not found`);
    await this.projectsService.findOne(userId, expense.projectId);
    return expense;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(userId, id);
    Object.assign(expense, dto);
    return this.expensesRepository.save(expense);
  }

  async remove(userId: string, id: string): Promise<void> {
    const expense = await this.findOne(userId, id);
    await this.expensesRepository.remove(expense);
  }
}
