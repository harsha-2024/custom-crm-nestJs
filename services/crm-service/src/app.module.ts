import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { HealthController } from './modules/health.controller';
import { ContactsController } from './modules/contacts.controller';
import { ContactsService } from './modules/contacts.service';
import { EventBus } from './modules/event-bus';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, ContactsController],
  providers: [PrismaService, ContactsService, EventBus],
})
export class AppModule {}
