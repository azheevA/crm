import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class PhotoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  filename: string;
}
export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@test.com' })
  email: string;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ type: PhotoDto, nullable: true })
  avatar?: PhotoDto;

  @Exclude()
  hash?: string;
}
export class CreateUserDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Неверный формат email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Имя пользователя',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Имя должно быть не короче 2 символов' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  name?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;
}
