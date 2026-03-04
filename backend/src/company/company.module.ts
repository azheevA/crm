import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [PrismaModule, ActivityModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
