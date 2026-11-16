import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConversationsModule } from './conversations/conversations.module.js';
import { ChatModule } from './chat/chat.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { AssistantModule } from './assistant/assistant.module.js';
import { TenantModule } from './tenant/tenant.module.js';
import { WidgetModule } from './widget/widget.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AssistantModule,
    TenantModule,
    AuthModule,
    ConversationsModule,
    ChatModule,
    AnalyticsModule,
    WidgetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
