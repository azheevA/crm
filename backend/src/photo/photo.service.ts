import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Photo } from '@prisma/generated';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotoService {
  constructor(private readonly prisma: PrismaService) {}
  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const oldPhoto = await this.prisma.photo.findUnique({ where: { userId } });
    if (oldPhoto) {
      await this.deletePhysicalFile(oldPhoto.filename, 'user-uploads');
      await this.prisma.photo.delete({ where: { id: oldPhoto.id } });
    }

    return this.prisma.photo.create({
      data: {
        url: `/static/users/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        userId: userId,
      },
    });
  }
  async uploadGallery(files: Express.Multer.File[]): Promise<Photo[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не были переданы');
    }

    return Promise.all(
      files.map((file) =>
        this.prisma.photo.create({
          data: {
            url: `/static/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
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
    const folder = photo.userId ? 'user-uploads' : 'uploads';
    await this.deletePhysicalFile(photo.filename, folder);

    return this.prisma.photo.delete({ where: { id: photoId } });
  }
  private async deletePhysicalFile(filename: string, folder: string) {
    const filePath = join(process.cwd(), folder, filename);
    try {
      await unlink(filePath);
    } catch (e) {
      console.error('File not found', e);
    }
  }
}
