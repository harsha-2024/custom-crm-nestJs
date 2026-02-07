import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  findByEmail(email: string) { return this.prisma.user.findUnique({ where: { email } }); }
  async create(email: string, passwordHash: string, name?: string) {
    let tenant = await this.prisma.tenant.findFirst({ where: { name: 'Default' } });
    if (!tenant) tenant = await this.prisma.tenant.create({ data: { name: 'Default' } });
    return this.prisma.user.create({ data: { email, passwordHash, name, tenantId: tenant.id, role: 'admin' } });
  }
}
