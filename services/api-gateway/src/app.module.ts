import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './modules/health.controller';
import { ProxyController } from './modules/proxy.controller';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true })], controllers: [HealthController, ProxyController] })
export class AppModule {}
