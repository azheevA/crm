import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountDto, PatchAccountDto } from './account.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetSessionInfoDto } from 'src/auth/auth.dto';
import { sessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('Account')
@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOkResponse({ type: AccountDto })
  @ApiOperation({ summary: 'Добавить доп. информацию профиля' })
  getAccount(@sessionInfo() session: GetSessionInfoDto): Promise<AccountDto> {
    return this.accountService.getAccount(session.id);
  }

  @Patch()
  @ApiOkResponse({ type: PatchAccountDto })
  @ApiOperation({ summary: 'Обновить доп. информацию профиля' })
  patchAccount(
    @Body() body: PatchAccountDto,
    @sessionInfo() session: GetSessionInfoDto,
  ): Promise<AccountDto> {
    return this.accountService.patchAccount(session.id, body);
  }
}
