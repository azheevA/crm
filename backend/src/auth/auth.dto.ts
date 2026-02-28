import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class SignUpBodyDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '1234567' })
  @IsString()
  @MinLength(4)
  password: string;
}

export class SignInBodyDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234567' })
  @IsString()
  @MinLength(4)
  password: string;
}

export class GetSessionInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumber()
  'iat': number;

  @ApiProperty()
  @IsNumber()
  'exp': number;
}

export class ChangePasswordDto {
  @ApiProperty({ example: '1234' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(4)
  newPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(4)
  confirmNewPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordConfirmDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
