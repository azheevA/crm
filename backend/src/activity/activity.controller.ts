import { Controller, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ActivityDto } from './activity.dto';

@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Получить ленту событий' })
  @ApiQuery({ name: 'dealId', required: false, type: Number })
  @ApiQuery({ name: 'companyId', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiOkResponse({ type: [ActivityDto] })
  findAll(
    @Query('dealId') dealId?: string,
    @Query('companyId') companyId?: string,
    @Query('limit') limit: string = '10',
    @Query('skip') skip: string = '0',
  ) {
    return this.activityService.findAll({
      dealId: dealId ? +dealId : undefined,
      companyId: companyId ? +companyId : undefined,
      limit: +limit,
      skip: +skip,
    });
  }
}
