import { Injectable, NotFoundException } from '@nestjs/common';
// import { Photo } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class PhotoService {
  constructor(private readonly prisma: PrismaService) {}

  // async AddPhoto(
  //   itemId: number,
  //   files: Express.Multer.File[],
  // ): Promise<Array<Photo>> {
  //   const item = await this.prisma.item.findUnique({
  //     where: { id: itemId },
  //   });

  //   if (!item) {
  //     throw new NotFoundException(`Item с ID ${itemId} не найден`);
  //   }
  //   const createPromises = files.map((file) =>
  //     this.prisma.photo.create({
  //       data: {
  //         url: `/static/${file.filename}`,
  //         filename: file.filename,
  //         originalName: file.originalname,
  //         itemId: itemId,
  //       },
  //     }),
  //   );
  //   return await Promise.all(createPromises);
  // }
  async deletePhoto(phodoId: number) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: phodoId },
    });
    if (!photo) {
      throw new NotFoundException(`Фото с ID ${phodoId} не найдено`);
    }
    const filePath = join(process.cwd(), 'uploads', photo.filename);
    try {
      await unlink(filePath);
    } catch (err) {
      console.error(`Файл не найден для удаления код ошибки ${err}`);
    }
    return await this.prisma.photo.delete({
      where: { id: phodoId },
    });
  }
  async addUserPhoto(userId: number, file: Express.Multer.File) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(
        `Пользователь с ID ${userId} не найден в базе данных`,
      );
    }
    const oldPhoto = await this.prisma.photo.findUnique({
      where: { userId: userId },
    });

    if (oldPhoto) {
      await this.deletePhysicalFile(oldPhoto.filename, 'user-uploads');
      await this.prisma.photo.delete({ where: { id: oldPhoto.id } });
    }
    return await this.prisma.photo.create({
      data: {
        url: `/static/users/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        userId: userId,
      },
    });
  }
  public async deletePhysicalFile(filename: string, folder: string) {
    const filePath = join(process.cwd(), folder, filename);
    try {
      await unlink(filePath);
    } catch (e) {
      console.log(e);
    }
  }
}
