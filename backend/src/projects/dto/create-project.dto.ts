import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { ProjectStatus } from '../project.entity';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status: ProjectStatus;

  @IsDateString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  budget: number;

  @IsUUID()
  clientId: string;
}
