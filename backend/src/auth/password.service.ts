import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class PasswordService {
  async getHash(password: string): Promise<string> {
    try {
      return await hash(password);
    } catch (error) {
      console.error('Argon2 ошибка хеша:', error);
      throw new InternalServerErrorException('Error processing password');
    }
  }

  async compare(hash: string, plain: string): Promise<boolean> {
    try {
      return await verify(hash, plain);
    } catch (e) {
      console.error('Error comparing password hash:', e);
      return false;
    }
  }
}
