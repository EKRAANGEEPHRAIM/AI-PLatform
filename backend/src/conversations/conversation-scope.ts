import type { Prisma } from '@prisma/client';
import type { DatabaseService } from '../prisma/prisma.service';

/**
 * Conversations visibles par un utilisateur : ses tests internes, et les
 * conversations des visiteurs du widget de son entreprise.
 */
export async function visibleConversations(
  prisma: DatabaseService,
  userId: string,
): Promise<Prisma.ConversationWhereInput> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tenantId: true } });
  return user?.tenantId
    ? { OR: [{ userId }, { tenantId: user.tenantId, channel: 'WIDGET' }] }
    : { userId };
}
