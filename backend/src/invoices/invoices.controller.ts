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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { InvoiceStatus } from './invoice.entity';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@GetUser() user: User, @Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(user.id, dto);
  }

  @Get()
  findAll(
    @GetUser() user: User,
    @Query('status') status?: InvoiceStatus,
  ) {
    return this.invoicesService.findAll(user.id, status);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.invoicesService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.invoicesService.remove(user.id, id);
  }
}
