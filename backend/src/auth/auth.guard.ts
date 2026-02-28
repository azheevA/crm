import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CookieService } from './cookie.service';
import { JwtService } from '@nestjs/jwt';

export interface SessionData {
  id: number;
  userId?: string;
  email?: string;
  [key: string]: any;
}
interface AuthRequest extends Request {
  cookies: {
    [key: string]: string;
  };
  session?: SessionData;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const token = req.cookies[CookieService.tokenKey];

    if (!token) {
      throw new UnauthorizedException('Токен не найден');
    }

    try {
      const sessionInfo = await this.jwtService.verifyAsync<SessionData>(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      req.session = sessionInfo;
      return true;
    } catch (error) {
      console.error('Ошибка верификации токена:', error);
      throw new UnauthorizedException('Недействительный токен');
    }
  }
}
