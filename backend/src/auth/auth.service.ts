import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signUp(email: string, password: string, name: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new BadRequestException({ type: 'email-exists' });
    }
    const hash = await this.passwordService.getHash(password);
    const newUser = await this.userService.createUser(name, email, hash);

    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      email: newUser.email,
    });
    return { accessToken };
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await this.passwordService.compare(
      user.hash,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    return { accessToken };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userService.user({ id: userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isOldValid = await this.passwordService.compare(
      user.hash,
      oldPassword,
    );

    if (!isOldValid) {
      throw new BadRequestException('Old password is incorrect');
    }
    if (oldPassword === newPassword) {
      throw new BadRequestException('New password must be different');
    }
    const newHash = await this.passwordService.getHash(newPassword);
    await this.userService.updateUser({
      where: { id: userId },
      data: {
        hash: newHash,
      },
    });
    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.user.update({
      where: { email },
      data: {
        resetCode: code,
        resetCodeExp: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    try {
      await this.emailService.sendResetCode(email, code);
      return { message: 'Code sent' };
    } catch (e) {
      throw new BadRequestException(`Email sending failed ${e.message}`);
    }
  }

  async resetPasswordByCode(email: string, code: string, newPass: string) {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.resetCode || !user.resetCodeExp) {
      throw new BadRequestException('Invalid request');
    }

    if (new Date() > user.resetCodeExp) {
      throw new BadRequestException('Code expired');
    }

    if (user.resetCode !== code) {
      throw new BadRequestException('Invalid code');
    }
    const newHash = await this.passwordService.getHash(newPass);

    await this.userService.updateUser({
      where: { id: user.id },
      data: {
        hash: newHash,
        resetCode: null,
        resetCodeExp: null,
      },
    });

    return { message: 'Password updated' };
  }
}
