import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.create(user.id, { ...dto, projectId });
  }

  @Get()
  findAll(@GetUser() user: User, @Param('projectId') projectId: string) {
    return this.expensesService.findAll(user.id, projectId);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.expensesService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.expensesService.remove(user.id, id);
  }
}
