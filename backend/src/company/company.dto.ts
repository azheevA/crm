import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'компания', description: 'Название компании' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'https://company.com',
    description: 'URL этой компании',
  })
  @IsOptional()
  @IsUrl()
  website?: string;
}
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty({ description: 'Название компании', example: 'ООО Вектор' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Сайт компании',
    example: 'https://vector.ru',
  })
  website?: string;
}
