import { Controller, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Get } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Получить ленту событий' })
  @ApiQuery({
    name: 'dealId',
    required: false,
    description: 'Фильтр по сделке',
  })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'Фильтр по компании',
  })
  findAll(
    @Query('dealId') dealId?: string,
    @Query('companyId') companyId?: string,
  ) {
    return this.activityService.findAll({
      dealId: dealId ? +dealId : undefined,
      companyId: companyId ? +companyId : undefined,
    });
  }
}
