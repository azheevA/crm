import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Photo } from '@prisma/generated';
import { unlink } from 'fs/promises';
import { join } from 'path';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotoService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  private readonly rootFolder = 'uploads';

  onModuleInit() {
    this.createUploadsDirectories();
  }

  private createUploadsDirectories() {
    const subFolders = ['users', 'deals', 'chat'];
    const rootPath = join(process.cwd(), this.rootFolder);
    if (!fs.existsSync(rootPath)) fs.mkdirSync(rootPath);

    subFolders.forEach((sub) => {
      const path = join(rootPath, sub);
      if (!fs.existsSync(path)) fs.mkdirSync(path);
    });
  }

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const oldPhoto = await this.prisma.photo.findUnique({ where: { userId } });
    if (oldPhoto) {
      await this.deletePhysicalFile(oldPhoto.filename, 'users');
      await this.prisma.photo.delete({ where: { id: oldPhoto.id } });
    }

    return this.prisma.photo.create({
      data: {
        url: `/uploads/users/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        userId: userId,
      },
    });
  }

  private async deletePhysicalFile(filename: string, subFolder: string) {
    const filePath = join(process.cwd(), this.rootFolder, subFolder, filename);
    try {
      await unlink(filePath);
    } catch (e) {
      console.error('File not found', e);
    }
  }
  async uploadChatFiles(files: Express.Multer.File[]): Promise<Photo[]> {
    if (!files || files.length === 0)
      throw new BadRequestException('Файлы не переданы');

    return Promise.all(
      files.map((file) =>
        this.prisma.photo.create({
          data: {
            url: `/uploads/chat/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
          },
        }),
      ),
    );
  }

  async uploadDealFiles(
    dealId: number,
    files: Express.Multer.File[],
  ): Promise<Photo[]> {
    if (!files || files.length === 0)
      throw new BadRequestException('Файлы не были переданы');

    return Promise.all(
      files.map((file) =>
        this.prisma.photo.create({
          data: {
            url: `/uploads/deals/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            dealId: dealId,
          },
        }),
      ),
    );
  }

  async deletePhoto(photoId: number) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });
    if (!photo) throw new NotFoundException('Фото не найдено');

    const subFolder = photo.userId ? 'users' : photo.dealId ? 'deals' : 'chat';
    await this.deletePhysicalFile(photo.filename, subFolder);

    return this.prisma.photo.delete({ where: { id: photoId } });
  }
}
