import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, UsePipes } from '@nestjs/common';
import { ConversationsService } from './conversations.service.js';
import { CreateConversationSchema, UpdateConversationSchema, type CreateConversationDto, type UpdateConversationDto } from './dto/conversation.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateConversationSchema))
  async create(@Request() req: any, @Body() dto: CreateConversationDto) {
    return this.conversationsService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.conversationsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.conversationsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateConversationSchema)) dto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.conversationsService.remove(req.user.id, id);
  }
}
