import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import { InvoiceItem } from './invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemsRepository: Repository<InvoiceItem>,
  ) {}

  private async generateInvoiceNumber(userId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.invoicesRepository.count({ where: { userId } });
    const seq = String(count + 1).padStart(3, '0');
    return `INV-${year}-${seq}`;
  }

  private calculateTotal(
    items: { quantity: number; unitPrice: number }[],
  ): number {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  async create(userId: string, dto: CreateInvoiceDto): Promise<Invoice> {
    const invoiceNumber = await this.generateInvoiceNumber(userId);
    const totalAmount = this.calculateTotal(dto.items);

    const invoice = this.invoicesRepository.create({
      invoiceNumber,
      totalAmount,
      userId,
      clientId: dto.clientId,
      projectId: dto.projectId,
      dueDate: dto.dueDate,
      status: dto.status,
      notes: dto.notes,
    });
    const savedInvoice = await this.invoicesRepository.save(invoice);

    const items = dto.items.map((item) =>
      this.invoiceItemsRepository.create({
        ...item,
        total: item.quantity * item.unitPrice,
        invoiceId: savedInvoice.id,
      }),
    );
    await this.invoiceItemsRepository.save(items);

    return this.findOne(userId, savedInvoice.id);
  }

  findAll(userId: string, status?: InvoiceStatus): Promise<Invoice[]> {
    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;
    return this.invoicesRepository.find({
      where,
      relations: ['client', 'project', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id, userId },
      relations: ['client', 'project', 'items'],
    });
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
    return invoice;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.findOne(userId, id);

    // Update scalar fields
    const { items, ...scalar } = dto;
    Object.assign(invoice, scalar);

    // Replace items if provided
    if (items) {
      await this.invoiceItemsRepository.delete({ invoiceId: id });
      const newItems = items.map((item) =>
        this.invoiceItemsRepository.create({
          ...item,
          total: item.quantity * item.unitPrice,
          invoiceId: id,
        }),
      );
      await this.invoiceItemsRepository.save(newItems);
      invoice.totalAmount = this.calculateTotal(items);
    }

    return this.invoicesRepository.save(invoice);
  }

  async remove(userId: string, id: string): Promise<void> {
    const invoice = await this.findOne(userId, id);
    await this.invoicesRepository.remove(invoice);
  }
}
