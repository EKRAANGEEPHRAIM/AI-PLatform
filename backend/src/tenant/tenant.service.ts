import { Injectable, NotFoundException } from '@nestjs/common';
import type { Tenant } from '@prisma/client';
import { DatabaseService } from '../prisma/prisma.service';
import type { UpdateTenantDto } from './tenant.dto.js';

/** « Boutique Adjoua » → « boutique-adjoua-k3f9 » */
const slugify = (name: string): string =>
  `${name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'entreprise'}-${Math.random().toString(36).slice(2, 6)}`;

@Injectable()
export class TenantService {
  constructor(private readonly prisma: DatabaseService) {}

  createForName(name: string) {
    return this.prisma.tenant.create({ data: { name, slug: slugify(name) } });
  }

  /** Entreprise de l'utilisateur ; les comptes créés avant Akwaba en reçoivent une à la volée */
  async forUser(userId: string): Promise<Tenant> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { tenant: true } });
    if (!user) throw new NotFoundException('User not found');
    if (user.tenant) return user.tenant;

    const tenant = await this.createForName(`Entreprise de ${user.name}`);
    await this.prisma.user.update({ where: { id: userId }, data: { tenantId: tenant.id } });
    return tenant;
  }

  async update(userId: string, dto: UpdateTenantDto) {
    const tenant = await this.forUser(userId);
    return this.prisma.tenant.update({ where: { id: tenant.id }, data: dto });
  }

  findByWidgetKey(widgetKey: string) {
    return this.prisma.tenant.findUnique({ where: { widgetKey } });
  }
}
