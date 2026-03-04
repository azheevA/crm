import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [PrismaModule, ActivityModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
