import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsUUID()
  projectId: string;
}
