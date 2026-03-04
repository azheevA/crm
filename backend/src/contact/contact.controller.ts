import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto } from './company.dto';
import { type SessionData, sessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый контакт' })
  @ApiResponse({ status: 201, description: 'Контакт успешно создан.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  create(
    @sessionInfo() session: SessionData,
    @Body() createContactDto: CreateContactDto,
  ) {
    return this.contactService.create(session.id as number, createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все контакты' })
  @ApiResponse({
    status: 200,
    description: 'Список контактов с вложенными компаниями.',
  })
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить контакт по ID' })
  @ApiParam({ name: 'id', description: 'Идентификатор контакта' })
  @ApiResponse({ status: 200, description: 'Данные контакта найдены.' })
  @ApiResponse({ status: 404, description: 'Контакт не найден.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные контакта' })
  @ApiParam({ name: 'id', description: 'ID существующего контакта' })
  @ApiResponse({ status: 200, description: 'Контакт успешно обновлен.' })
  @ApiResponse({ status: 404, description: 'Контакт с таким ID не найден.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @sessionInfo() session: SessionData,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(
      id,
      session.id as number,
      updateContactDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить контакт' })
  @ApiResponse({ status: 200, description: 'Контакт успешно удален.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @sessionInfo() session: SessionData,
  ) {
    return this.contactService.remove(id, session.id as number);
  }
}
