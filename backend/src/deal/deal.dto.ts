import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DealStatus } from '@prisma/generated';

export class CreateDealDto {
  @ApiProperty({
    example: 'Поставка оборудования',
    description: 'Название сделки',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 50000, description: 'Сумма сделки' })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: 1, description: 'ID компании' })
  @IsInt()
  @IsNotEmpty()
  companyId: number;

  @ApiPropertyOptional({ example: 1, description: 'ID контактного лица' })
  @IsInt()
  @IsOptional()
  contactId?: number;

  @ApiProperty({ example: 1, description: 'ID владельца (User)' })
  @IsInt()
  @IsNotEmpty()
  ownerId: number;

  @ApiProperty({ enum: DealStatus, default: DealStatus.NEW })
  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;
}

export class UpdateDealDto extends PartialType(CreateDealDto) {}
