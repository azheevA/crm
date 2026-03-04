import {
  Post,
  Query,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './company.dto';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить информацию о новой компании-клиента' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    default: 10,
    description: 'Количество записей',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: String,
    default: 0,
    description: 'Сколько записей пропустить',
  })
  @ApiOperation({ summary: 'Получить список компаний по запросу' })
  findAll(
    @Query('limit') limit: string = '10',
    @Query('skip') skip: string = '0',
  ) {
    return this.companyService.findAll(+limit, +skip);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить компанию по ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Изменить данные о компании по ID' })
  @ApiBody({ type: UpdateCompanyDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }
}
