import { Global, Module } from '@nestjs/common';
import { AssistantService } from './assistant.service.js';

@Global()
@Module({
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
