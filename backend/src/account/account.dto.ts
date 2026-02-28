import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AccountDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  ownerId: number;
}

export class PatchAccountDto {}
