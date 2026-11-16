import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { TenantService } from './tenant.service.js';
import { UpdateTenantSchema, type UpdateTenantDto } from './tenant.dto.js';

/** Réglages de l'assistant de l'entreprise de l'utilisateur connecté */
@Controller('tenant')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  get(@Request() req: any) {
    return this.tenantService.forUser(req.user.id);
  }

  @Patch()
  update(@Request() req: any, @Body(new ZodValidationPipe(UpdateTenantSchema)) dto: UpdateTenantDto) {
    return this.tenantService.update(req.user.id, dto);
  }
}
