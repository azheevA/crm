import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface SessionData {
  userId?: string;
  email?: string;
  [key: string]: any;
}

export const sessionInfo = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): SessionData => {
    const request = ctx.switchToHttp().getRequest<unknown>();
    const session = (request as { session?: SessionData }).session;

    if (!session) {
      throw new Error('Сессия не найдена. Проверьте AuthGuard.');
    }

    return session;
  },
);
