import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { WidgetService } from './widget.service.js';
import { WidgetMessageSchema, type WidgetMessageDto } from './widget.dto.js';

/**
 * API publique du widget de chat (sans connexion) : les visiteurs du site d'une
 * entreprise discutent avec son assistant. La clé du widget identifie l'entreprise.
 */
@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get(':key')
  config(@Param('key') key: string) {
    return this.widgetService.publicConfig(key);
  }

  @Post(':key/messages')
  send(@Param('key') key: string, @Body(new ZodValidationPipe(WidgetMessageSchema)) dto: WidgetMessageDto) {
    return this.widgetService.sendMessage(key, dto);
  }
}
