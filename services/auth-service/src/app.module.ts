import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { UsersService } from './modules/users/users.service';
import { HealthController } from './modules/health.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AuthController, HealthController],
  providers: [PrismaService, AuthService, UsersService],
})
export class AppModule {}
