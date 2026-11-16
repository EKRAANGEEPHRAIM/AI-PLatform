import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    // Record allows   
    const user = (req as unknown as Record<string, unknown>)['user'] as { tenantId?: string } | undefined;
    if (user?.tenantId) {
      (req as unknown as Record<string, unknown>)['tenantId'] = user.tenantId;
    }
    next();
  }
}
