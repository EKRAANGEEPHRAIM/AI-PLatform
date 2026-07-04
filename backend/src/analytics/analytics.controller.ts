import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardStats(@Request() req: any) {
    return this.analyticsService.getDashboardStats(req.user.id);
  }

  @Get('conversations-by-day')
  async getConversationsByDay(@Request() req: any, @Query('days') days?: string) {
    return this.analyticsService.getConversationsByDay(req.user.id, days ? parseInt(days) : 30);
  }

  @Get('messages-by-day')
  async getMessagesByDay(@Request() req: any, @Query('days') days?: string) {
    return this.analyticsService.getMessagesByDay(req.user.id, days ? parseInt(days) : 30);
  }

  @Get('recent')
  async getRecentConversations(@Request() req: any, @Query('limit') limit?: string) {
    return this.analyticsService.getRecentConversations(req.user.id, limit ? parseInt(limit) : 5);
  }

  @Get('global')
  async getGlobalStats() {
    return this.analyticsService.getGlobalStats();
  }
}
