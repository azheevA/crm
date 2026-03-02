import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  GetSessionInfoDto,
  ResetPasswordConfirmDto,
  SignInBodyDto,
  SignUpBodyDto,
} from './auth.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { sessionInfo } from './session-info.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse()
  async signUp(
    @Body() body: SignUpBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(
      body.email,
      body.password,
      body.name,
    );
    this.cookieService.setToken(res, accessToken);
  }

  @Post('sign-in')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: SignInBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(
      body.email,
      body.password,
    );
    this.cookieService.setToken(res, accessToken);
  }

  @Post('sign-out')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
  }

  @Get('session')
  @ApiOkResponse({
    type: GetSessionInfoDto,
  })
  @UseGuards(AuthGuard)
  getSessionInfo(@sessionInfo() session: GetSessionInfoDto) {
    return session;
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() body: ChangePasswordDto,
    @sessionInfo() session: GetSessionInfoDto,
  ) {
    return this.authService.changePassword(
      session.id,
      body.oldPassword,
      body.newPassword,
      body.confirmNewPassword,
    );
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password-confirm')
  @HttpCode(HttpStatus.OK)
  async resetPasswordConfirm(@Body() body: ResetPasswordConfirmDto) {
    return this.authService.resetPasswordByCode(
      body.email,
      body.code,
      body.newPassword,
    );
  }
}
