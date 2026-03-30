import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  create(userId: string, dto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create({ ...dto, userId });
    return this.clientsRepository.save(client);
  }

  findAll(userId: string): Promise<Client[]> {
    return this.clientsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id, userId },
    });
    if (!client) throw new NotFoundException(`Client ${id} not found`);
    return client;
  }

  async update(userId: string, id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(userId, id);
    Object.assign(client, dto);
    return this.clientsRepository.save(client);
  }

  async remove(userId: string, id: string): Promise<void> {
    const client = await this.findOne(userId, id);
    await this.clientsRepository.remove(client);
  }
}
