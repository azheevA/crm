import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
class PhotoDto {
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
  photo?: PhotoDto;
}

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email of the user' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name must be less 50 characters long' })
  name: string;

  @ApiProperty({ example: '13123213' })
  @IsString()
  @Exclude()
  hash: string;

  @ApiProperty({ example: '13123213' })
  @IsString()
  @Exclude()
  salt: string;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {}
