import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskDto, UpdateTaskDto } from './tasks.dto';
import { AuthGuard, type SessionData } from 'src/auth/auth.guard';
import { sessionInfo } from 'src/auth/session-info.decorator';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Создать новую задачу',
    description:
      'Создает задачу и привязывает её к текущему пользователю. Можно опционально привязать к сделке.',
  })
  @ApiResponse({
    status: 201,
    description: 'Задача успешно создана',
    type: TaskDto,
  })
  create(@sessionInfo() session: SessionData, @Body() dto: CreateTaskDto) {
    return this.taskService.create(session.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список задач',
    description:
      'Возвращает все задачи текущего пользователя. Можно отфильтровать по конкретной сделке.',
  })
  @ApiQuery({
    name: 'dealId',
    required: false,
    description: 'ID сделки для фильтрации задач',
  })
  @ApiResponse({
    status: 200,
    description: 'Список задач получен',
    type: [TaskDto],
  })
  findAll(
    @sessionInfo() session: SessionData,
    @Query('dealId') dealId?: string,
  ) {
    return this.taskService.findAll(session.id, dealId ? +dealId : undefined);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить данные задачи',
    description:
      'Позволяет изменить заголовок, описание, дату дедлайна или статус выполнения.',
  })
  @ApiParam({ name: 'id', description: 'Индивидуальный ID задачи' })
  @ApiResponse({ status: 200, description: 'Задача обновлена' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить задачу',
    description: 'Безвозвратно удаляет задачу из системы.',
  })
  @ApiParam({ name: 'id', description: 'ID задачи для удаления' })
  @ApiResponse({ status: 200, description: 'Задача успешно удалена' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }

  @Patch(':id/toggle')
  @ApiOperation({
    summary: 'Переключить статус выполнения',
    description:
      'Быстро меняет статус задачи с "выполнено" на "не выполнено" и наоборот.',
  })
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.toggleTaskStatus(id);
  }
}
