import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ContactsService, CreateContactDto } from './contacts.service';

@Controller('crm/contacts')
export class ContactsController {
  constructor(private svc: ContactsService) {}
  @Get() list() { return this.svc.list(); }
  @Get(':id') get(@Param('id') id: string) { return this.svc.get(id); }
  @Post() create(@Body() dto: CreateContactDto) { return this.svc.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateContactDto>) { return this.svc.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
