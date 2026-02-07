import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './modules/health.controller';
import { SearchController } from './modules/search.controller';
import { SearchService } from './modules/search.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, SearchController],
  providers: [SearchService],
})
export class AppModule {}
