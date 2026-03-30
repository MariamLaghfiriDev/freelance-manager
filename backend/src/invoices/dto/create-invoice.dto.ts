import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '../invoice.entity';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class CreateInvoiceDto {
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status: InvoiceStatus;

  @IsDateString()
  dueDate: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsUUID()
  clientId: string;

  @IsUUID()
  @IsOptional()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}
