import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { PhotoModule } from './photo/photo.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    EmailModule,
    UserModule,
    AccountModule,
    PhotoModule,
    ChatModule,
  ],
})
export class AppModule {}
