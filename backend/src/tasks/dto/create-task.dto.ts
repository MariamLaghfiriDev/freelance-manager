import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsDateString()
  @IsOptional()
  dueDate: string;

  @IsUUID()
  projectId: string;
}
