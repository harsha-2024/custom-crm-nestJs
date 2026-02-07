import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EventBus } from './event-bus';

export interface CreateContactDto { email: string; firstName: string; lastName: string; phone?: string; companyId?: string; }

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService, private events: EventBus) {}
  list() { return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } }); }
  get(id: string) { return this.prisma.contact.findUnique({ where: { id } }); }
  async create(dto: CreateContactDto) {
    const contact = await this.prisma.contact.create({ data: dto as any });
    await this.events.publish('crm.contact.created', { id: contact.id, email: contact.email, firstName: contact.firstName, lastName: contact.lastName });
    return contact;
  }
  async update(id: string, dto: Partial<CreateContactDto>) {
    const contact = await this.prisma.contact.update({ where: { id }, data: dto });
    await this.events.publish('crm.contact.updated', { id: contact.id });
    return contact;
  }
  async remove(id: string) {
    await this.prisma.contact.delete({ where: { id } });
    await this.events.publish('crm.contact.deleted', { id });
    return { id };
  }
}
