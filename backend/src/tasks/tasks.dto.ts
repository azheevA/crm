import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Позвонить клиенту' })
  title: string;

  @ApiProperty({ example: 'Обсудить детали контракта', nullable: true })
  description?: string;

  @ApiProperty({ example: '2026-05-01T10:00:00Z' })
  dueDate: Date;

  @ApiProperty({ example: false })
  isCompleted: boolean;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1, nullable: true })
  dealId?: number;

  @ApiProperty({ example: '2026-03-04T12:00:00Z' })
  createdAt: Date;
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Позвонить клиенту' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Обсудить детали контракта', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-05-01T10:00:00Z' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  dealId?: number;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
