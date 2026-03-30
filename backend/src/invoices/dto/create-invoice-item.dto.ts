import { IsString, IsNumber, IsPositive, IsInt, Min } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}
