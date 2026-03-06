import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityType } from '@prisma/generated';
class ActivityUserDto {
  @ApiProperty({ example: 'Александр Ажеев' })
  name: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  avatar?: string;
}

export class ActivityDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: ActivityType, example: ActivityType.VALUE_CHANGE })
  type: ActivityType;

  @ApiProperty({ example: 'Добавлена новая компания: "ООО Вектор"' })
  content: string;

  @ApiProperty({ example: '2026-03-06T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: ActivityUserDto })
  user: ActivityUserDto;

  @ApiPropertyOptional({ example: 123 })
  companyId?: number;

  @ApiPropertyOptional({ example: 456 })
  dealId?: number;

  @ApiProperty({ example: 1 })
  userId: number;
}
