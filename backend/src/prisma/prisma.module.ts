import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './prisma.service.js';

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class PrismaModule {}
