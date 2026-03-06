import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  private readonly logger = new Logger(EmailService.name);
  constructor() {
    console.log(process.env.SMTP_PASS);
    this.transporter = createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendResetCode(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: `"Техническая поддержка" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Восстановление доступа к аккаунту',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <h2 style="margin-top: 0; color: #111827;">Восстановление доступа</h2>
        
        <p style="color: #374151; line-height: 1.6;">
          Мы получили запрос на восстановление доступа к вашему аккаунту.
        </p>

        <p style="color: #374151; line-height: 1.6;">
          Используйте код ниже для подтверждения операции:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 28px; letter-spacing: 4px; font-weight: bold; color: #8b5cf6;">
            ${code}
          </span>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          Код действителен в течение 15 минут.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
          Если вы не запрашивали восстановление доступа, просто проигнорируйте это письмо.
          Ваш аккаунт остаётся в безопасности.
        </p>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} SpaceFlow. Все права защищены.
        </p>

      </div>
    </div>
  `,
      });
      this.logger.log(`Успешно отравлен на ваш email: ${email}`);
    } catch (error) {
      this.logger.error(`Неудачная отправка на ${email}`, error.stack);
      throw error;
    }
  }
}
