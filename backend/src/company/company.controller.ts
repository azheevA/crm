import {
  Post,
  Query,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './company.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { type SessionData, sessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить информацию о новой компании-клиента' })
  @ApiCreatedResponse({ type: CreateCompanyDto })
  create(
    @sessionInfo() session: SessionData,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return this.companyService.create(session.id as number, createCompanyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список компаний (курсорная пагинация по ID)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество записей',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: Number,
    description: 'ID последней компании с предыдущей страницы',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CreateCompanyDto' },
        },
        nextCursor: { type: 'number', nullable: true },
      },
    },
  })
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
  ) {
    return this.companyService.findAll(limit, skip);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить компанию по ID' })
  @ApiOkResponse({ type: CreateCompanyDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Изменить данные о компании по ID' })
  @ApiBody({ type: UpdateCompanyDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @sessionInfo() session: SessionData,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(
      id,
      session.id as number,
      updateCompanyDto,
    );
  }
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @sessionInfo() session: SessionData,
  ) {
    return this.companyService.remove(id, session.id as number);
  }
}
