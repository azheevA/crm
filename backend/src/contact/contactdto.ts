import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Алина', description: 'Имя контакта' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Иванова', description: 'Фамилия контакта' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'ivan@example.com',
    description: 'Email должен быть уникальным',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '+79000000000',
    description: 'Номер телефона',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 1,
    description: 'ID компании, к которой привязан контакт',
  })
  @IsInt()
  @IsNotEmpty()
  companyId: number;
}

export class UpdateContactDto extends PartialType(CreateContactDto) {}
