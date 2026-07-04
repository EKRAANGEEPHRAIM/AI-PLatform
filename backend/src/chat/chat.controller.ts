import { Controller, Post, Get, Body, Param, UseGuards, Request, UsePipes } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { SendMessageSchema, type SendMessageDto } from './dto/chat.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @UsePipes(new ZodValidationPipe(SendMessageSchema))
  async sendMessage(@Request() req: any, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.id, dto);
  }

  @Get('messages/:conversationId')
  async getMessages(@Request() req: any, @Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(req.user.id, conversationId);
  }
}
