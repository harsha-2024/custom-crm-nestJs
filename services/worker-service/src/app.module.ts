import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './modules/health.controller';
import { JobsService } from './modules/jobs.service';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true })], controllers: [HealthController], providers: [JobsService] })
export class AppModule {}
