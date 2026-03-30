import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsString()
  fullName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  notes: string;
}
