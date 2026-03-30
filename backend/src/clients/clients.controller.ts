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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@GetUser() user: User, @Body() dto: CreateClientDto) {
    return this.clientsService.create(user.id, dto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.clientsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.clientsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.clientsService.remove(user.id, id);
  }
}
