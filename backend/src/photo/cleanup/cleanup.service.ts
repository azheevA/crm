import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotoService } from '../photo.service';

@Injectable()
export class CleanupService {
  constructor(
    private prisma: PrismaService,
    private photoService: PhotoService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanOrphanedPhotos() {
    console.log('Начинаем очистку временных файлов чата...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const orphans = await this.prisma.photo.findMany({
      where: {
        messageId: null,
        userId: null,
        dealId: null,
        createdAt: { lt: yesterday },
      },
    });

    for (const photo of orphans) {
      await this.photoService.deletePhoto(photo.id);
    }

    console.log(`Удалено ${orphans.length} забытых файлов.`);
  }
}
