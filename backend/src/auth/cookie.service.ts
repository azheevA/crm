import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
@Injectable()
export class CookieService {
  static tokenKey = 'access-token';
  setToken(res: Response, token: string) {
    res.cookie(CookieService.tokenKey, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  removeToken(res: Response) {
    res.clearCookie(CookieService.tokenKey, {
      path: '/',
    });
  }
}
