import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './modules/health.controller';
import { ListenerService } from './modules/listener.service';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true })], controllers: [HealthController], providers: [ListenerService] })
export class AppModule {}
