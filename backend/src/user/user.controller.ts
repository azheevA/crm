import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  UnauthorizedException,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard, type SessionData } from 'src/auth/auth.guard';
import { sessionInfo } from 'src/auth/session-info.decorator';
import { PhotoService } from 'src/photo/photo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetSessionInfoDto } from 'src/auth/auth.dto';
import { UserService } from './user.service';
import { UserDto, UpdateProfileDto, UpdateUserDto } from './user.dto';
import { User } from '@prisma/generated';

const multerOptions = {
  storage: diskStorage({
    destination: './user-uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

@ApiTags('Users')
@Controller('users')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly photoService: PhotoService,
  ) {}
  private excludeSecrets(user: User): UserDto {
    if (!user) return user;
    const { hash: _hash, ...userWithoutSecrets } = user;
    return userWithoutSecrets as UserDto;
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiOkResponse({ type: [UserDto] })
  async findAll() {
    const users = await this.userService.users({});
    return users.map((user) => this.excludeSecrets(user));
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({ summary: 'Информацию профиля' })
  async getMe(@sessionInfo() session: SessionData): Promise<UserDto> {
    const user = await this.userService.user({ id: session.id });
    if (!user) throw new UnauthorizedException('Invalid session');
    return this.excludeSecrets(user);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить свой профиль' })
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @sessionInfo() session: SessionData,
  ) {
    const updatedUser = await this.userService.updateUser({
      where: { id: session.id },
      data: dto,
    });
    return this.excludeSecrets(updatedUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить одного пользователя' })
  @ApiOkResponse({ type: UserDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.user({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludeSecrets(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiOkResponse({ type: UserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser({
      where: { id },
      data: updateUserDto,
    });
    return this.excludeSecrets(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.deleteUser({ id });
    return this.excludeSecrets(user);
  }

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузка аватара пользователя' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
    @sessionInfo() session: GetSessionInfoDto,
  ) {
    return (await this.photoService.uploadAvatar(
      session.id,
      file,
    )) as UpdateProfileDto;
  }
}
