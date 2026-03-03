import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
