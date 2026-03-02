import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountModule } from 'src/account/account.module';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [PrismaModule, AccountModule, PhotoModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
