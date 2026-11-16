import { Global, Module } from '@nestjs/common';
import { TenantController } from './tenant.controller.js';
import { TenantService } from './tenant.service.js';

@Global()
@Module({
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
